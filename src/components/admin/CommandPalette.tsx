import { useEffect, useState } from "react";
import { Search, FileText, Users, ListChecks } from "lucide-react";
import { listApps, listCustomers, listTasks, type VisaApp, type Customer, type Task } from "@/lib/admin-store";

type Item = { id: string; type: "app" | "customer" | "task"; label: string; sub: string; onSelect: () => void };

export default function CommandPalette({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [apps, setApps] = useState<VisaApp[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      listApps().then(setApps); listCustomers().then(setCustomers); listTasks().then(setTasks);
    }
  }, [open]);

  if (!open) return null;
  const ql = q.toLowerCase();
  const items: Item[] = [
    ...apps.filter((a) => `${a.full_name} ${a.phone} ${a.country} ${a.passport_no || ""}`.toLowerCase().includes(ql))
      .slice(0, 8).map((a): Item => ({ id: a.id, type: "app", label: a.full_name, sub: `${a.country} — ${a.visa_type}`, onSelect: () => { onNavigate("applications"); setOpen(false); } })),
    ...customers.filter((c) => c.full_name.toLowerCase().includes(ql)).slice(0, 6).map((c): Item => ({ id: c.id, type: "customer", label: c.full_name, sub: c.phone || "", onSelect: () => { onNavigate("customers"); setOpen(false); } })),
    ...tasks.filter((t) => t.title.toLowerCase().includes(ql)).slice(0, 6).map((t): Item => ({ id: t.id, type: "task", label: t.title, sub: t.due_date ? new Date(t.due_date).toLocaleDateString("ar") : "", onSelect: () => { onNavigate("tasks"); setOpen(false); } })),
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 grid place-items-start pt-[10vh] px-4" onClick={() => setOpen(false)}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl bg-white dark:bg-[#2a1a0f] rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b">
          <Search className="size-5 text-[#d4af37]" />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث في كل شيء... (Cmd+K)" className="flex-1 bg-transparent outline-none text-[#2a1a0f] dark:text-[#f7f1e6]" />
          <kbd className="text-xs bg-[#f5efe4] dark:bg-[#1a0f08] px-2 py-1 rounded">ESC</kbd>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {items.length === 0 && <div className="text-center py-8 text-sm text-[#2a1a0f]/50">لا توجد نتائج</div>}
          {items.map((it) => {
            const Icon = it.type === "app" ? FileText : it.type === "customer" ? Users : ListChecks;
            return (
              <button key={it.type + it.id} onClick={it.onSelect} className="w-full flex items-center gap-3 p-3 hover:bg-[#f5efe4] dark:hover:bg-[#1a0f08] text-right">
                <Icon className="size-4 text-[#d4af37]" />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-[#2a1a0f] dark:text-[#f7f1e6]">{it.label}</div>
                  <div className="text-xs text-[#2a1a0f]/60 dark:text-[#f7f1e6]/60">{it.sub}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
