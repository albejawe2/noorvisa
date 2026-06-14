import { useEffect, useState } from "react";
import { Activity as ActIcon, Plus, Edit3, Trash2 } from "lucide-react";
import { listActivity, type Activity } from "@/lib/admin-store";

const ENTITY_LABEL: Record<string, string> = {
  visa_apps: "طلب", customers: "عميل", payments: "دفعة", tasks: "مهمة", documents: "ملف",
};
const ACTION_LABEL: Record<string, { t: string; c: string; Icon: typeof Plus }> = {
  insert: { t: "إنشاء", c: "bg-emerald-50 text-emerald-700", Icon: Plus },
  update: { t: "تعديل", c: "bg-amber-50 text-amber-700", Icon: Edit3 },
  delete: { t: "حذف", c: "bg-rose-50 text-rose-700", Icon: Trash2 },
};

export default function ActivityLog() {
  const [list, setList] = useState<Activity[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => { listActivity(200).then(setList); }, []);

  const filtered = filter === "all" ? list : list.filter((a) => a.entity_type === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {["all", "visa_apps", "customers", "payments", "tasks"].map((k) => (
          <button key={k} onClick={() => setFilter(k)}
            className={`px-4 py-2 rounded-xl text-xs font-bold ${filter === k ? "bg-[#d4af37] text-[#1a0f08]" : "bg-white dark:bg-[#2a1a0f] text-[#2a1a0f] dark:text-[#f7f1e6]"}`}>
            {k === "all" ? "الكل" : ENTITY_LABEL[k] || k}
          </button>
        ))}
      </div>
      <div className="bg-white dark:bg-[#2a1a0f] rounded-2xl shadow-sm divide-y divide-[#2a1a0f]/5 dark:divide-[#d4af37]/10">
        {filtered.length === 0 && <div className="text-center text-sm text-[#2a1a0f]/50 py-16">لا توجد سجلات</div>}
        {filtered.map((a) => {
          const act = ACTION_LABEL[a.action] || { t: a.action, c: "bg-blue-50 text-blue-700", Icon: ActIcon };
          const Icon = act.Icon;
          const meta = a.meta as Record<string, unknown> | null;
          const newRow = meta?.new as Record<string, unknown> | undefined;
          const oldRow = meta?.old as Record<string, unknown> | undefined;
          const ref = newRow || oldRow;
          const label = (ref?.full_name as string) || (ref?.title as string) || (ref?.file_name as string) || "—";
          return (
            <div key={a.id} className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${act.c}`}><Icon className="size-4" /></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#2a1a0f] dark:text-[#f7f1e6]">
                  {act.t} {ENTITY_LABEL[a.entity_type] || a.entity_type}: <span className="text-[#d4af37]">{label}</span>
                </div>
                <div className="text-xs text-[#2a1a0f]/60 dark:text-[#f7f1e6]/60 mt-0.5">{new Date(a.created_at).toLocaleString("ar")}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
