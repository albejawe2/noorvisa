import { useEffect, useState } from "react";
import { Plus, Trash2, Edit3, X, FileStack } from "lucide-react";
import { listTemplates, upsertTemplate, deleteTemplate, type Template, newId } from "@/lib/admin-store";

export default function Templates() {
  const [list, setList] = useState<Template[]>([]);
  const [edit, setEdit] = useState<Template | null>(null);
  const reload = () => listTemplates().then(setList);
  useEffect(() => { reload(); }, []);

  const blank = (): Template => ({
    id: newId(), name: "", country: "", visa_type: "",
    default_price: 0, currency: "USD", checklist: [], notes: "",
    created_at: new Date().toISOString(),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-[#2a1a0f]/60 dark:text-[#f7f1e6]/60">قوالب جاهزة لإنشاء طلبات بسرعة</p>
        <button onClick={() => setEdit(blank())} className="px-5 py-3 rounded-xl font-bold text-[#1a0f08] flex items-center gap-2" style={{ background: "linear-gradient(135deg,#d4af37,#c9a04a)" }}>
          <Plus className="size-4" />قالب جديد
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {list.length === 0 && <div className="col-span-full text-center text-sm text-[#2a1a0f]/50 py-16">لا توجد قوالب</div>}
        {list.map((t) => (
          <div key={t.id} className="bg-white dark:bg-[#2a1a0f] rounded-2xl p-4 shadow-sm border border-[#2a1a0f]/5 dark:border-[#d4af37]/10">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-[#d4af37]/15"><FileStack className="size-5 text-[#d4af37]" /></div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[#2a1a0f] dark:text-[#f7f1e6]">{t.name}</div>
                <div className="text-xs text-[#2a1a0f]/60 dark:text-[#f7f1e6]/60 mt-1">{t.country} · {t.visa_type}</div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">{t.default_price} {t.currency}</div>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => setEdit(t)} className="p-1.5 rounded bg-blue-50 text-blue-700"><Edit3 className="size-3.5" /></button>
                <button onClick={async () => { if (confirm("حذف القالب؟")) { await deleteTemplate(t.id); reload(); } }} className="p-1.5 rounded bg-rose-50 text-rose-700"><Trash2 className="size-3.5" /></button>
              </div>
            </div>
            {t.checklist.length > 0 && (
              <ul className="mt-3 text-xs space-y-1 text-[#2a1a0f]/70 dark:text-[#f7f1e6]/70">
                {t.checklist.slice(0, 4).map((c, i) => <li key={i}>✓ {c}</li>)}
                {t.checklist.length > 4 && <li className="text-[#2a1a0f]/40">+ {t.checklist.length - 4}</li>}
              </ul>
            )}
          </div>
        ))}
      </div>
      {edit && <Editor t={edit} onClose={() => { setEdit(null); reload(); }} />}
    </div>
  );
}

function Editor({ t, onClose }: { t: Template; onClose: () => void }) {
  const [f, setF] = useState<Template>({ ...t, checklist: [...t.checklist] });
  const [busy, setBusy] = useState(false);
  const [item, setItem] = useState("");

  async function save() {
    setBusy(true);
    await upsertTemplate(f);
    setBusy(false); onClose();
  }
  function addItem() { if (item.trim()) { setF({ ...f, checklist: [...f.checklist, item.trim()] }); setItem(""); } }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-[#2a1a0f] w-full sm:max-w-xl max-h-[95vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl">
        <div className="sticky top-0 bg-white dark:bg-[#2a1a0f] border-b border-[#2a1a0f]/10 dark:border-[#d4af37]/10 px-5 py-4 flex justify-between items-center">
          <h3 className="font-bold text-[#2a1a0f] dark:text-[#f7f1e6]">{t.name ? "تعديل قالب" : "قالب جديد"}</h3>
          <button onClick={onClose}><X className="size-5" /></button>
        </div>
        <div className="p-5 space-y-3">
          <Inp label="اسم القالب" v={f.name} on={(v) => setF({ ...f, name: v })} />
          <div className="grid grid-cols-2 gap-3">
            <Inp label="الدولة" v={f.country} on={(v) => setF({ ...f, country: v })} />
            <Inp label="نوع التأشيرة" v={f.visa_type} on={(v) => setF({ ...f, visa_type: v })} />
            <Inp label="السعر الافتراضي" type="number" v={String(f.default_price)} on={(v) => setF({ ...f, default_price: Number(v) })} />
            <Inp label="العملة" v={f.currency} on={(v) => setF({ ...f, currency: v })} />
          </div>
          <div>
            <span className="text-xs font-bold block mb-1.5 text-[#2a1a0f]/70 dark:text-[#f7f1e6]/70">قائمة المستندات المطلوبة</span>
            <div className="flex gap-2">
              <input value={item} onChange={(e) => setItem(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem())}
                placeholder="أضف بنداً..." className="flex-1 bg-[#f5efe4] dark:bg-[#1a0f08] border rounded-xl px-3 py-2.5 text-sm" />
              <button type="button" onClick={addItem} className="px-4 rounded-xl bg-[#d4af37]/20 font-bold">+</button>
            </div>
            <ul className="mt-2 space-y-1">
              {f.checklist.map((c, i) => (
                <li key={i} className="flex items-center justify-between text-sm bg-[#f5efe4] dark:bg-[#1a0f08] px-3 py-1.5 rounded-lg">
                  <span>{c}</span>
                  <button onClick={() => setF({ ...f, checklist: f.checklist.filter((_, j) => j !== i) })} className="text-rose-600"><X className="size-4" /></button>
                </li>
              ))}
            </ul>
          </div>
          <Inp label="ملاحظات" v={f.notes || ""} on={(v) => setF({ ...f, notes: v })} area />
          <div className="flex gap-2 pt-2">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-[#f5efe4] dark:bg-[#1a0f08] font-semibold">إلغاء</button>
            <button onClick={save} disabled={busy || !f.name} className="flex-[2] py-3 rounded-xl font-bold text-[#1a0f08] disabled:opacity-60" style={{ background: "linear-gradient(135deg,#d4af37,#c9a04a)" }}>{busy ? "..." : "حفظ"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
function Inp({ label, v, on, type, area }: { label: string; v: string; on: (v: string) => void; type?: string; area?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-bold block mb-1.5 text-[#2a1a0f]/70 dark:text-[#f7f1e6]/70">{label}</span>
      {area
        ? <textarea value={v} onChange={(e) => on(e.target.value)} rows={3} className="w-full bg-[#f5efe4] dark:bg-[#1a0f08] border rounded-xl px-3 py-2.5 text-sm" />
        : <input type={type || "text"} value={v} onChange={(e) => on(e.target.value)} className="w-full bg-[#f5efe4] dark:bg-[#1a0f08] border rounded-xl px-3 py-2.5 text-sm" />}
    </label>
  );
}
