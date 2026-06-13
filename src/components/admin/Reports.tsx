import { useEffect, useMemo, useState } from "react";
import { Printer, FileBarChart2, Calendar, TrendingUp, Users as UsersIcon } from "lucide-react";
import { listApps, listPayments, listCustomers, type VisaApp, type Payment, type Customer, type AppStatus } from "@/lib/admin-store";

const STATUS_LABEL: Record<AppStatus, string> = {
  new: "جديد", in_review: "قيد المراجعة", approved: "موافق عليه", issued: "صادر", rejected: "مرفوض",
};

type Range = "7d" | "30d" | "90d" | "ytd" | "all";

function inRange(d: string | null | undefined, r: Range): boolean {
  if (!d) return r === "all";
  if (r === "all") return true;
  const date = new Date(d);
  const now = new Date();
  if (r === "ytd") return date.getFullYear() === now.getFullYear();
  const days = r === "7d" ? 7 : r === "30d" ? 30 : 90;
  return now.getTime() - date.getTime() <= days * 86400000;
}

export default function Reports() {
  const [apps, setApps] = useState<VisaApp[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [range, setRange] = useState<Range>("30d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listApps(), listPayments(), listCustomers()]).then(([a, p, c]) => {
      setApps(a); setPayments(p); setCustomers(c); setLoading(false);
    });
  }, []);

  const data = useMemo(() => {
    const fApps = apps.filter((a) => inRange(a.created_at, range));
    const fPays = payments.filter((p) => inRange(p.paid_at, range));
    const fCust = customers.filter((c) => inRange(c.created_at, range));

    const revenue = fApps.reduce((s, a) => s + Number(a.price || 0), 0);
    const collected = fPays.reduce((s, p) => s + Number(p.amount || 0), 0);
    const byStatus = fApps.reduce<Record<string, number>>((acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1; return acc;
    }, {});
    const byCountry = fApps.reduce<Record<string, { count: number; revenue: number }>>((acc, a) => {
      const k = a.country || "—";
      if (!acc[k]) acc[k] = { count: 0, revenue: 0 };
      acc[k].count += 1; acc[k].revenue += Number(a.price || 0);
      return acc;
    }, {});
    const byType = fApps.reduce<Record<string, number>>((acc, a) => {
      const k = a.visa_type || "—";
      acc[k] = (acc[k] || 0) + 1; return acc;
    }, {});
    const byMonth = fApps.reduce<Record<string, { count: number; revenue: number; collected: number }>>((acc, a) => {
      const m = new Date(a.created_at).toLocaleDateString("ar-IQ", { year: "numeric", month: "long" });
      if (!acc[m]) acc[m] = { count: 0, revenue: 0, collected: 0 };
      acc[m].count += 1; acc[m].revenue += Number(a.price || 0); acc[m].collected += Number(a.paid || 0);
      return acc;
    }, {});

    return {
      fApps, fPays, fCust, revenue, collected, due: revenue - collected,
      byStatus, byCountry, byType, byMonth,
      avgPrice: fApps.length ? revenue / fApps.length : 0,
      collectionRate: revenue > 0 ? (collected / revenue) * 100 : 0,
    };
  }, [apps, payments, customers, range]);

  const rangeLabel: Record<Range, string> = {
    "7d": "آخر 7 أيام", "30d": "آخر 30 يوم", "90d": "آخر 90 يوم",
    ytd: "هذه السنة", all: "كل الفترات",
  };

  if (loading) return <div className="p-8 text-center text-[#2a1a0f]/60">جاري التحميل…</div>;

  return (
    <div className="space-y-6">
      {/* Toolbar — no-print */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#2a1a0f]/5 flex flex-wrap gap-3 items-center justify-between no-print">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(rangeLabel) as Range[]).map((r) => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${range === r
                ? "bg-[#2a1a0f] text-[#d4af37]"
                : "bg-[#f5efe4] text-[#2a1a0f]/70 hover:bg-[#2a1a0f]/10"}`}>
              {rangeLabel[r]}
            </button>
          ))}
        </div>
        <button onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-[#1a0f08] shadow"
          style={{ background: "linear-gradient(135deg,#d4af37,#c9a04a)" }}>
          <Printer className="size-4" /> طباعة / حفظ PDF
        </button>
      </div>

      {/* Printable area */}
      <div id="report-print">
        {/* Report header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#2a1a0f]/5 mb-4">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <div className="text-[#d4af37] text-xs font-bold tracking-wider">NOORVISA</div>
              <h1 className="text-2xl font-bold text-[#2a1a0f] mt-1">تقرير الأداء</h1>
              <p className="text-sm text-[#2a1a0f]/60 mt-1">الفترة: {rangeLabel[range]}</p>
            </div>
            <div className="text-xs text-[#2a1a0f]/60 text-left">
              <div>تاريخ الإصدار</div>
              <div className="font-bold text-[#2a1a0f]">{new Date().toLocaleDateString("ar-IQ", { year: "numeric", month: "long", day: "numeric" })}</div>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
          <Kpi icon={FileBarChart2} label="الطلبات" value={data.fApps.length} color="from-blue-500 to-blue-600" />
          <Kpi icon={UsersIcon} label="عملاء جدد" value={data.fCust.length} color="from-purple-500 to-purple-600" />
          <Kpi icon={TrendingUp} label="الإيرادات" value={`${Math.round(data.revenue).toLocaleString()} $`} color="from-emerald-500 to-emerald-600" />
          <Kpi icon={Calendar} label="المُحصَّل" value={`${Math.round(data.collected).toLocaleString()} $`} color="from-teal-500 to-teal-600" />
        </div>

        <div className="grid lg:grid-cols-2 gap-4 mb-4">
          {/* Status breakdown */}
          <Card title="حسب الحالة">
            <SimpleTable headers={["الحالة", "العدد", "النسبة"]} rows={Object.entries(data.byStatus).map(([k, v]) => [
              STATUS_LABEL[k as AppStatus] || k,
              String(v),
              data.fApps.length ? `${((v / data.fApps.length) * 100).toFixed(1)}%` : "0%",
            ])} />
          </Card>

          {/* By country */}
          <Card title="حسب الدولة">
            <SimpleTable headers={["الدولة", "الطلبات", "الإيراد"]} rows={Object.entries(data.byCountry)
              .sort((a, b) => b[1].revenue - a[1].revenue).map(([k, v]) => [k, String(v.count), `${Math.round(v.revenue).toLocaleString()} $`])} />
          </Card>

          {/* By type */}
          <Card title="حسب نوع التأشيرة">
            <SimpleTable headers={["النوع", "العدد"]} rows={Object.entries(data.byType)
              .sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, String(v)])} />
          </Card>

          {/* Financial summary */}
          <Card title="ملخص مالي">
            <div className="space-y-2 text-sm">
              <Row k="إجمالي الإيرادات" v={`${Math.round(data.revenue).toLocaleString()} $`} />
              <Row k="إجمالي المُحصَّل" v={`${Math.round(data.collected).toLocaleString()} $`} />
              <Row k="المستحقات" v={`${Math.round(data.due).toLocaleString()} $`} />
              <Row k="متوسط سعر الطلب" v={`${Math.round(data.avgPrice).toLocaleString()} $`} />
              <Row k="نسبة التحصيل" v={`${data.collectionRate.toFixed(1)}%`} />
              <Row k="عدد عمليات الدفع" v={String(data.fPays.length)} />
            </div>
          </Card>
        </div>

        {/* Monthly */}
        <Card title="التطور الشهري">
          <SimpleTable headers={["الشهر", "الطلبات", "الإيراد", "المُحصَّل"]} rows={Object.entries(data.byMonth).map(([k, v]) => [
            k, String(v.count), `${Math.round(v.revenue).toLocaleString()} $`, `${Math.round(v.collected).toLocaleString()} $`,
          ])} />
        </Card>

        {/* Detailed apps list */}
        <div className="mt-4">
          <Card title={`تفاصيل الطلبات (${data.fApps.length})`}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-[#f5efe4]">
                  <tr>
                    {["#", "الاسم", "الدولة", "النوع", "الحالة", "السعر", "المدفوع", "التاريخ"].map((h) => (
                      <th key={h} className="text-right p-2 font-bold text-[#2a1a0f]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.fApps.map((a, i) => (
                    <tr key={a.id} className="border-t border-[#2a1a0f]/5">
                      <td className="p-2">{i + 1}</td>
                      <td className="p-2 font-semibold">{a.full_name}</td>
                      <td className="p-2">{a.country}</td>
                      <td className="p-2">{a.visa_type}</td>
                      <td className="p-2">{STATUS_LABEL[a.status]}</td>
                      <td className="p-2">{Number(a.price).toLocaleString()} $</td>
                      <td className="p-2">{Number(a.paid).toLocaleString()} $</td>
                      <td className="p-2 text-[#2a1a0f]/60">{new Date(a.created_at).toLocaleDateString("ar-IQ")}</td>
                    </tr>
                  ))}
                  {!data.fApps.length && (
                    <tr><td colSpan={8} className="p-6 text-center text-[#2a1a0f]/50">لا توجد طلبات في هذه الفترة</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="text-center text-xs text-[#2a1a0f]/50 mt-6 print-footer">
          NoorVisa — لوحة الإدارة · noorvisa.lovable.app
        </div>
      </div>

      <style>{`
        @media print {
          @page { size: A4; margin: 12mm; }
          body { background: white !important; }
          .no-print { display: none !important; }
          aside, header { display: none !important; }
          main { padding: 0 !important; }
          #report-print { color: #000 !important; }
          .shadow, .shadow-sm { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, color }: { icon: typeof Calendar; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#2a1a0f]/5">
      <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${color} text-white mb-3`}><Icon className="size-5" /></div>
      <div className="text-xs sm:text-sm text-[#2a1a0f]/60 font-semibold">{label}</div>
      <div className="text-xl sm:text-2xl font-bold text-[#2a1a0f] mt-1">{value}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#2a1a0f]/5">
      <h3 className="font-bold text-[#2a1a0f] mb-3 text-sm">{title}</h3>
      {children}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-[#2a1a0f]/5 last:border-0">
      <span className="text-[#2a1a0f]/70">{k}</span>
      <span className="font-bold text-[#2a1a0f]">{v}</span>
    </div>
  );
}

function SimpleTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-[#f5efe4]"><tr>{headers.map((h) => <th key={h} className="text-right p-2 font-bold text-[#2a1a0f]">{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-[#2a1a0f]/5">{r.map((c, j) => <td key={j} className="p-2 text-[#2a1a0f]">{c}</td>)}</tr>
          ))}
          {!rows.length && <tr><td colSpan={headers.length} className="p-4 text-center text-[#2a1a0f]/50">لا توجد بيانات</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
