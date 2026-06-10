// Simple local admin auth + data store.
// Credentials are stored in localStorage (hashed with SubtleCrypto SHA-256).
// All data lives client-side; no backend required.

const CRED_KEY = "noorvisa_admin_cred_v1";
const SESSION_KEY = "noorvisa_admin_session_v1";
const APPS_KEY = "noorvisa_admin_apps_v1";

const DEFAULT_USER = "admin";
const DEFAULT_PASS = "10468416";

async function sha256(text: string): Promise<string> {
  const buf = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

type Cred = { username: string; passHash: string };

async function getCred(): Promise<Cred> {
  if (typeof window === "undefined") return { username: DEFAULT_USER, passHash: "" };
  const raw = localStorage.getItem(CRED_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch { /* fallthrough */ }
  }
  const c: Cred = { username: DEFAULT_USER, passHash: await sha256(DEFAULT_PASS) };
  localStorage.setItem(CRED_KEY, JSON.stringify(c));
  return c;
}

export async function login(username: string, password: string): Promise<boolean> {
  const cred = await getCred();
  const h = await sha256(password);
  if (username.trim() === cred.username && h === cred.passHash) {
    localStorage.setItem(SESSION_KEY, "1");
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SESSION_KEY) === "1";
}

export async function getUsername(): Promise<string> {
  return (await getCred()).username;
}

export async function changeCredentials(opts: {
  currentPassword: string;
  newUsername?: string;
  newPassword?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const cred = await getCred();
  const h = await sha256(opts.currentPassword);
  if (h !== cred.passHash) return { ok: false, error: "كلمة السر الحالية غير صحيحة" };
  const username = (opts.newUsername?.trim() || cred.username);
  const passHash = opts.newPassword ? await sha256(opts.newPassword) : cred.passHash;
  if (opts.newPassword && opts.newPassword.length < 6) {
    return { ok: false, error: "كلمة السر يجب أن تكون 6 أحرف على الأقل" };
  }
  if (username.length < 3) return { ok: false, error: "اسم المستخدم قصير جداً" };
  localStorage.setItem(CRED_KEY, JSON.stringify({ username, passHash }));
  return { ok: true };
}

/* ---------- Applications store ---------- */

export type AppStatus = "new" | "in_review" | "approved" | "rejected" | "issued";

export type VisaApp = {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  country: string;     // destination
  visaType: string;    // tourist / student / medical / work
  status: AppStatus;
  price: number;       // USD
  notes?: string;
  createdAt: number;
};

function seed(): VisaApp[] {
  const now = Date.now();
  const day = 86400000;
  return [
    { id: "n1", fullName: "أحمد العلي", phone: "+962780000001", country: "تركيا", visaType: "سياحية", status: "approved", price: 180, createdAt: now - day * 2 },
    { id: "n2", fullName: "سارة محمد", phone: "+962780000002", country: "ألمانيا", visaType: "دراسية", status: "in_review", price: 450, createdAt: now - day * 5 },
    { id: "n3", fullName: "يوسف كريم", phone: "+962780000003", country: "الإمارات", visaType: "عمل", status: "issued", price: 320, createdAt: now - day * 8 },
    { id: "n4", fullName: "ليلى حسن", phone: "+962780000004", country: "كندا", visaType: "سياحية", status: "new", price: 600, createdAt: now - day * 1 },
    { id: "n5", fullName: "محمد ناصر", phone: "+962780000005", country: "بريطانيا", visaType: "علاجية", status: "rejected", price: 520, createdAt: now - day * 12 },
    { id: "n6", fullName: "هدى أمين", phone: "+962780000006", country: "إسبانيا", visaType: "سياحية", status: "approved", price: 280, createdAt: now - day * 15 },
  ];
}

export function listApps(): VisaApp[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(APPS_KEY);
  if (!raw) {
    const s = seed();
    localStorage.setItem(APPS_KEY, JSON.stringify(s));
    return s;
  }
  try { return JSON.parse(raw); } catch { return []; }
}

function saveApps(apps: VisaApp[]) {
  localStorage.setItem(APPS_KEY, JSON.stringify(apps));
}

export function upsertApp(app: VisaApp) {
  const all = listApps();
  const idx = all.findIndex((a) => a.id === app.id);
  if (idx >= 0) all[idx] = app; else all.unshift(app);
  saveApps(all);
}

export function deleteApp(id: string) {
  saveApps(listApps().filter((a) => a.id !== id));
}

export function newId(): string {
  return "a" + Math.random().toString(36).slice(2, 10);
}
