
-- 1) Notifications
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  kind text NOT NULL DEFAULT 'info',
  link text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage notifications" ON public.notifications
  FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE INDEX notifications_user_idx ON public.notifications(user_id, read, created_at DESC);

-- 2) Templates
CREATE TABLE public.templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text NOT NULL,
  visa_type text NOT NULL,
  default_price numeric(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  checklist jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.templates TO authenticated;
GRANT ALL ON public.templates TO service_role;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage templates" ON public.templates
  FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER templates_set_updated_at BEFORE UPDATE ON public.templates FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3) Invoices
CREATE SEQUENCE IF NOT EXISTS public.invoice_number_seq START 1000;
CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text NOT NULL UNIQUE DEFAULT ('INV-' || lpad(nextval('public.invoice_number_seq')::text, 6, '0')),
  app_id uuid REFERENCES public.visa_apps(id) ON DELETE SET NULL,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  issued_at timestamptz NOT NULL DEFAULT now(),
  due_at timestamptz,
  subtotal numeric(12,2) NOT NULL DEFAULT 0,
  tax numeric(12,2) NOT NULL DEFAULT 0,
  total numeric(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'draft',
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT USAGE, SELECT ON SEQUENCE public.invoice_number_seq TO authenticated;
GRANT ALL ON SEQUENCE public.invoice_number_seq TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage invoices" ON public.invoices
  FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER invoices_set_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4) visa_apps additions
ALTER TABLE public.visa_apps
  ADD COLUMN IF NOT EXISTS track_code text UNIQUE,
  ADD COLUMN IF NOT EXISTS paddle_transaction_id text,
  ADD COLUMN IF NOT EXISTS paddle_checkout_url text;

-- Auto-generate track_code (e.g. NV-XXXXXX) on insert
CREATE OR REPLACE FUNCTION public.generate_track_code()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  code text;
  tries int := 0;
BEGIN
  IF NEW.track_code IS NULL OR NEW.track_code = '' THEN
    LOOP
      code := 'NV-' || upper(substring(md5(random()::text || clock_timestamp()::text), 1, 6));
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.visa_apps WHERE track_code = code) OR tries > 8;
      tries := tries + 1;
    END LOOP;
    NEW.track_code := code;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS visa_apps_track_code ON public.visa_apps;
CREATE TRIGGER visa_apps_track_code BEFORE INSERT ON public.visa_apps
  FOR EACH ROW EXECUTE FUNCTION public.generate_track_code();

-- Backfill existing
UPDATE public.visa_apps SET track_code = 'NV-' || upper(substring(md5(id::text), 1, 6))
WHERE track_code IS NULL;

-- 5) Public tracking RPC (security definer, returns only safe fields)
CREATE OR REPLACE FUNCTION public.lookup_app_by_track_code(_code text)
RETURNS TABLE(
  track_code text,
  full_name text,
  country text,
  visa_type text,
  status text,
  appointment_date timestamptz,
  submission_date timestamptz,
  decision_date timestamptz,
  travel_date date,
  created_at timestamptz
) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT track_code, full_name, country, visa_type, status,
         appointment_date, submission_date, decision_date, travel_date, created_at
  FROM public.visa_apps
  WHERE track_code = upper(trim(_code))
  LIMIT 1;
$$;
GRANT EXECUTE ON FUNCTION public.lookup_app_by_track_code(text) TO anon, authenticated;

-- 6) Activity log auto-recorders
CREATE OR REPLACE FUNCTION public.log_activity()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.activity_log(actor, entity_type, entity_id, action, meta)
  VALUES (
    auth.uid(),
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    lower(TG_OP),
    CASE WHEN TG_OP='DELETE'
      THEN jsonb_build_object('old', to_jsonb(OLD))
      ELSE jsonb_build_object('new', to_jsonb(NEW))
    END
  );
  RETURN COALESCE(NEW, OLD);
END $$;

DROP TRIGGER IF EXISTS log_visa_apps ON public.visa_apps;
CREATE TRIGGER log_visa_apps AFTER INSERT OR UPDATE OR DELETE ON public.visa_apps
  FOR EACH ROW EXECUTE FUNCTION public.log_activity();
DROP TRIGGER IF EXISTS log_payments ON public.payments;
CREATE TRIGGER log_payments AFTER INSERT OR UPDATE OR DELETE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.log_activity();
DROP TRIGGER IF EXISTS log_customers ON public.customers;
CREATE TRIGGER log_customers AFTER INSERT OR UPDATE OR DELETE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.log_activity();
DROP TRIGGER IF EXISTS log_tasks ON public.tasks;
CREATE TRIGGER log_tasks AFTER INSERT OR UPDATE OR DELETE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.log_activity();

-- 7) Seed a few templates
INSERT INTO public.templates(name, country, visa_type, default_price, currency, checklist) VALUES
  ('USA — تأشيرة سياحية B1/B2', 'الولايات المتحدة', 'سياحية', 250, 'USD',
    '["جواز سفر ساري","صورة شخصية","كشف حساب بنكي 6 أشهر","حجز فندق","تذاكر طيران","DS-160"]'::jsonb),
  ('UK — تأشيرة طالب', 'المملكة المتحدة', 'دراسية', 480, 'USD',
    '["جواز سفر","CAS من الجامعة","كشف حساب","شهادات أكاديمية","شهادة IELTS","فحص TB"]'::jsonb),
  ('Schengen — سياحية', 'دول الشنغن', 'سياحية', 150, 'EUR',
    '["جواز سفر","صورة شخصية","حجز فندق","تأمين سفر","كشف حساب","تذاكر طيران"]'::jsonb)
ON CONFLICT DO NOTHING;
