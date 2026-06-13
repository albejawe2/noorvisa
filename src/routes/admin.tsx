import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  LayoutDashboard, FileText, Settings, LogOut, Plus, Search, Trash2, Edit3,
  Users, CheckCircle2, Clock, XCircle, DollarSign, Menu, X, Lock, Eye, EyeOff,
  Upload, ScanLine, Loader2, Download, Calendar, Wallet, ListChecks, BarChart3,
} from "lucide-react";
import Reports from "@/components/admin/Reports";
import {
  isAuthed, login, signup, logout, getUsername, changeCredentials,
  listApps, upsertApp, deleteApp, newId,
  listCustomers, upsertCustomer, deleteCustomer,
  listDocuments, uploadDocument, getDocumentUrl, deleteDocument, fileToDataUrl,
  listPayments, addPayment, deletePayment,
  listTasks, upsertTask, deleteTask,
  type VisaApp, type AppStatus, type Customer, type DocRow, type Payment, type Task,
} from "@/lib/admin-store";
import { extractPassport } from "@/lib/ocr.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "لوحة التحكم — NoorVisa" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminPage,
});

type Tab = "overview" | "applications" | "customers" | "documents" | "payments" | "tasks" | "reports" | "settings";

const STATUS_LABEL: Record<AppStatus, string> = {
  new: "جديد", in_review: "قيد المراجعة", approved: "موافق عليه", issued: "صادر", rejected: "مرفوض",
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
  useEffect(() => { isAuthed().then((v) => { setAuthed(v); setReady(true); }); }, []);
  if (!ready) return <div className="min-h-screen bg-[#1a0f08] grid place-items-center text-[#d4af37]">...</div>;
  if (!authed) return <AuthScreen onSuccess={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => setAuthed(false)} />;
}

