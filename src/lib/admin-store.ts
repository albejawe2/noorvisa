// مخزن لوحة التحكم — مرتبط بالكامل بـ Supabase
// المصادقة عبر Supabase Auth، والطلبات في جدول public.visa_apps
import { supabase } from "@/integrations/supabase/client";

const EMAIL_DOMAIN = "noorvisa.local";
const usernameToEmail = (u: string) =>
  u.includes("@") ? u.trim().toLowerCase() : `${u.trim().toLowerCase()}@${EMAIL_DOMAIN}`;
const emailToUsername = (e: string) =>
  e.endsWith(`@${EMAIL_DOMAIN}`) ? e.slice(0, -1 - EMAIL_DOMAIN.length) : e;

/* ---------------- Auth ---------------- */

export async function login(username: string, password: string): Promise<boolean> {
  const email = usernameToEmail(username);
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return !error;
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}

export async function isAuthed(): Promise<boolean> {
  const { data } = await supabase.auth.getUser();
  return !!data.user;
}

export async function getUsername(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  return data.user?.email ? emailToUsername(data.user.email) : "admin";
}

export async function changeCredentials(opts: {
  currentPassword: string;
  newUsername?: string;
  newPassword?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user?.email) return { ok: false, error: "لم يتم العثور على المستخدم" };

  // إعادة التحقق من كلمة السر الحالية
  const reauth = await supabase.auth.signInWithPassword({
    email: u.user.email,
    password: opts.currentPassword,
  });
  if (reauth.error) return { ok: false, error: "كلمة السر الحالية غير صحيحة" };

  if (opts.newPassword && opts.newPassword.length < 6) {
    return { ok: false, error: "كلمة السر يجب أن تكون 6 أحرف على الأقل" };
  }
  const newUsername = opts.newUsername?.trim();
  if (newUsername !== undefined && newUsername.length < 3) {
    return { ok: false, error: "اسم المستخدم قصير جداً" };
  }

  const updates: { email?: string; password?: string } = {};
  if (newUsername) {
    const newEmail = usernameToEmail(newUsername);
    if (newEmail !== u.user.email) updates.email = newEmail;
  }
  if (opts.newPassword) updates.password = opts.newPassword;

  if (Object.keys(updates).length === 0) return { ok: true };

  const { error } = await supabase.auth.updateUser(updates);
  if (error) return { ok: false, error: error.message || "فشل تحديث البيانات" };
  return { ok: true };
}

/* ---------------- Applications ---------------- */

export type AppStatus = "new" | "in_review" | "approved" | "rejected" | "issued";

export type VisaApp = {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  country: string;
  visaType: string;
  status: AppStatus;
  price: number;
  notes?: string;
  createdAt: number;
};

type Row = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  country: string;
  visa_type: string;
  status: AppStatus;
  price: number | string;
  notes: string | null;
  created_at: string;
};

const fromRow = (r: Row): VisaApp => ({
  id: r.id,
  fullName: r.full_name,
  phone: r.phone,
  email: r.email ?? undefined,
  country: r.country,
  visaType: r.visa_type,
  status: r.status,
  price: Number(r.price) || 0,
  notes: r.notes ?? undefined,
  createdAt: new Date(r.created_at).getTime(),
});

const toRow = (a: VisaApp) => ({
  id: a.id,
  full_name: a.fullName,
  phone: a.phone,
  email: a.email || null,
  country: a.country,
  visa_type: a.visaType,
  status: a.status,
  price: a.price,
  notes: a.notes || null,
  created_at: new Date(a.createdAt).toISOString(),
});

export async function listApps(): Promise<VisaApp[]> {
  const { data, error } = await supabase
    .from("visa_apps")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("listApps error:", error);
    return [];
  }
  return (data as Row[]).map(fromRow);
}

export async function upsertApp(app: VisaApp): Promise<void> {
  const { error } = await supabase.from("visa_apps").upsert(toRow(app));
  if (error) console.error("upsertApp error:", error);
}

export async function deleteApp(id: string): Promise<void> {
  const { error } = await supabase.from("visa_apps").delete().eq("id", id);
  if (error) console.error("deleteApp error:", error);
}

export function newId(): string {
  // UUID v4 — متوافق مع عمود uuid في PostgreSQL
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
