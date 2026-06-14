import { useEffect, useMemo, useState } from "react";
import { FileText, CheckCircle2, Clock, XCircle, DollarSign, Wallet, ListChecks, TrendingUp, Users } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import { listApps, listTasks, listPayments, listCustomers, type VisaApp, type Task, type Payment, type Customer } from "@/lib/admin-store";

const STATUS_AR: Record<string, string> = {
  new: "جديد", in_review: "قيد المراجعة", approved: "موافق", issued: "صادر", rejected: "مرفوض",
};
const STATUS_COLORS: Record<string, string> = {
  new: "#3b82f6", in_review: "#f59e0b", approved: "#10b981", issued: "#8b5cf6", rejected: "#ef4444",
};

export default function Dashboard() {
  const [apps, setApps] = useState<VisaApp[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pays, setPays] = useState<Payment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    listApps().then(setApps); listTasks().then(setTasks);
    listPayments().then(setPays); listCustomers().then(setCustomers);
  }, []);

  const stats = useMemo(() => {
    const total = apps.length;
    const byStatus = apps.reduce<Record<string, number>>((a, x) => { a[x.status] = (a[x.status] || 0) + 1; return a; }, {});
    const revenue = apps.reduce((s, a) => s + Number(a.price || 0), 0);
    const collected = pays.reduce((s, p) => s + Number(p.amount || 0), 0);
    return { total, byStatus, revenue, collected, due: revenue - collected };
  }, [apps, pays]);

  // طلبات شهرية لآخر 6 أشهر
  const monthly = useMemo(() => {
    const months: { key: string; label: string; count: number; revenue: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months.push({ key, label: d.toLocaleDateString("ar", { month: "short" }), count: 0, revenue: 0 });
    }
    apps.forEach((a) => {
      const k = (a.created_at || "").slice(0, 7);
      const m = months.find((x) => x.key === k);
      if (m) { m.count += 1; m.revenue += Number(a.price || 0); }
    });
    return months;
  }, [apps]);

  const statusData = useMemo(() =>
    Object.entries(stats.byStatus).map(([k, v]) => ({ name: STATUS_AR[k] || k, value: v, color: STATUS_COLORS[k] || "#888" })),
    [stats.byStatus]);

  const topCountries = useMemo(() => {
    const m: Record<string, number> = {};
    apps.forEach((a) => { m[a.country || "—"] = (m[a.country || "—"] || 0) + 1; });
    return Object.entries(m).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 6);
  }, [apps]);

  const cards = [
    { label: "إجمالي الطلبات", value: stats.total, icon: FileText, c: "from-blue-500 to-blue-600" },
    { label: "العملاء", value: customers.length, icon: Users, c: "from-cyan-500 to-cyan-600" },
    { label: "قيد المراجعة", value: stats.byStatus.in_review || 0, icon: Clock, c: "from-amber-500 to-amber-600" },
    { label: "ناجحة", value: (stats.byStatus.approved || 0) + (stats.byStatus.issued || 0), icon: CheckCircle2, c: "from-emerald-500 to-emerald-600" },
    { label: "مرفوضة", value: stats.byStatus.rejected || 0, icon: XCircle, c: "from-rose-500 to-rose-600" },
    { label: "الإيرادات", value: stats.revenue.toLocaleString() + " $", icon: DollarSign, c: "from-purple-500 to-purple-600" },
    { label: "المُحصَّل", value: stats.collected.toLocaleString() + " $", icon: Wallet, c: "from-teal-500 to-teal-600" },
    { label: "المستحقات", value: stats.due.toLocaleString() + " $", icon: TrendingUp, c: "from-orange-500 to-orange-600" },
    { label: "مهام مفتوحة", value: tasks.filter((t) => !t.done).length, icon: ListChecks, c: "from-indigo-500 to-indigo-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="bg-white dark:bg-[#2a1a0f] rounded-2xl p-4 shadow-sm border border-[#2a1a0f]/5 dark:border-[#d4af37]/10">
              <div className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${c.c} text-white mb-2.5`}><Icon className="size-4" /></div>
              <div className="text-[11px] sm:text-xs text-[#2a1a0f]/60 dark:text-[#f7f1e6]/60 font-bold">{c.label}</div>
              <div className="text-lg sm:text-xl font-bold text-[#2a1a0f] dark:text-[#f7f1e6] mt-0.5">{c.value}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#2a1a0f] rounded-2xl p-5 shadow-sm border border-[#2a1a0f]/5 dark:border-[#d4af37]/10">
          <h3 className="font-bold text-[#2a1a0f] dark:text-[#f7f1e6] mb-4">الطلبات خلال 6 أشهر</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="label" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#d4af37" radius={[8, 8, 0, 0]} name="عدد الطلبات" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-[#2a1a0f] rounded-2xl p-5 shadow-sm border border-[#2a1a0f]/5 dark:border-[#d4af37]/10">
          <h3 className="font-bold text-[#2a1a0f] dark:text-[#f7f1e6] mb-4">توزيع الحالات</h3>
          {statusData.length === 0 ? (
            <div className="h-[260px] grid place-items-center text-sm text-[#2a1a0f]/40">لا توجد بيانات</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={(e) => `${e.name}: ${e.value}`}>
                  {statusData.map((s, i) => <Cell key={i} fill={s.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white dark:bg-[#2a1a0f] rounded-2xl p-5 shadow-sm border border-[#2a1a0f]/5 dark:border-[#d4af37]/10">
          <h3 className="font-bold text-[#2a1a0f] dark:text-[#f7f1e6] mb-4">إيرادات شهرية</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="label" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} name="الإيراد $" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-[#2a1a0f] rounded-2xl p-5 shadow-sm border border-[#2a1a0f]/5 dark:border-[#d4af37]/10">
          <h3 className="font-bold text-[#2a1a0f] dark:text-[#f7f1e6] mb-4">أكثر الدول طلباً</h3>
          {topCountries.length === 0 ? (
            <div className="h-[260px] grid place-items-center text-sm text-[#2a1a0f]/40">لا توجد بيانات</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topCountries} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis type="number" fontSize={12} />
                <YAxis dataKey="name" type="category" fontSize={11} width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 8, 8, 0]} name="طلبات" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
