import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard, FileText, Settings, LogOut, Plus, Search, Trash2, Edit3,
  TrendingUp, Users, CheckCircle2, Clock, XCircle, DollarSign, Menu, X, Lock, Eye, EyeOff,
} from "lucide-react";
import {
  isAuthed, login, logout, getUsername, changeCredentials,
  listApps, upsertApp, deleteApp, newId,
  type VisaApp, type AppStatus,
} from "@/lib/admin-store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة التحكم — NoorVisa" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

type Tab = "overview" | "applications" | "settings";

const STATUS_LABEL: Record<AppStatus, string> = {
  new: "جديد",
  in_review: "قيد المراجعة",
  approved: "موافق عليه",
  issued: "صادر",
  rejected: "مرفوض",
};
const STATUS_COLOR: Record<AppStatus, string> = {
  new: "bg-blue-100 text-blue-800 border-blue-200",
  in_review: "bg-amber-100 text-amber-800 border-amber-200",
  approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
  issued: "bg-purple-100 text-purple-800 border-purple-200",
  rejected: "bg-rose-100 text-rose-800 border-rose-200",
};

function AdminPage() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => { setAuthed(isAuthed()); setReady(true); }, []);

  if (!ready) {
    return <div className="min-h-screen bg-[#1a0f08] grid place-items-center text-[#d4af37]">...</div>;
  }
  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => setAuthed(false)} />;
}

