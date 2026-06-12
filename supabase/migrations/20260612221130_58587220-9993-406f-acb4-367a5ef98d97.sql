
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','staff'))
$$;

-- Storage policies for visa-files bucket (staff only)
CREATE POLICY "staff read visa-files" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'visa-files' AND public.is_staff(auth.uid()));
CREATE POLICY "staff insert visa-files" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'visa-files' AND public.is_staff(auth.uid()));
CREATE POLICY "staff update visa-files" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'visa-files' AND public.is_staff(auth.uid()));
CREATE POLICY "staff delete visa-files" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'visa-files' AND public.is_staff(auth.uid()));