/* ================= AUTH ================= */
function AuthScreen({ onSuccess }: { onSuccess: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [u, setU] = useState(""); const [p, setP] = useState("");
  const [show, setShow] = useState(false); const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setLoading(true);
    if (mode === "login") {
      const ok = await login(u, p); setLoading(false);
      if (ok) onSuccess(); else setErr("بيانات الدخول غير صحيحة");
    } else {
      const res = await signup(u, p); setLoading(false);
      if (res.ok) onSuccess(); else setErr(res.error);
    }
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
          <p className="text-[#d4af37]/70 mt-2 text-sm">NoorVisa — منصة إدارة التأشيرات</p>
        </div>

        <form onSubmit={submit} className="bg-[#2a1a0f]/80 backdrop-blur border border-[#d4af37]/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex bg-[#1a0f08] rounded-xl p-1 mb-6">
            {(["login","signup"] as const).map(m => (
              <button key={m} type="button" onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${mode===m?"text-[#1a0f08]":"text-[#d4af37]/70"}`}
                style={mode===m?{background:"linear-gradient(135deg,#d4af37,#c9a04a)"}:{}}>
                {m==="login"?"تسجيل دخول":"إنشاء حساب"}
              </button>
            ))}
          </div>
          <label className="block mb-4">
            <span className="block text-xs font-bold text-[#d4af37] mb-2 uppercase tracking-wider">اسم المستخدم</span>
            <input value={u} onChange={(e)=>setU(e.target.value)} autoFocus required minLength={3}
              className="w-full bg-[#1a0f08] border border-[#d4af37]/30 rounded-xl px-4 py-3 text-[#f7f1e6] focus:outline-none focus:border-[#d4af37]"
              placeholder="admin" />
          </label>
          <label className="block mb-2">
            <span className="block text-xs font-bold text-[#d4af37] mb-2 uppercase tracking-wider">كلمة السر</span>
            <div className="relative">
              <input value={p} onChange={(e)=>setP(e.target.value)} required minLength={6}
                type={show?"text":"password"}
                className="w-full bg-[#1a0f08] border border-[#d4af37]/30 rounded-xl px-4 py-3 ltr:pr-12 rtl:pl-12 text-[#f7f1e6] focus:outline-none focus:border-[#d4af37]"
                placeholder="••••••••" />
              <button type="button" onClick={()=>setShow(!show)} className="absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3 text-[#d4af37]/70">
                {show?<EyeOff className="size-5"/>:<Eye className="size-5"/>}
              </button>
            </div>
          </label>
          {mode==="signup" && (
            <p className="text-xs text-[#d4af37]/60 mt-3">أول حساب يُسجَّل يحصل تلقائياً على صلاحيات المدير الكاملة.</p>
          )}
          {err && <div className="mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-sm text-center">{err}</div>}
          <button type="submit" disabled={loading}
            className="w-full mt-6 py-3.5 rounded-xl font-bold text-[#1a0f08] disabled:opacity-60 active:scale-95 transition"
            style={{background:"linear-gradient(135deg,#d4af37,#c9a04a)"}}>
            {loading?"...":(mode==="login"?"دخول":"إنشاء حساب")}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ================= DASHBOARD ================= */
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [sidebar, setSidebar] = useState(false);
  const [username, setUsername] = useState("admin");
  useEffect(() => { getUsername().then(setUsername); }, []);

  const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
    { id: "applications", label: "الطلبات", icon: FileText },
    { id: "customers", label: "العملاء", icon: Users },
    { id: "documents", label: "الملفات", icon: Upload },
    { id: "payments", label: "المدفوعات", icon: Wallet },
    { id: "tasks", label: "المهام", icon: ListChecks },
    { id: "settings", label: "الإعدادات", icon: Settings },
  ];

  async function handleLogout() { await logout(); onLogout(); }
  function go(t: Tab) { setTab(t); setSidebar(false); }

  return (
    <div className="min-h-screen flex" style={{ background:"#f5efe4" }}>
      {sidebar && <div onClick={()=>setSidebar(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden"/>}
      <aside className={`fixed lg:sticky top-0 rtl:right-0 ltr:left-0 h-screen w-72 z-50 flex flex-col transition-transform
        ${sidebar?"translate-x-0":"rtl:translate-x-full ltr:-translate-x-full"} lg:translate-x-0`}
        style={{background:"linear-gradient(180deg,#2a1a0f,#1a0f08)"}}>
        <div className="p-6 border-b border-[#d4af37]/20 flex items-center justify-between">
          <div>
            <div className="text-[#d4af37] text-xs font-bold tracking-wider">NOORVISA</div>
            <div className="text-[#f7f1e6] text-xl font-bold mt-1">منصة الإدارة</div>
          </div>
          <button onClick={()=>setSidebar(false)} className="lg:hidden text-[#f7f1e6]"><X className="size-6"/></button>
        </div>
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {tabs.map(t=>{
            const Icon=t.icon; const active=tab===t.id;
            return (
              <button key={t.id} onClick={()=>go(t.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                  ${active?"text-[#1a0f08] shadow-lg":"text-[#f7f1e6]/80 hover:bg-[#d4af37]/10 hover:text-[#f7f1e6]"}`}
                style={active?{background:"linear-gradient(135deg,#d4af37,#c9a04a)"}:{}}>
                <Icon className="size-5 shrink-0"/><span>{t.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#d4af37]/20 space-y-2">
          <div className="px-4 py-2 rounded-xl bg-[#d4af37]/10 text-[#d4af37] text-xs font-bold flex items-center gap-2">
            <div className="size-2 rounded-full bg-emerald-400 animate-pulse"/>متصل كـ {username}
          </div>
          <button onClick={()=>navigate({to:"/"})} className="w-full px-4 py-2.5 rounded-xl text-[#f7f1e6]/70 hover:text-[#f7f1e6] hover:bg-[#d4af37]/10 text-sm">← العودة للموقع</button>
          <button onClick={handleLogout} className="w-full px-4 py-2.5 rounded-xl text-rose-300 hover:bg-rose-500/15 text-sm flex items-center gap-2 font-semibold"><LogOut className="size-4"/>تسجيل الخروج</button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-[#2a1a0f]/10 px-4 sm:px-6 py-3 flex items-center justify-between">
          <button onClick={()=>setSidebar(true)} className="lg:hidden p-2 -m-2"><Menu className="size-6 text-[#2a1a0f]"/></button>
          <div className="text-lg sm:text-xl font-bold text-[#2a1a0f]">{tabs.find(t=>t.id===tab)?.label}</div>
          <div className="size-10 rounded-full grid place-items-center font-bold text-[#1a0f08]" style={{background:"linear-gradient(135deg,#d4af37,#c9a04a)"}}>{username.charAt(0).toUpperCase()}</div>
        </header>
        <div className="p-4 sm:p-6">
          {tab==="overview" && <Overview/>}
          {tab==="applications" && <Applications/>}
          {tab==="customers" && <Customers/>}
          {tab==="documents" && <Documents/>}
          {tab==="payments" && <Payments/>}
          {tab==="tasks" && <Tasks/>}
          {tab==="settings" && <SettingsTab/>}
        </div>
      </main>
    </div>
  );
}

/* ================= OVERVIEW ================= */
function Overview() {
  const [apps, setApps] = useState<VisaApp[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(()=>{ listApps().then(setApps); listTasks().then(setTasks); },[]);
  const stats = useMemo(()=>{
    const total = apps.length;
    const byStatus = apps.reduce((acc, a) => { acc[a.status]=(acc[a.status]||0)+1; return acc; }, {} as Record<string, number>);
    const revenue = apps.reduce((s, a) => s + Number(a.price||0), 0);
    const collected = apps.reduce((s, a) => s + Number(a.paid||0), 0);
    return { total, byStatus, revenue, collected, due: revenue - collected };
  },[apps]);

  const cards = [
    { label: "إجمالي الطلبات", value: stats.total, icon: FileText, color: "from-blue-500 to-blue-600" },
    { label: "قيد المراجعة", value: stats.byStatus.in_review||0, icon: Clock, color: "from-amber-500 to-amber-600" },
    { label: "موافق عليها", value: (stats.byStatus.approved||0)+(stats.byStatus.issued||0), icon: CheckCircle2, color: "from-emerald-500 to-emerald-600" },
    { label: "مرفوضة", value: stats.byStatus.rejected||0, icon: XCircle, color: "from-rose-500 to-rose-600" },
    { label: "إجمالي الإيرادات", value: stats.revenue.toLocaleString()+" $", icon: DollarSign, color: "from-purple-500 to-purple-600" },
    { label: "المُحصَّل", value: stats.collected.toLocaleString()+" $", icon: Wallet, color: "from-teal-500 to-teal-600" },
    { label: "المستحقات", value: stats.due.toLocaleString()+" $", icon: DollarSign, color: "from-orange-500 to-orange-600" },
    { label: "مهام مفتوحة", value: tasks.filter(t=>!t.done).length, icon: ListChecks, color: "from-indigo-500 to-indigo-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((c,i)=>{
          const Icon=c.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#2a1a0f]/5">
              <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${c.color} text-white mb-3`}><Icon className="size-5"/></div>
              <div className="text-xs sm:text-sm text-[#2a1a0f]/60 font-semibold">{c.label}</div>
              <div className="text-xl sm:text-2xl font-bold text-[#2a1a0f] mt-1">{c.value}</div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#2a1a0f]/5">
        <h3 className="font-bold text-[#2a1a0f] mb-4">آخر الطلبات</h3>
        {apps.slice(0,5).map(a=>(
          <div key={a.id} className="flex items-center justify-between py-3 border-b border-[#2a1a0f]/5 last:border-0">
            <div className="min-w-0">
              <div className="font-semibold text-[#2a1a0f] truncate">{a.full_name}</div>
              <div className="text-xs text-[#2a1a0f]/60 mt-0.5">{a.country} · {a.visa_type}</div>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full border ${STATUS_COLOR[a.status]}`}>{STATUS_LABEL[a.status]}</span>
          </div>
        ))}
        {apps.length===0 && <div className="text-center text-sm text-[#2a1a0f]/50 py-6">لا توجد طلبات بعد</div>}
      </div>
    </div>
  );
}

/* ================= APPLICATIONS ================= */
const blankApp = (): VisaApp => ({
  id: newId(), full_name:"", phone:"", email:"", country:"", visa_type:"",
  status:"new", price:0, paid:0, currency:"USD",
  appointment_date:null, submission_date:null, decision_date:null, travel_date:null,
  passport_no:"", nationality:"", notes:"", created_at:new Date().toISOString(),
});

function Applications() {
  const [apps, setApps] = useState<VisaApp[]>([]);
  const [q, setQ] = useState(""); const [status, setStatus] = useState<AppStatus|"all">("all");
  const [edit, setEdit] = useState<VisaApp|null>(null);
  const reload = () => listApps().then(setApps);
  useEffect(()=>{ reload(); },[]);

  const filtered = useMemo(()=>apps.filter(a=>{
    if (status!=="all" && a.status!==status) return false;
    if (q && !`${a.full_name} ${a.phone} ${a.country} ${a.passport_no||""}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }),[apps,q,status]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 -translate-y-1/2 rtl:right-3 ltr:left-3 size-5 text-[#2a1a0f]/40"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="ابحث بالاسم أو الهاتف..."
            className="w-full bg-white border border-[#2a1a0f]/10 rounded-xl pl-4 pr-11 py-3 text-sm focus:outline-none focus:border-[#d4af37]"/>
        </div>
        <select value={status} onChange={e=>setStatus(e.target.value as AppStatus|"all")} className="bg-white border border-[#2a1a0f]/10 rounded-xl px-4 py-3 text-sm">
          <option value="all">كل الحالات</option>
          {Object.entries(STATUS_LABEL).map(([k,v])=><option key={k} value={k}>{v}</option>)}
        </select>
        <button onClick={()=>setEdit(blankApp())} className="px-5 py-3 rounded-xl font-bold text-[#1a0f08] text-sm flex items-center gap-2 active:scale-95"
          style={{background:"linear-gradient(135deg,#d4af37,#c9a04a)"}}>
          <Plus className="size-4"/>طلب جديد
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#2a1a0f]/5 overflow-hidden">
        {filtered.length===0 ? (
          <div className="text-center text-sm text-[#2a1a0f]/50 py-16">لا توجد نتائج</div>
        ) : (
          <div className="divide-y divide-[#2a1a0f]/5">
            {filtered.map(a=>(
              <div key={a.id} className="p-4 hover:bg-[#f5efe4]/50 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#2a1a0f]">{a.full_name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLOR[a.status]}`}>{STATUS_LABEL[a.status]}</span>
                  </div>
                  <div className="text-xs text-[#2a1a0f]/60 mt-1">{a.phone} · {a.country} · {a.visa_type}</div>
                  <div className="text-xs text-[#2a1a0f]/50 mt-0.5">{Number(a.price).toLocaleString()} {a.currency} (مدفوع {Number(a.paid).toLocaleString()})</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>setEdit(a)} className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"><Edit3 className="size-4"/></button>
                  <button onClick={async()=>{ if(confirm("حذف الطلب؟")){ await deleteApp(a.id); reload(); }}} className="p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100"><Trash2 className="size-4"/></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {edit && <AppEditor app={edit} onClose={()=>{setEdit(null); reload();}} />}
    </div>
  );
}

function AppEditor({ app, onClose }: { app: VisaApp; onClose: () => void }) {
  const [f, setF] = useState<VisaApp>(app);
  const [busy, setBusy] = useState(false);
  const [ocrBusy, setOcrBusy] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const extract = useServerFn(extractPassport);

  async function save() {
    setBusy(true); setErr("");
    const r = await upsertApp(f);
    setBusy(false);
    if (!r.ok) setErr(r.error||"خطأ"); else onClose();
  }

  async function onPassportFile(file: File) {
    setOcrBusy(true); setErr("");
    try {
      const dataUrl = await fileToDataUrl(file);
      const out = await extract({ data: { imageDataUrl: dataUrl }});
      setF(prev => ({
        ...prev,
        full_name: out.full_name || prev.full_name,
        passport_no: out.passport_no || prev.passport_no,
        nationality: out.nationality || prev.nationality,
      }));
      // ارفع الصورة كملف مرفق
      await uploadDocument({ file, appId: f.id, kind: "passport", ocrData: out as Record<string, unknown> });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "فشل استخراج البيانات");
    } finally { setOcrBusy(false); }
  }

  const fields: { k: keyof VisaApp; label: string; type?: string; full?: boolean }[] = [
    { k:"full_name", label:"الاسم الكامل" },
    { k:"phone", label:"الهاتف" },
    { k:"email", label:"البريد", type:"email" },
    { k:"country", label:"الدولة" },
    { k:"visa_type", label:"نوع التأشيرة" },
    { k:"passport_no", label:"رقم الجواز" },
    { k:"nationality", label:"الجنسية" },
    { k:"price", label:"السعر", type:"number" },
    { k:"paid", label:"المدفوع", type:"number" },
    { k:"currency", label:"العملة" },
    { k:"appointment_date", label:"تاريخ الموعد", type:"datetime-local" },
    { k:"submission_date", label:"تاريخ التقديم", type:"datetime-local" },
    { k:"decision_date", label:"تاريخ القرار", type:"datetime-local" },
    { k:"travel_date", label:"تاريخ السفر", type:"date" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-3xl max-h-[95vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl">
        <div className="sticky top-0 bg-white border-b border-[#2a1a0f]/10 px-5 py-4 flex items-center justify-between">
          <h3 className="font-bold text-[#2a1a0f]">{app.full_name?"تعديل طلب":"طلب جديد"}</h3>
          <button onClick={onClose} className="p-2 -m-2"><X className="size-5"/></button>
        </div>
        <div className="p-5 space-y-4">
          <button type="button" onClick={()=>fileRef.current?.click()} disabled={ocrBusy}
            className="w-full p-4 rounded-2xl border-2 border-dashed border-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37]/15 flex items-center justify-center gap-3 text-[#2a1a0f] font-semibold disabled:opacity-60">
            {ocrBusy ? <Loader2 className="size-5 animate-spin"/> : <ScanLine className="size-5"/>}
            {ocrBusy?"يستخرج البيانات...":"📷 ارفع صورة الجواز — استخراج تلقائي بـ OCR"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={e=>{ const f=e.target.files?.[0]; if(f) onPassportFile(f); e.currentTarget.value=""; }}/>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fields.map(fd=>(
              <label key={fd.k} className={`block ${fd.full?"sm:col-span-2":""}`}>
                <span className="text-xs font-bold text-[#2a1a0f]/70 block mb-1.5">{fd.label}</span>
                <input type={fd.type||"text"}
                  value={(f[fd.k] as string|number|null)?.toString().slice(0, fd.type?.includes("date")?16:undefined) ?? ""}
                  onChange={e=>setF({...f, [fd.k]: fd.type==="number" ? Number(e.target.value) : e.target.value || null} as VisaApp)}
                  className="w-full bg-[#f5efe4] border border-[#2a1a0f]/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#d4af37]"/>
              </label>
            ))}
            <label className="block">
              <span className="text-xs font-bold text-[#2a1a0f]/70 block mb-1.5">الحالة</span>
              <select value={f.status} onChange={e=>setF({...f, status: e.target.value as AppStatus})}
                className="w-full bg-[#f5efe4] border border-[#2a1a0f]/10 rounded-xl px-3 py-2.5 text-sm">
                {Object.entries(STATUS_LABEL).map(([k,v])=><option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-bold text-[#2a1a0f]/70 block mb-1.5">ملاحظات</span>
              <textarea value={f.notes||""} onChange={e=>setF({...f, notes:e.target.value})} rows={3}
                className="w-full bg-[#f5efe4] border border-[#2a1a0f]/10 rounded-xl px-3 py-2.5 text-sm"/>
            </label>
          </div>

          {err && <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-sm">{err}</div>}
          <div className="flex gap-2 pt-2">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-[#f5efe4] font-semibold text-[#2a1a0f]">إلغاء</button>
            <button onClick={save} disabled={busy} className="flex-[2] py-3 rounded-xl font-bold text-[#1a0f08] disabled:opacity-60"
              style={{background:"linear-gradient(135deg,#d4af37,#c9a04a)"}}>{busy?"...":"حفظ"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= CUSTOMERS ================= */
function Customers() {
  const [list, setList] = useState<Customer[]>([]);
  const [edit, setEdit] = useState<Customer|null>(null);
  const reload = () => listCustomers().then(setList);
  useEffect(()=>{ reload(); },[]);
  const blank = (): Customer => ({ id:newId(), full_name:"", created_at:new Date().toISOString() });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={()=>setEdit(blank())} className="px-5 py-3 rounded-xl font-bold text-[#1a0f08] flex items-center gap-2"
          style={{background:"linear-gradient(135deg,#d4af37,#c9a04a)"}}><Plus className="size-4"/>عميل جديد</button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-[#2a1a0f]/5 divide-y divide-[#2a1a0f]/5">
        {list.length===0 && <div className="text-center text-sm text-[#2a1a0f]/50 py-16">لا يوجد عملاء</div>}
        {list.map(c=>(
          <div key={c.id} className="p-4 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[#2a1a0f]">{c.full_name}</div>
              <div className="text-xs text-[#2a1a0f]/60 mt-1">{c.phone||"—"} · {c.passport_no||"بدون جواز"} · {c.nationality||""}</div>
            </div>
            <button onClick={()=>setEdit(c)} className="p-2 rounded-lg bg-blue-50 text-blue-700"><Edit3 className="size-4"/></button>
            <button onClick={async()=>{ if(confirm("حذف العميل؟")){ await deleteCustomer(c.id); reload(); }}} className="p-2 rounded-lg bg-rose-50 text-rose-700"><Trash2 className="size-4"/></button>
          </div>
        ))}
      </div>
      {edit && <CustomerEditor c={edit} onClose={()=>{setEdit(null); reload();}}/>}
    </div>
  );
}

function CustomerEditor({ c, onClose }: { c: Customer; onClose: () => void }) {
  const [f, setF] = useState<Customer>(c);
  const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const [ocrBusy, setOcrBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const extract = useServerFn(extractPassport);

  async function onPassportFile(file: File) {
    setOcrBusy(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      const out = await extract({ data: { imageDataUrl: dataUrl }});
      setF(prev=>({...prev,
        full_name: out.full_name||prev.full_name,
        passport_no: out.passport_no||prev.passport_no,
        nationality: out.nationality||prev.nationality,
        dob: out.dob||prev.dob,
        gender: out.gender||prev.gender,
      }));
      await uploadDocument({ file, customerId: f.id, kind:"passport", ocrData: out as Record<string, unknown> });
    } catch(e){ setErr(e instanceof Error?e.message:"خطأ OCR"); }
    finally { setOcrBusy(false); }
  }

  const fields: { k: keyof Customer; label: string; type?: string }[] = [
    { k:"full_name", label:"الاسم الكامل" },
    { k:"phone", label:"الهاتف" },
    { k:"email", label:"البريد" },
    { k:"passport_no", label:"رقم الجواز" },
    { k:"nationality", label:"الجنسية" },
    { k:"dob", label:"تاريخ الميلاد", type:"date" },
    { k:"gender", label:"الجنس" },
    { k:"address", label:"العنوان" },
  ];

  async function save() {
    setBusy(true); setErr("");
    const r = await upsertCustomer(f); setBusy(false);
    if (!r.ok) setErr(r.error||"خطأ"); else onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl">
        <div className="sticky top-0 bg-white border-b px-5 py-4 flex justify-between items-center">
          <h3 className="font-bold">{c.full_name?"تعديل عميل":"عميل جديد"}</h3>
          <button onClick={onClose}><X className="size-5"/></button>
        </div>
        <div className="p-5 space-y-4">
          <button onClick={()=>fileRef.current?.click()} disabled={ocrBusy}
            className="w-full p-4 rounded-2xl border-2 border-dashed border-[#d4af37] bg-[#d4af37]/10 flex items-center justify-center gap-3 font-semibold disabled:opacity-60">
            {ocrBusy?<Loader2 className="size-5 animate-spin"/>:<ScanLine className="size-5"/>}
            {ocrBusy?"يستخرج...":"📷 صورة الجواز (OCR)"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={e=>{ const f=e.target.files?.[0]; if(f) onPassportFile(f); e.currentTarget.value=""; }}/>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fields.map(fd=>(
              <label key={fd.k} className="block">
                <span className="text-xs font-bold text-[#2a1a0f]/70 block mb-1.5">{fd.label}</span>
                <input type={fd.type||"text"} value={(f[fd.k] as string|null) ?? ""}
                  onChange={e=>setF({...f,[fd.k]:e.target.value||null} as Customer)}
                  className="w-full bg-[#f5efe4] border border-[#2a1a0f]/10 rounded-xl px-3 py-2.5 text-sm"/>
              </label>
            ))}
            <label className="sm:col-span-2 block">
              <span className="text-xs font-bold text-[#2a1a0f]/70 block mb-1.5">ملاحظات</span>
              <textarea value={f.notes||""} onChange={e=>setF({...f,notes:e.target.value})} rows={3}
                className="w-full bg-[#f5efe4] border border-[#2a1a0f]/10 rounded-xl px-3 py-2.5 text-sm"/>
            </label>
          </div>
          {err && <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-sm">{err}</div>}
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-[#f5efe4] font-semibold">إلغاء</button>
            <button onClick={save} disabled={busy} className="flex-[2] py-3 rounded-xl font-bold text-[#1a0f08]" style={{background:"linear-gradient(135deg,#d4af37,#c9a04a)"}}>{busy?"...":"حفظ"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= DOCUMENTS ================= */
function Documents() {
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [apps, setApps] = useState<VisaApp[]>([]);
  const [busy, setBusy] = useState(false);
  const [appId, setAppId] = useState<string>("");
  const [kind, setKind] = useState("other");
  const fileRef = useRef<HTMLInputElement>(null);
  const reload = () => listDocuments().then(setDocs);
  useEffect(()=>{ reload(); listApps().then(setApps); },[]);

  async function onUpload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    for (const f of Array.from(files)) {
      await uploadDocument({ file:f, appId: appId||null, kind });
    }
    setBusy(false); reload();
  }

  async function open(d: DocRow) {
    const url = await getDocumentUrl(d.file_path);
    if (url) window.open(url, "_blank");
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#2a1a0f]/5 flex flex-col sm:flex-row gap-3 items-end">
        <label className="block flex-1 w-full">
          <span className="text-xs font-bold text-[#2a1a0f]/70 block mb-1.5">ربط بطلب (اختياري)</span>
          <select value={appId} onChange={e=>setAppId(e.target.value)} className="w-full bg-[#f5efe4] border border-[#2a1a0f]/10 rounded-xl px-3 py-2.5 text-sm">
            <option value="">— بدون ربط —</option>
            {apps.map(a=><option key={a.id} value={a.id}>{a.full_name} — {a.country}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-bold text-[#2a1a0f]/70 block mb-1.5">نوع الملف</span>
          <select value={kind} onChange={e=>setKind(e.target.value)} className="bg-[#f5efe4] border border-[#2a1a0f]/10 rounded-xl px-3 py-2.5 text-sm">
            <option value="passport">جواز سفر</option>
            <option value="photo">صورة شخصية</option>
            <option value="invitation">دعوة</option>
            <option value="bank">كشف بنك</option>
            <option value="ticket">تذكرة</option>
            <option value="hotel">حجز فندق</option>
            <option value="other">أخرى</option>
          </select>
        </label>
        <button onClick={()=>fileRef.current?.click()} disabled={busy}
          className="px-5 py-3 rounded-xl font-bold text-[#1a0f08] flex items-center gap-2 disabled:opacity-60"
          style={{background:"linear-gradient(135deg,#d4af37,#c9a04a)"}}>
          {busy?<Loader2 className="size-4 animate-spin"/>:<Upload className="size-4"/>}رفع ملفات
        </button>
        <input ref={fileRef} type="file" multiple className="hidden" onChange={e=>{ onUpload(e.target.files); e.currentTarget.value=""; }}/>
      </div>

      <div className="bg-white rounded-2xl shadow-sm divide-y divide-[#2a1a0f]/5">
        {docs.length===0 && <div className="text-center text-sm text-[#2a1a0f]/50 py-16">لا توجد ملفات</div>}
        {docs.map(d=>(
          <div key={d.id} className="p-4 flex items-center gap-3">
            <FileText className="size-8 text-[#d4af37] shrink-0"/>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[#2a1a0f] truncate">{d.file_name}</div>
              <div className="text-xs text-[#2a1a0f]/60">{d.kind} · {((d.file_size||0)/1024).toFixed(1)} KB</div>
            </div>
            <button onClick={()=>open(d)} className="p-2 rounded-lg bg-blue-50 text-blue-700"><Download className="size-4"/></button>
            <button onClick={async()=>{ if(confirm("حذف الملف؟")){ await deleteDocument(d); reload(); }}} className="p-2 rounded-lg bg-rose-50 text-rose-700"><Trash2 className="size-4"/></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= PAYMENTS ================= */
function Payments() {
  const [pays, setPays] = useState<Payment[]>([]);
  const [apps, setApps] = useState<VisaApp[]>([]);
  const [appId, setAppId] = useState(""); const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState("نقدي"); const [note, setNote] = useState("");
  const reload = () => listPayments().then(setPays);
  useEffect(()=>{ reload(); listApps().then(setApps); },[]);

  async function add() {
    if (!appId || amount<=0) return;
    await addPayment({ app_id: appId, amount, currency: "USD", method, note, paid_at: new Date().toISOString() });
    setAmount(0); setNote(""); reload();
  }
  const appMap = useMemo(()=>Object.fromEntries(apps.map(a=>[a.id,a])),[apps]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
        <select value={appId} onChange={e=>setAppId(e.target.value)} className="sm:col-span-2 bg-[#f5efe4] border rounded-xl px-3 py-2.5 text-sm">
          <option value="">— اختر طلب —</option>
          {apps.map(a=><option key={a.id} value={a.id}>{a.full_name} ({a.country})</option>)}
        </select>
        <input type="number" placeholder="المبلغ" value={amount||""} onChange={e=>setAmount(Number(e.target.value))}
          className="bg-[#f5efe4] border rounded-xl px-3 py-2.5 text-sm"/>
        <input placeholder="طريقة الدفع" value={method} onChange={e=>setMethod(e.target.value)}
          className="bg-[#f5efe4] border rounded-xl px-3 py-2.5 text-sm"/>
        <button onClick={add} className="py-2.5 rounded-xl font-bold text-[#1a0f08]" style={{background:"linear-gradient(135deg,#d4af37,#c9a04a)"}}>إضافة دفعة</button>
        <input placeholder="ملاحظة" value={note} onChange={e=>setNote(e.target.value)}
          className="sm:col-span-5 bg-[#f5efe4] border rounded-xl px-3 py-2.5 text-sm"/>
      </div>

      <div className="bg-white rounded-2xl shadow-sm divide-y">
        {pays.length===0 && <div className="text-center text-sm text-[#2a1a0f]/50 py-16">لا توجد مدفوعات</div>}
        {pays.map(p=>(
          <div key={p.id} className="p-4 flex items-center gap-3">
            <div className="flex-1">
              <div className="font-bold text-[#2a1a0f]">{appMap[p.app_id]?.full_name||"—"}</div>
              <div className="text-xs text-[#2a1a0f]/60 mt-1">{p.method} · {new Date(p.paid_at).toLocaleString("ar")}</div>
              {p.note && <div className="text-xs text-[#2a1a0f]/50 mt-0.5">{p.note}</div>}
            </div>
            <div className="font-bold text-emerald-700">{Number(p.amount).toLocaleString()} {p.currency}</div>
            <button onClick={async()=>{ if(confirm("حذف الدفعة؟")){ await deletePayment(p.id, p.app_id); reload(); }}} className="p-2 rounded-lg bg-rose-50 text-rose-700"><Trash2 className="size-4"/></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= TASKS ================= */
function Tasks() {
  const [list, setList] = useState<Task[]>([]);
  const [title, setTitle] = useState(""); const [due, setDue] = useState("");
  const reload = () => listTasks().then(setList);
  useEffect(()=>{ reload(); },[]);

  async function add() {
    if (!title.trim()) return;
    await upsertTask({ id:newId(), title, due_date: due||null, done:false });
    setTitle(""); setDue(""); reload();
  }
  async function toggle(t: Task) { await upsertTask({ id:t.id, done:!t.done }); reload(); }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <input placeholder="عنوان المهمة" value={title} onChange={e=>setTitle(e.target.value)} className="flex-1 bg-[#f5efe4] border rounded-xl px-3 py-2.5 text-sm"/>
        <input type="datetime-local" value={due} onChange={e=>setDue(e.target.value)} className="bg-[#f5efe4] border rounded-xl px-3 py-2.5 text-sm"/>
        <button onClick={add} className="px-5 py-2.5 rounded-xl font-bold text-[#1a0f08]" style={{background:"linear-gradient(135deg,#d4af37,#c9a04a)"}}>إضافة</button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm divide-y">
        {list.length===0 && <div className="text-center text-sm text-[#2a1a0f]/50 py-16">لا توجد مهام</div>}
        {list.map(t=>(
          <div key={t.id} className="p-4 flex items-center gap-3">
            <input type="checkbox" checked={t.done} onChange={()=>toggle(t)} className="size-5 accent-[#d4af37]"/>
            <div className="flex-1">
              <div className={`font-semibold ${t.done?"line-through text-[#2a1a0f]/40":"text-[#2a1a0f]"}`}>{t.title}</div>
              {t.due_date && <div className="text-xs text-[#2a1a0f]/60 mt-1 flex items-center gap-1"><Calendar className="size-3"/>{new Date(t.due_date).toLocaleString("ar")}</div>}
            </div>
            <button onClick={async()=>{ await deleteTask(t.id); reload(); }} className="p-2 rounded-lg bg-rose-50 text-rose-700"><Trash2 className="size-4"/></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= SETTINGS ================= */
function SettingsTab() {
  const [cur, setCur] = useState(""); const [nu, setNu] = useState(""); const [np, setNp] = useState("");
  const [busy, setBusy] = useState(false); const [msg, setMsg] = useState<{ok:boolean;t:string}|null>(null);
  async function save() {
    setBusy(true); setMsg(null);
    const r = await changeCredentials({ currentPassword: cur, newUsername: nu||undefined, newPassword: np||undefined });
    setBusy(false);
    setMsg(r.ok?{ok:true,t:"تم الحفظ"}:{ok:false,t:r.error});
    if (r.ok) { setCur(""); setNu(""); setNp(""); }
  }
  return (
    <div className="max-w-xl bg-white rounded-2xl p-6 shadow-sm space-y-3">
      <h3 className="font-bold text-[#2a1a0f] mb-2">تغيير بيانات الدخول</h3>
      <label className="block"><span className="text-xs font-bold block mb-1.5">كلمة السر الحالية *</span>
        <input type="password" value={cur} onChange={e=>setCur(e.target.value)} className="w-full bg-[#f5efe4] border rounded-xl px-3 py-2.5 text-sm"/></label>
      <label className="block"><span className="text-xs font-bold block mb-1.5">اسم مستخدم جديد (اختياري)</span>
        <input value={nu} onChange={e=>setNu(e.target.value)} className="w-full bg-[#f5efe4] border rounded-xl px-3 py-2.5 text-sm"/></label>
      <label className="block"><span className="text-xs font-bold block mb-1.5">كلمة سر جديدة (اختياري)</span>
        <input type="password" value={np} onChange={e=>setNp(e.target.value)} className="w-full bg-[#f5efe4] border rounded-xl px-3 py-2.5 text-sm"/></label>
      {msg && <div className={`p-3 rounded-xl text-sm ${msg.ok?"bg-emerald-50 text-emerald-700":"bg-rose-50 text-rose-700"}`}>{msg.t}</div>}
      <button onClick={save} disabled={busy||!cur} className="w-full py-3 rounded-xl font-bold text-[#1a0f08] disabled:opacity-60" style={{background:"linear-gradient(135deg,#d4af37,#c9a04a)"}}>{busy?"...":"حفظ"}</button>
    </div>
  );
}
