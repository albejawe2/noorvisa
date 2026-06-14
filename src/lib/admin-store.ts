// مخزن لوحة التحكم — مرتبط بالكامل بـ Supabase / Lovable Cloud
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
export async function signup(username: string, password: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const email = usernameToEmail(username);
  const { error } = await supabase.auth.signUp({
    email, password,
    options: { emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/admin` : undefined },
  });
  if (error) return { ok: false, error: error.message };
  await supabase.auth.signInWithPassword({ email, password });
  return { ok: true };
}
export async function logout(): Promise<void> { await supabase.auth.signOut(); }
export async function isAuthed(): Promise<boolean> {
  const { data } = await supabase.auth.getUser();
  return !!data.user;
}
export async function getUsername(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  return data.user?.email ? emailToUsername(data.user.email) : "admin";
}
export async function getUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}
export async function changeCredentials(opts: {
  currentPassword: string; newUsername?: string; newPassword?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user?.email) return { ok: false, error: "لم يتم العثور على المستخدم" };
  const reauth = await supabase.auth.signInWithPassword({ email: u.user.email, password: opts.currentPassword });
  if (reauth.error) return { ok: false, error: "كلمة السر الحالية غير صحيحة" };
  if (opts.newPassword && opts.newPassword.length < 6) return { ok: false, error: "كلمة السر قصيرة" };
  const updates: { email?: string; password?: string } = {};
  if (opts.newUsername) {
    const newEmail = usernameToEmail(opts.newUsername);
    if (newEmail !== u.user.email) updates.email = newEmail;
  }
  if (opts.newPassword) updates.password = opts.newPassword;
  if (!Object.keys(updates).length) return { ok: true };
  const { error } = await supabase.auth.updateUser(updates);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/* ---------------- Types ---------------- */
export type AppStatus = "new" | "in_review" | "approved" | "rejected" | "issued";
export type VisaApp = {
  id: string; customer_id?: string | null;
  full_name: string; phone: string; email?: string | null;
  country: string; visa_type: string; status: AppStatus;
  price: number; paid: number; currency: string;
  appointment_date?: string | null; submission_date?: string | null;
  decision_date?: string | null; travel_date?: string | null;
  passport_no?: string | null; nationality?: string | null;
  notes?: string | null; created_at: string;
  track_code?: string | null;
  paddle_transaction_id?: string | null;
  paddle_checkout_url?: string | null;
};
export type Customer = {
  id: string; full_name: string; phone?: string | null; email?: string | null;
  passport_no?: string | null; nationality?: string | null; dob?: string | null;
  gender?: string | null; address?: string | null; notes?: string | null;
  created_at: string;
};
export type DocRow = {
  id: string; app_id?: string | null; customer_id?: string | null;
  kind: string; file_path: string; file_name: string;
  file_size?: number | null; mime_type?: string | null;
  ocr_data?: Record<string, unknown> | null; created_at: string;
};
export type Payment = {
  id: string; app_id: string; amount: number; currency: string;
  method?: string | null; note?: string | null; paid_at: string;
};
export type Task = {
  id: string; app_id?: string | null; title: string; description?: string | null;
  due_date?: string | null; done: boolean; created_at: string;
};
export type Template = {
  id: string; name: string; country: string; visa_type: string;
  default_price: number; currency: string; checklist: string[];
  notes?: string | null; created_at: string;
};
export type Invoice = {
  id: string; number: string; app_id?: string | null; customer_id?: string | null;
  issued_at: string; due_at?: string | null;
  subtotal: number; tax: number; total: number; currency: string;
  status: string; items: { description: string; qty: number; price: number }[];
  notes?: string | null; created_at: string;
};
export type Notification = {
  id: string; user_id?: string | null; title: string; body?: string | null;
  kind: string; link?: string | null; read: boolean; created_at: string;
};
export type Activity = {
  id: string; actor?: string | null; entity_type: string; entity_id?: string | null;
  action: string; meta?: Record<string, unknown> | null; created_at: string;
};

export const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      });

/* ---------------- Visa Apps ---------------- */
export async function listApps(): Promise<VisaApp[]> {
  const { data, error } = await supabase.from("visa_apps").select("*").order("created_at", { ascending: false });
  if (error) { console.error(error); return []; }
  return data as VisaApp[];
}
export async function upsertApp(app: Partial<VisaApp> & { id: string }): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from("visa_apps").upsert(app as never);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
export async function deleteApp(id: string) { await supabase.from("visa_apps").delete().eq("id", id); }

/* ---------------- Customers ---------------- */
export async function listCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
  if (error) { console.error(error); return []; }
  return data as Customer[];
}
export async function upsertCustomer(c: Partial<Customer> & { id: string }) {
  const { error } = await supabase.from("customers").upsert(c as never);
  return { ok: !error, error: error?.message };
}
export async function deleteCustomer(id: string) { await supabase.from("customers").delete().eq("id", id); }

/* ---------------- Documents / Storage ---------------- */
const BUCKET = "visa-files";

export async function uploadDocument(opts: {
  file: File; appId?: string | null; customerId?: string | null;
  kind?: string; ocrData?: Record<string, unknown> | null;
}): Promise<{ ok: boolean; doc?: DocRow; error?: string }> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return { ok: false, error: "not authenticated" };
  const ext = opts.file.name.split(".").pop() || "bin";
  const path = `${u.user.id}/${opts.appId || opts.customerId || "general"}/${newId()}.${ext}`;
  const up = await supabase.storage.from(BUCKET).upload(path, opts.file, {
    contentType: opts.file.type, upsert: false,
  });
  if (up.error) return { ok: false, error: up.error.message };
  const ins = await supabase.from("documents").insert({
    app_id: opts.appId ?? null,
    customer_id: opts.customerId ?? null,
    kind: opts.kind ?? "other",
    file_path: path,
    file_name: opts.file.name,
    file_size: opts.file.size,
    mime_type: opts.file.type,
    ocr_data: opts.ocrData ?? null,
    uploaded_by: u.user.id,
  } as never).select().single();
  if (ins.error) return { ok: false, error: ins.error.message };
  return { ok: true, doc: ins.data as DocRow };
}

export async function listDocuments(appId?: string): Promise<DocRow[]> {
  let q = supabase.from("documents").select("*").order("created_at", { ascending: false });
  if (appId) q = q.eq("app_id", appId);
  const { data, error } = await q;
  if (error) { console.error(error); return []; }
  return data as DocRow[];
}

export async function getDocumentUrl(path: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
  if (error) return null;
  return data.signedUrl;
}

export async function deleteDocument(doc: DocRow) {
  await supabase.storage.from(BUCKET).remove([doc.file_path]);
  await supabase.from("documents").delete().eq("id", doc.id);
}

export async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

/* ---------------- Payments ---------------- */
export async function listPayments(appId?: string): Promise<Payment[]> {
  let q = supabase.from("payments").select("*").order("paid_at", { ascending: false });
  if (appId) q = q.eq("app_id", appId);
  const { data, error } = await q;
  if (error) { console.error(error); return []; }
  return data as Payment[];
}
export async function addPayment(p: Omit<Payment, "id"> & { id?: string }) {
  const { error } = await supabase.from("payments").insert({ ...p, id: p.id ?? newId() } as never);
  const all = await listPayments(p.app_id);
  const total = all.reduce((s, x) => s + Number(x.amount || 0), 0);
  await supabase.from("visa_apps").update({ paid: total } as never).eq("id", p.app_id);
  return { ok: !error, error: error?.message };
}
export async function deletePayment(id: string, appId: string) {
  await supabase.from("payments").delete().eq("id", id);
  const all = await listPayments(appId);
  const total = all.reduce((s, x) => s + Number(x.amount || 0), 0);
  await supabase.from("visa_apps").update({ paid: total } as never).eq("id", appId);
}

/* ---------------- Tasks ---------------- */
export async function listTasks(): Promise<Task[]> {
  const { data, error } = await supabase.from("tasks").select("*").order("due_date", { ascending: true, nullsFirst: false });
  if (error) { console.error(error); return []; }
  return data as Task[];
}
export async function upsertTask(t: Partial<Task> & { id: string }) {
  const { error } = await supabase.from("tasks").upsert(t as never);
  return { ok: !error, error: error?.message };
}
export async function deleteTask(id: string) { await supabase.from("tasks").delete().eq("id", id); }

/* ---------------- Templates ---------------- */
export async function listTemplates(): Promise<Template[]> {
  const { data, error } = await supabase.from("templates").select("*").order("name");
  if (error) { console.error(error); return []; }
  return ((data as unknown) as Template[]).map(t => ({ ...t, checklist: Array.isArray(t.checklist) ? t.checklist : [] }));
}
export async function upsertTemplate(t: Partial<Template> & { id?: string }) {
  const row = { ...t, id: t.id ?? newId() };
  const { error } = await supabase.from("templates").upsert(row as never);
  return { ok: !error, error: error?.message };
}
export async function deleteTemplate(id: string) { await supabase.from("templates").delete().eq("id", id); }

/* ---------------- Invoices ---------------- */
export async function listInvoices(): Promise<Invoice[]> {
  const { data, error } = await supabase.from("invoices").select("*").order("issued_at", { ascending: false });
  if (error) { console.error(error); return []; }
  return (data as unknown) as Invoice[];
}
export async function upsertInvoice(inv: Partial<Invoice> & { id?: string }) {
  const row = { ...inv, id: inv.id ?? newId() };
  const { data, error } = await supabase.from("invoices").upsert(row as never).select().single();
  return { ok: !error, error: error?.message, data: (data as unknown) as Invoice | null };
}
export async function deleteInvoice(id: string) { await supabase.from("invoices").delete().eq("id", id); }

/* ---------------- Notifications ---------------- */
export async function listNotifications(limit = 30): Promise<Notification[]> {
  const uid = await getUserId();
  if (!uid) return [];
  const { data, error } = await supabase.from("notifications").select("*")
    .or(`user_id.eq.${uid},user_id.is.null`).order("created_at", { ascending: false }).limit(limit);
  if (error) { console.error(error); return []; }
  return (data as unknown) as Notification[];
}
export async function markNotificationRead(id: string) {
  await supabase.from("notifications").update({ read: true } as never).eq("id", id);
}
export async function markAllRead() {
  const uid = await getUserId();
  if (!uid) return;
  await supabase.from("notifications").update({ read: true } as never).or(`user_id.eq.${uid},user_id.is.null`).eq("read", false);
}
export async function addNotification(n: Partial<Notification>) {
  await supabase.from("notifications").insert({ id: newId(), ...n } as never);
}

/* ---------------- Activity ---------------- */
export async function listActivity(limit = 100): Promise<Activity[]> {
  const { data, error } = await supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(limit);
  if (error) { console.error(error); return []; }
  return (data as unknown) as Activity[];
}

/* ---------------- Roles ---------------- */
export type AppRole = "admin" | "staff" | "viewer";
export async function listStaff(): Promise<{ user_id: string; role: AppRole; email?: string }[]> {
  const { data, error } = await supabase.from("user_roles").select("user_id, role");
  if (error) return [];
  return data as { user_id: string; role: AppRole }[];
}
export async function myRole(): Promise<AppRole | null> {
  const uid = await getUserId(); if (!uid) return null;
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid).order("role").limit(1).single();
  return (data?.role as AppRole) ?? null;
}
