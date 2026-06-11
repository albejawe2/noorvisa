-- =====================================================================
-- NoorVisa — إعداد قاعدة البيانات على Supabase
-- شغّل هذا الملف مرة واحدة في:  Supabase Dashboard → SQL Editor → New query
-- =====================================================================

-- 1) جدول طلبات التأشيرات
create table if not exists public.visa_apps (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  phone       text not null,
  email       text,
  country     text not null,
  visa_type   text not null default 'سياحية',
  status      text not null default 'new'
              check (status in ('new','in_review','approved','issued','rejected')),
  price       numeric not null default 0,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists visa_apps_created_at_idx on public.visa_apps (created_at desc);

-- 2) صلاحيات الـ Data API
grant select, insert, update, delete on public.visa_apps to authenticated;
grant all on public.visa_apps to service_role;

-- 3) RLS — فقط المستخدم المسجّل (الأدمن) يقرأ/يكتب
alter table public.visa_apps enable row level security;

drop policy if exists "admin_read"   on public.visa_apps;
drop policy if exists "admin_insert" on public.visa_apps;
drop policy if exists "admin_update" on public.visa_apps;
drop policy if exists "admin_delete" on public.visa_apps;

create policy "admin_read"   on public.visa_apps for select to authenticated using (true);
create policy "admin_insert" on public.visa_apps for insert to authenticated with check (true);
create policy "admin_update" on public.visa_apps for update to authenticated using (true) with check (true);
create policy "admin_delete" on public.visa_apps for delete to authenticated using (true);

-- =====================================================================
-- 4) إنشاء حساب الأدمن
-- اذهب إلى:  Authentication → Users → Add user → "Create new user"
--   Email:    admin@noorvisa.local
--   Password: 10468416
--   فعّل خيار  "Auto Confirm User"  ✅
-- يمكنك لاحقاً تغيير الإيميل/كلمة السر من داخل لوحة التحكم.
-- =====================================================================