/* ---------------- Login ---------------- */
function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setLoading(true);
    const ok = await login(u, p);
    setLoading(false);
    if (ok) onSuccess(); else setErr("بيانات الدخول غير صحيحة");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10"
         style={{ background: "linear-gradient(135deg,#1a0f08 0%,#2a1a0f 50%,#3d2715 100%)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl mb-4"
               style={{ background: "linear-gradient(135deg,#d4af37,#c9a04a)" }}>
            <Lock className="size-8 text-[#1a0f08]" />
          </div>
          <h1 className="text-3xl font-bold text-[#f7f1e6]">لوحة التحكم</h1>
          <p className="text-[#d4af37]/70 mt-2 text-sm">NoorVisa — تسجيل دخول الإدارة</p>
        </div>

        <form onSubmit={submit}
              className="bg-[#2a1a0f]/80 backdrop-blur border border-[#d4af37]/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <label className="block mb-4">
            <span className="block text-xs font-bold text-[#d4af37] mb-2 uppercase tracking-wider">اسم المستخدم</span>
            <input value={u} onChange={(e) => setU(e.target.value)} autoFocus required
                   className="w-full bg-[#1a0f08] border border-[#d4af37]/30 rounded-xl px-4 py-3 text-[#f7f1e6] focus:outline-none focus:border-[#d4af37] text-base"
                   placeholder="admin" />
          </label>
          <label className="block mb-2">
            <span className="block text-xs font-bold text-[#d4af37] mb-2 uppercase tracking-wider">كلمة السر</span>
            <div className="relative">
              <input value={p} onChange={(e) => setP(e.target.value)} required
                     type={show ? "text" : "password"}
                     className="w-full bg-[#1a0f08] border border-[#d4af37]/30 rounded-xl px-4 py-3 ltr:pr-12 rtl:pl-12 text-[#f7f1e6] focus:outline-none focus:border-[#d4af37] text-base"
                     placeholder="••••••••" />
              <button type="button" onClick={() => setShow(!show)}
                      className="absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3 text-[#d4af37]/70 hover:text-[#d4af37]">
                {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </label>
          {err && (
            <div className="mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-sm text-center">
              {err}
            </div>
          )}
          <button type="submit" disabled={loading}
                  className="w-full mt-6 py-3.5 rounded-xl font-bold text-[#1a0f08] disabled:opacity-60 transition-transform active:scale-95"
                  style={{ background: "linear-gradient(135deg,#d4af37,#c9a04a)" }}>
            {loading ? "جارٍ الدخول..." : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------------- Dashboard Layout ---------------- */
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [sidebar, setSidebar] = useState(false);
  const [username, setUsername] = useState("admin");

  useEffect(() => { getUsername().then(setUsername); }, []);

  const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
    { id: "applications", label: "الطلبات", icon: FileText },
    { id: "settings", label: "الإعدادات", icon: Settings },
  ];

  function handleLogout() {
    logout(); onLogout();
  }

  function go(t: Tab) { setTab(t); setSidebar(false); }

  return (
    <div className="min-h-screen flex" style={{ background: "#f5efe4" }}>
      {/* Mobile overlay */}
      {sidebar && (
        <div onClick={() => setSidebar(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 rtl:right-0 ltr:left-0 h-screen w-72 z-50 flex flex-col transition-transform
        ${sidebar ? "translate-x-0" : "rtl:translate-x-full ltr:-translate-x-full"} lg:translate-x-0`}
        style={{ background: "linear-gradient(180deg,#2a1a0f,#1a0f08)" }}>
        <div className="p-6 border-b border-[#d4af37]/20 flex items-center justify-between">
          <div>
            <div className="text-[#d4af37] text-xs font-bold tracking-wider">NOORVISA</div>
            <div className="text-[#f7f1e6] text-xl font-bold mt-1">لوحة التحكم</div>
          </div>
          <button onClick={() => setSidebar(false)} className="lg:hidden text-[#f7f1e6]">
            <X className="size-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => go(t.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                  ${active ? "text-[#1a0f08] shadow-lg" : "text-[#f7f1e6]/80 hover:bg-[#d4af37]/10 hover:text-[#f7f1e6]"}`}
                style={active ? { background: "linear-gradient(135deg,#d4af37,#c9a04a)" } : {}}>
                <Icon className="size-5 shrink-0" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#d4af37]/20 space-y-2">
          <div className="px-4 py-2 rounded-xl bg-[#d4af37]/10 text-[#d4af37] text-xs font-bold flex items-center gap-2">
            <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            متصل كـ {username}
          </div>
          <button onClick={() => navigate({ to: "/" })}
                  className="w-full px-4 py-2.5 rounded-xl text-[#f7f1e6]/70 hover:text-[#f7f1e6] hover:bg-[#d4af37]/10 text-sm flex items-center gap-2">
            ← العودة للموقع
          </button>
          <button onClick={handleLogout}
                  className="w-full px-4 py-2.5 rounded-xl text-rose-300 hover:bg-rose-500/15 text-sm flex items-center gap-2 font-semibold">
            <LogOut className="size-4" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-[#2a1a0f]/10 px-4 sm:px-6 py-3 flex items-center justify-between">
          <button onClick={() => setSidebar(true)} className="lg:hidden p-2 -m-2">
            <Menu className="size-6 text-[#2a1a0f]" />
          </button>
          <div>
            <div className="text-lg sm:text-xl font-bold text-[#2a1a0f]">
              {tabs.find((t) => t.id === tab)?.label}
            </div>
          </div>
          <div className="size-10 rounded-full grid place-items-center font-bold text-[#1a0f08]"
               style={{ background: "linear-gradient(135deg,#d4af37,#c9a04a)" }}>
            {username.charAt(0).toUpperCase()}
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {tab === "overview" && <OverviewTab />}
          {tab === "applications" && <ApplicationsTab />}
          {tab === "settings" && <SettingsTab onCredChanged={(u) => setUsername(u)} />}
        </div>
      </main>
    </div>
  );
}

/* ---------------- Overview ---------------- */
function OverviewTab() {
  const [apps, setApps] = useState<VisaApp[]>([]);
  useEffect(() => { setApps(listApps()); }, []);

  const stats = useMemo(() => {
    const total = apps.length;
    const pending = apps.filter((a) => a.status === "new" || a.status === "in_review").length;
    const approved = apps.filter((a) => a.status === "approved" || a.status === "issued").length;
    const revenue = apps.filter((a) => a.status === "approved" || a.status === "issued").reduce((s, a) => s + a.price, 0);
    return { total, pending, approved, revenue };
  }, [apps]);

  const byCountry = useMemo(() => {
    const map = new Map<string, number>();
    apps.forEach((a) => map.set(a.country, (map.get(a.country) ?? 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [apps]);

  const recent = useMemo(() => [...apps].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5), [apps]);
  const maxCountry = Math.max(1, ...byCountry.map(([, n]) => n));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="إجمالي الطلبات" value={stats.total} icon={Users} tint="from-blue-500 to-blue-700" />
        <StatCard label="قيد المعالجة" value={stats.pending} icon={Clock} tint="from-amber-500 to-orange-600" />
        <StatCard label="ناجحة" value={stats.approved} icon={CheckCircle2} tint="from-emerald-500 to-emerald-700" />
        <StatCard label="إيرادات (USD)" value={`$${stats.revenue.toLocaleString()}`} icon={DollarSign} tint="from-[#d4af37] to-[#6b3a1a]" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#2a1a0f]/8 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-base sm:text-lg font-bold text-[#2a1a0f]">أعلى الدول طلباً</div>
              <div className="text-xs text-[#6b3a1a]/70 mt-0.5">حسب عدد الطلبات</div>
            </div>
            <TrendingUp className="size-5 text-[#d4af37]" />
          </div>
          {byCountry.length === 0 ? (
            <div className="text-center py-8 text-[#6b3a1a]/60 text-sm">لا توجد بيانات بعد</div>
          ) : (
            <div className="space-y-3">
              {byCountry.map(([c, n]) => (
                <div key={c}>
                  <div className="flex justify-between text-sm font-semibold text-[#2a1a0f] mb-1.5">
                    <span>{c}</span><span className="text-[#6b3a1a]">{n}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#ece0c8] overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                         style={{ width: `${(n / maxCountry) * 100}%`, background: "linear-gradient(90deg,#d4af37,#6b3a1a)" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#2a1a0f]/8 shadow-sm">
          <div className="text-base sm:text-lg font-bold text-[#2a1a0f] mb-1">أحدث الطلبات</div>
          <div className="text-xs text-[#6b3a1a]/70 mb-4">آخر 5 طلبات</div>
          {recent.length === 0 ? (
            <div className="text-center py-8 text-[#6b3a1a]/60 text-sm">لا توجد طلبات بعد</div>
          ) : (
            <div className="space-y-2.5">
              {recent.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-[#f7f1e6] hover:bg-[#ece0c8] transition-colors">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[#2a1a0f] truncate">{a.fullName}</div>
                    <div className="text-xs text-[#6b3a1a]/80 mt-0.5">{a.country} • {a.visaType}</div>
                  </div>
                  <span className={`shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full border ${STATUS_COLOR[a.status]}`}>
                    {STATUS_LABEL[a.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, tint }: { label: string; value: string | number; icon: typeof Users; tint: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#2a1a0f]/8 shadow-sm">
      <div className={`size-10 rounded-xl bg-gradient-to-br ${tint} grid place-items-center mb-3`}>
        <Icon className="size-5 text-white" />
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-[#2a1a0f] leading-none">{value}</div>
      <div className="text-xs sm:text-sm text-[#6b3a1a]/80 mt-2 font-medium">{label}</div>
    </div>
  );
}

/* ---------------- Applications ---------------- */
function ApplicationsTab() {
  const [apps, setApps] = useState<VisaApp[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<AppStatus | "all">("all");
  const [editing, setEditing] = useState<VisaApp | null>(null);
  const [creating, setCreating] = useState(false);

  function refresh() { setApps(listApps()); }
  useEffect(refresh, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return apps
      .filter((a) => filter === "all" ? true : a.status === filter)
      .filter((a) => !t ? true : (a.fullName + a.country + a.phone + a.visaType).toLowerCase().includes(t))
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [apps, q, filter]);

  function onDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا الطلب؟")) return;
    deleteApp(id); refresh();
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-[#2a1a0f]/8 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="size-4 absolute top-1/2 -translate-y-1/2 rtl:right-3 ltr:left-3 text-[#6b3a1a]/60" />
          <input value={q} onChange={(e) => setQ(e.target.value)}
                 placeholder="بحث بالاسم أو البلد أو رقم الجوال..."
                 className="w-full bg-[#f7f1e6] rounded-xl py-2.5 rtl:pr-10 ltr:pl-10 px-4 text-sm text-[#2a1a0f] focus:outline-none focus:ring-2 focus:ring-[#d4af37]" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value as AppStatus | "all")}
                className="bg-[#f7f1e6] rounded-xl py-2.5 px-3 text-sm font-medium text-[#2a1a0f] focus:outline-none focus:ring-2 focus:ring-[#d4af37]">
          <option value="all">كل الحالات</option>
          {(Object.keys(STATUS_LABEL) as AppStatus[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABEL[s]}</option>
          ))}
        </select>
        <button onClick={() => setCreating(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-[#1a0f08] text-sm active:scale-95 transition-transform"
                style={{ background: "linear-gradient(135deg,#d4af37,#c9a04a)" }}>
          <Plus className="size-4" /> طلب جديد
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#2a1a0f]/8">
          <FileText className="size-12 mx-auto text-[#d4af37]/40 mb-3" />
          <p className="text-[#6b3a1a]">لا توجد طلبات مطابقة</p>
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="grid sm:hidden gap-3">
            {filtered.map((a) => (
              <div key={a.id} className="bg-white rounded-2xl p-4 border border-[#2a1a0f]/8 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="font-bold text-[#2a1a0f]">{a.fullName}</div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLOR[a.status]}`}>
                    {STATUS_LABEL[a.status]}
                  </span>
                </div>
                <div className="text-xs text-[#6b3a1a] space-y-1">
                  <div>📍 {a.country} • {a.visaType}</div>
                  <div>📞 {a.phone}</div>
                  <div>💰 ${a.price}</div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-[#2a1a0f]/8">
                  <button onClick={() => setEditing(a)}
                          className="flex-1 py-2 rounded-lg bg-[#f7f1e6] text-[#2a1a0f] text-xs font-bold inline-flex items-center justify-center gap-1">
                    <Edit3 className="size-3.5" /> تعديل
                  </button>
                  <button onClick={() => onDelete(a.id)}
                          className="flex-1 py-2 rounded-lg bg-rose-50 text-rose-700 text-xs font-bold inline-flex items-center justify-center gap-1">
                    <Trash2 className="size-3.5" /> حذف
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block bg-white rounded-2xl border border-[#2a1a0f]/8 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#f7f1e6] text-[#6b3a1a]">
                  <tr>
                    <th className="text-start px-4 py-3 font-bold">العميل</th>
                    <th className="text-start px-4 py-3 font-bold">الوجهة</th>
                    <th className="text-start px-4 py-3 font-bold">النوع</th>
                    <th className="text-start px-4 py-3 font-bold">الحالة</th>
                    <th className="text-start px-4 py-3 font-bold">السعر</th>
                    <th className="text-start px-4 py-3 font-bold"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => (
                    <tr key={a.id} className="border-t border-[#2a1a0f]/5 hover:bg-[#f7f1e6]/50">
                      <td className="px-4 py-3">
                        <div className="font-bold text-[#2a1a0f]">{a.fullName}</div>
                        <div className="text-xs text-[#6b3a1a]/70 mt-0.5">{a.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-[#2a1a0f]">{a.country}</td>
                      <td className="px-4 py-3 text-[#2a1a0f]">{a.visaType}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${STATUS_COLOR[a.status]}`}>
                          {STATUS_LABEL[a.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#2a1a0f]">${a.price}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <button onClick={() => setEditing(a)}
                                  className="size-8 grid place-items-center rounded-lg bg-[#f7f1e6] hover:bg-[#ece0c8] text-[#2a1a0f]">
                            <Edit3 className="size-4" />
                          </button>
                          <button onClick={() => onDelete(a.id)}
                                  className="size-8 grid place-items-center rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700">
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {(editing || creating) && (
        <AppEditor
          initial={editing ?? undefined}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSaved={() => { setEditing(null); setCreating(false); refresh(); }}
        />
      )}
    </div>
  );
}

function AppEditor({ initial, onClose, onSaved }: { initial?: VisaApp; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<VisaApp>(
    initial ?? { id: newId(), fullName: "", phone: "", country: "", visaType: "سياحية", status: "new", price: 0, createdAt: Date.now() }
  );

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName.trim() || !form.country.trim() || !form.phone.trim()) return;
    upsertApp(form);
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 grid place-items-end sm:place-items-center p-0 sm:p-4">
      <form onSubmit={save}
            className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto">
        <div className="p-5 sm:p-6 border-b border-[#2a1a0f]/8 flex items-center justify-between sticky top-0 bg-white">
          <div className="text-lg font-bold text-[#2a1a0f]">{initial ? "تعديل طلب" : "طلب جديد"}</div>
          <button type="button" onClick={onClose} className="size-9 grid place-items-center rounded-lg hover:bg-[#f7f1e6]">
            <X className="size-5" />
          </button>
        </div>
        <div className="p-5 sm:p-6 space-y-3.5">
          <Field label="الاسم الكامل" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} required />
          <Field label="رقم الجوال" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
          <Field label="البريد الإلكتروني" value={form.email ?? ""} onChange={(v) => setForm({ ...form, email: v })} type="email" />
          <Field label="الوجهة" value={form.country} onChange={(v) => setForm({ ...form, country: v })} required />
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs font-bold text-[#6b3a1a] mb-1.5">نوع التأشيرة</span>
              <select value={form.visaType} onChange={(e) => setForm({ ...form, visaType: e.target.value })}
                      className="w-full bg-[#f7f1e6] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]">
                {["سياحية", "دراسية", "عمل", "علاجية", "عائلية", "تجارية"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="block text-xs font-bold text-[#6b3a1a] mb-1.5">الحالة</span>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as AppStatus })}
                      className="w-full bg-[#f7f1e6] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]">
                {(Object.keys(STATUS_LABEL) as AppStatus[]).map((s) => (
                  <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                ))}
              </select>
            </label>
          </div>
          <Field label="السعر (USD)" type="number" value={String(form.price)} onChange={(v) => setForm({ ...form, price: Number(v) || 0 })} />
          <label className="block">
            <span className="block text-xs font-bold text-[#6b3a1a] mb-1.5">ملاحظات</span>
            <textarea value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3}
                      className="w-full bg-[#f7f1e6] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]" />
          </label>
        </div>
        <div className="p-5 sm:p-6 border-t border-[#2a1a0f]/8 sticky bottom-0 bg-white flex gap-3">
          <button type="button" onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-[#f7f1e6] text-[#2a1a0f] font-bold text-sm">إلغاء</button>
          <button type="submit"
                  className="flex-1 py-3 rounded-xl font-bold text-[#1a0f08] text-sm"
                  style={{ background: "linear-gradient(135deg,#d4af37,#c9a04a)" }}>حفظ</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-[#6b3a1a] mb-1.5">{label}{required && " *"}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} type={type} required={required}
             className="w-full bg-[#f7f1e6] rounded-xl px-3 py-2.5 text-sm text-[#2a1a0f] focus:outline-none focus:ring-2 focus:ring-[#d4af37]" />
    </label>
  );
}

/* ---------------- Settings ---------------- */
function SettingsTab({ onCredChanged }: { onCredChanged: (newUsername: string) => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { getUsername().then(setNewUsername); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null); setBusy(true);
    const r = await changeCredentials({
      currentPassword,
      newUsername: newUsername.trim(),
      newPassword: newPassword || undefined,
    });
    setBusy(false);
    if (r.ok) {
      setMsg({ type: "ok", text: "تم حفظ التعديلات بنجاح" });
      setCurrentPassword(""); setNewPassword("");
      onCredChanged(newUsername.trim());
    } else {
      setMsg({ type: "err", text: r.error });
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-[#2a1a0f]/8 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="size-11 rounded-xl grid place-items-center" style={{ background: "linear-gradient(135deg,#d4af37,#c9a04a)" }}>
            <Lock className="size-5 text-[#1a0f08]" />
          </div>
          <div>
            <div className="text-lg font-bold text-[#2a1a0f]">تغيير بيانات الدخول</div>
            <div className="text-xs text-[#6b3a1a]/70 mt-0.5">حدّث اسم المستخدم أو كلمة السر</div>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Field label="كلمة السر الحالية" type="password" value={currentPassword} onChange={setCurrentPassword} required />
          <div className="h-px bg-[#2a1a0f]/8 my-2" />
          <Field label="اسم المستخدم الجديد" value={newUsername} onChange={setNewUsername} />
          <Field label="كلمة السر الجديدة (اتركها فارغة لعدم التغيير)" type="password" value={newPassword} onChange={setNewPassword} />

          {msg && (
            <div className={`p-3 rounded-xl text-sm text-center border ${
              msg.type === "ok"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-rose-50 border-rose-200 text-rose-700"
            }`}>
              {msg.type === "ok" ? <CheckCircle2 className="inline size-4 ms-1" /> : <XCircle className="inline size-4 ms-1" />}
              {msg.text}
            </div>
          )}

          <button type="submit" disabled={busy}
                  className="w-full py-3 rounded-xl font-bold text-[#1a0f08] disabled:opacity-60 transition-transform active:scale-95"
                  style={{ background: "linear-gradient(135deg,#d4af37,#c9a04a)" }}>
            {busy ? "جارٍ الحفظ..." : "حفظ التغييرات"}
          </button>
        </form>
      </div>

      <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-900">
        <strong>ملاحظة:</strong> البيانات محفوظة في متصفحك بشكل آمن. لاستخدام اللوحة من جهاز آخر تحتاج لإعادة إعداد كلمة السر من ذلك الجهاز.
      </div>
    </div>
  );
}
