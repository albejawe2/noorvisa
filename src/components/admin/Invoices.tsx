import { useEffect, useState } from "react";
import { Plus, Trash2, Download, X, FileText } from "lucide-react";
import { listInvoices, upsertInvoice, deleteInvoice, listApps, listCustomers, type Invoice, type VisaApp, type Customer, newId } from "@/lib/admin-store";
import { generateInvoicePDF } from "@/lib/invoice-pdf";

export default function Invoices() {
  const [list, setList] = useState<Invoice[]>([]);
  const [apps, setApps] = useState<VisaApp[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [edit, setEdit] = useState<Invoice | null>(null);
  const reload = () => listInvoices().then(setList);
  useEffect(() => { reload(); listApps().then(setApps); listCustomers().then(setCustomers); }, []);

  const blank = (): Invoice => ({
    id: newId(), number: "", app_id: null, customer_id: null,
    issued_at: new Date().toISOString(), due_at: null,
    subtotal: 0, tax: 0, total: 0, currency: "USD", status: "draft",
    items: [{ description: "خدمة استشارة تأشيرة", qty: 1, price: 0 }],
    notes: "", created_at: new Date().toISOString(),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <p className="text-sm text-[#2a1a0f]/60 dark:text-[#f7f1e6]/60">فواتير احترافية بصيغة PDF</p>
        <button onClick={() => setEdit(blank())} className="px-5 py-3 rounded-xl font-bold text-[#1a0f08] flex items-center gap-2" style={{ background: "linear-gradient(135deg,#d4af37,#c9a04a)" }}>
          <Plus className="size-4" />فاتورة جديدة
        </button>
      </div>
      <div className="bg-white dark:bg-[#2a1a0f] rounded-2xl shadow-sm divide-y divide-[#2a1a0f]/5 dark:divide-[#d4af37]/10">
        {list.length === 0 && <div className="text-center text-sm text-[#2a1a0f]/50 dark:text-[#f7f1e6]/40 py-16">لا توجد فواتير</div>}
        {list.map((inv) => {
          const app = apps.find((a) => a.id === inv.app_id);
          const cust = customers.find((c) => c.id === inv.customer_id);
          return (
            <div key={inv.id} className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#d4af37]/15"><FileText className="size-5 text-[#d4af37]" /></div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[#2a1a0f] dark:text-[#f7f1e6]">{inv.number}</div>
                <div className="text-xs text-[#2a1a0f]/60 dark:text-[#f7f1e6]/60 mt-0.5">{cust?.full_name || app?.full_name || "—"} · {new Date(inv.issued_at).toLocaleDateString("ar")}</div>
              </div>
              <div className="font-bold text-emerald-700 dark:text-emerald-400">{Number(inv.total).toLocaleString()} {inv.currency}</div>
              <button onClick={() => generateInvoicePDF({ invoice: inv, app, customer: cust })} className="p-2 rounded-lg bg-blue-50 text-blue-700"><Download className="size-4" /></button>
              <button onClick={() => setEdit(inv)} className="p-2 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold">تعديل</button>
              <button onClick={async () => { if (confirm("حذف الفاتورة؟")) { await deleteInvoice(inv.id); reload(); } }} className="p-2 rounded-lg bg-rose-50 text-rose-700"><Trash2 className="size-4" /></button>
            </div>
          );
        })}
      </div>
      {edit && <Editor inv={edit} apps={apps} customers={customers} onClose={() => { setEdit(null); reload(); }} />}
    </div>
  );
}

function Editor({ inv, apps, customers, onClose }: { inv: Invoice; apps: VisaApp[]; customers: Customer[]; onClose: () => void }) {
  const [f, setF] = useState<Invoice>({ ...inv, items: [...inv.items] });
  const [busy, setBusy] = useState(false);

  function recalc(items: Invoice["items"], tax: number) {
    const subtotal = items.reduce((s, it) => s + Number(it.qty || 0) * Number(it.price || 0), 0);
    return { subtotal, total: subtotal + Number(tax || 0) };
  }
  function setItems(items: Invoice["items"]) { setF({ ...f, items, ...recalc(items, f.tax) }); }

  async function save() {
    setBusy(true);
    const totals = recalc(f.items, f.tax);
    const r = await upsertInvoice({ ...f, ...totals });
    setBusy(false);
    if (r.ok) onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-[#2a1a0f] w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl">
        <div className="sticky top-0 bg-white dark:bg-[#2a1a0f] border-b px-5 py-4 flex justify-between">
          <h3 className="font-bold text-[#2a1a0f] dark:text-[#f7f1e6]">{inv.number || "فاتورة جديدة"}</h3>
          <button onClick={onClose}><X className="size-5" /></button>
        </div>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className="text-xs font-bold block mb-1.5">العميل</span>
              <select value={f.customer_id || ""} onChange={(e) => setF({ ...f, customer_id: e.target.value || null })} className="w-full bg-[#f5efe4] dark:bg-[#1a0f08] border rounded-xl px-3 py-2.5 text-sm">
                <option value="">— لا يوجد —</option>
                {customers.map((c) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
              </select>
            </label>
            <label className="block"><span className="text-xs font-bold block mb-1.5">الطلب</span>
              <select value={f.app_id || ""} onChange={(e) => setF({ ...f, app_id: e.target.value || null })} className="w-full bg-[#f5efe4] dark:bg-[#1a0f08] border rounded-xl px-3 py-2.5 text-sm">
                <option value="">— لا يوجد —</option>
                {apps.map((a) => <option key={a.id} value={a.id}>{a.full_name} — {a.country}</option>)}
              </select>
            </label>
            <label className="block"><span className="text-xs font-bold block mb-1.5">العملة</span>
              <input value={f.currency} onChange={(e) => setF({ ...f, currency: e.target.value })} className="w-full bg-[#f5efe4] dark:bg-[#1a0f08] border rounded-xl px-3 py-2.5 text-sm" />
            </label>
            <label className="block"><span className="text-xs font-bold block mb-1.5">الحالة</span>
              <select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })} className="w-full bg-[#f5efe4] dark:bg-[#1a0f08] border rounded-xl px-3 py-2.5 text-sm">
                <option value="draft">مسودة</option><option value="sent">مُرسلة</option>
                <option value="paid">مدفوعة</option><option value="cancelled">ملغاة</option>
              </select>
            </label>
          </div>

          <div>
            <span className="text-xs font-bold block mb-1.5">البنود</span>
            <div className="space-y-2">
              {f.items.map((it, i) => (
                <div key={i} className="grid grid-cols-12 gap-2">
                  <input value={it.description} onChange={(e) => { const n = [...f.items]; n[i] = { ...it, description: e.target.value }; setItems(n); }} placeholder="الوصف" className="col-span-7 bg-[#f5efe4] dark:bg-[#1a0f08] border rounded-lg px-2 py-2 text-xs" />
                  <input type="number" value={it.qty} onChange={(e) => { const n = [...f.items]; n[i] = { ...it, qty: Number(e.target.value) }; setItems(n); }} placeholder="كمية" className="col-span-2 bg-[#f5efe4] dark:bg-[#1a0f08] border rounded-lg px-2 py-2 text-xs" />
                  <input type="number" value={it.price} onChange={(e) => { const n = [...f.items]; n[i] = { ...it, price: Number(e.target.value) }; setItems(n); }} placeholder="سعر" className="col-span-2 bg-[#f5efe4] dark:bg-[#1a0f08] border rounded-lg px-2 py-2 text-xs" />
                  <button onClick={() => setItems(f.items.filter((_, j) => j !== i))} className="col-span-1 rounded-lg bg-rose-100 text-rose-700"><X className="size-4 mx-auto" /></button>
                </div>
              ))}
              <button onClick={() => setItems([...f.items, { description: "", qty: 1, price: 0 }])} className="w-full py-2 rounded-lg bg-[#d4af37]/20 text-sm font-bold">+ بند</button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-sm"><span className="text-xs text-[#2a1a0f]/60 dark:text-[#f7f1e6]/60 block">المجموع الفرعي</span><b>{recalc(f.items, f.tax).subtotal.toFixed(2)}</b></div>
            <label className="block"><span className="text-xs font-bold block mb-1.5">ضريبة</span>
              <input type="number" value={f.tax} onChange={(e) => setF({ ...f, tax: Number(e.target.value), total: recalc(f.items, Number(e.target.value)).total })} className="w-full bg-[#f5efe4] dark:bg-[#1a0f08] border rounded-xl px-3 py-2 text-sm" /></label>
            <div className="text-sm"><span className="text-xs text-[#2a1a0f]/60 dark:text-[#f7f1e6]/60 block">الإجمالي</span><b className="text-emerald-700">{recalc(f.items, f.tax).total.toFixed(2)} {f.currency}</b></div>
          </div>

          <label className="block"><span className="text-xs font-bold block mb-1.5">ملاحظات</span>
            <textarea value={f.notes || ""} onChange={(e) => setF({ ...f, notes: e.target.value })} rows={2} className="w-full bg-[#f5efe4] dark:bg-[#1a0f08] border rounded-xl px-3 py-2.5 text-sm" /></label>

          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-[#f5efe4] dark:bg-[#1a0f08] font-semibold">إلغاء</button>
            <button onClick={save} disabled={busy} className="flex-[2] py-3 rounded-xl font-bold text-[#1a0f08] disabled:opacity-60" style={{ background: "linear-gradient(135deg,#d4af37,#c9a04a)" }}>{busy ? "..." : "حفظ"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
