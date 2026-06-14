import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from "lucide-react";
import { listApps, listTasks, type VisaApp, type Task } from "@/lib/admin-store";

type Event = { date: string; title: string; kind: "appointment" | "travel" | "submission" | "decision" | "task"; color: string };

const KIND_LABEL: Record<Event["kind"], string> = {
  appointment: "موعد سفارة", travel: "سفر", submission: "تقديم", decision: "قرار", task: "مهمة",
};

export default function CalendarView() {
  const [apps, setApps] = useState<VisaApp[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => { listApps().then(setApps); listTasks().then(setTasks); }, []);

  const events = useMemo<Event[]>(() => {
    const out: Event[] = [];
    apps.forEach((a) => {
      if (a.appointment_date) out.push({ date: a.appointment_date.slice(0, 10), title: `${a.full_name} — موعد ${a.country}`, kind: "appointment", color: "#3b82f6" });
      if (a.submission_date) out.push({ date: a.submission_date.slice(0, 10), title: `${a.full_name} — تقديم`, kind: "submission", color: "#8b5cf6" });
      if (a.decision_date) out.push({ date: a.decision_date.slice(0, 10), title: `${a.full_name} — قرار`, kind: "decision", color: "#10b981" });
      if (a.travel_date) out.push({ date: a.travel_date.slice(0, 10), title: `${a.full_name} — سفر`, kind: "travel", color: "#f59e0b" });
    });
    tasks.forEach((t) => { if (t.due_date) out.push({ date: t.due_date.slice(0, 10), title: t.title, kind: "task", color: "#ef4444" }); });
    return out;
  }, [apps, tasks]);

  const grid = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const last = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    const days: { date: Date; iso: string; inMonth: boolean }[] = [];
    // start week on Sunday
    const startOffset = first.getDay();
    for (let i = startOffset; i > 0; i--) {
      const d = new Date(first); d.setDate(d.getDate() - i);
      days.push({ date: d, iso: d.toISOString().slice(0, 10), inMonth: false });
    }
    for (let d = 1; d <= last.getDate(); d++) {
      const date = new Date(cursor.getFullYear(), cursor.getMonth(), d);
      days.push({ date, iso: date.toISOString().slice(0, 10), inMonth: true });
    }
    while (days.length % 7 !== 0) {
      const d = new Date(days[days.length - 1].date); d.setDate(d.getDate() + 1);
      days.push({ date: d, iso: d.toISOString().slice(0, 10), inMonth: false });
    }
    return days;
  }, [cursor]);

  const eventsByDate = useMemo(() => {
    const m: Record<string, Event[]> = {};
    events.forEach((e) => { (m[e.date] ||= []).push(e); });
    return m;
  }, [events]);

  const monthLabel = cursor.toLocaleDateString("ar", { month: "long", year: "numeric" });
  const weekdays = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-[#2a1a0f] rounded-2xl p-4 shadow-sm border border-[#2a1a0f]/5 dark:border-[#d4af37]/10">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} className="p-2 rounded-lg bg-[#f5efe4] dark:bg-[#1a0f08]"><ChevronRight className="size-5" /></button>
          <div className="font-bold text-lg text-[#2a1a0f] dark:text-[#f7f1e6] flex items-center gap-2"><CalIcon className="size-5 text-[#d4af37]" />{monthLabel}</div>
          <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} className="p-2 rounded-lg bg-[#f5efe4] dark:bg-[#1a0f08]"><ChevronLeft className="size-5" /></button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-[#2a1a0f]/60 dark:text-[#f7f1e6]/60 mb-2">
          {weekdays.map((w) => <div key={w}>{w}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {grid.map((d) => {
            const evs = eventsByDate[d.iso] || [];
            const isToday = d.iso === today;
            return (
              <button key={d.iso + d.inMonth} onClick={() => setSelected(d.iso)}
                className={`aspect-square min-h-[60px] p-1.5 rounded-lg text-right flex flex-col gap-0.5 transition
                  ${d.inMonth ? "bg-[#f5efe4] dark:bg-[#1a0f08]" : "bg-transparent text-[#2a1a0f]/30 dark:text-[#f7f1e6]/20"}
                  ${isToday ? "ring-2 ring-[#d4af37]" : ""}
                  ${selected === d.iso ? "bg-[#d4af37]/30" : ""}`}>
                <div className="text-xs font-bold text-[#2a1a0f] dark:text-[#f7f1e6]">{d.date.getDate()}</div>
                <div className="flex flex-wrap gap-0.5">
                  {evs.slice(0, 3).map((e, i) => <span key={i} className="size-1.5 rounded-full" style={{ background: e.color }} />)}
                  {evs.length > 3 && <span className="text-[9px] text-[#2a1a0f]/60">+{evs.length - 3}</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selected && (
        <div className="bg-white dark:bg-[#2a1a0f] rounded-2xl p-5 shadow-sm">
          <h4 className="font-bold mb-3 text-[#2a1a0f] dark:text-[#f7f1e6]">{new Date(selected).toLocaleDateString("ar", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</h4>
          {(eventsByDate[selected] || []).length === 0 ? (
            <p className="text-sm text-[#2a1a0f]/50 dark:text-[#f7f1e6]/50">لا توجد أحداث في هذا اليوم</p>
          ) : (
            <ul className="space-y-2">
              {(eventsByDate[selected] || []).map((e, i) => (
                <li key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#f5efe4] dark:bg-[#1a0f08]">
                  <div className="size-3 rounded-full" style={{ background: e.color }} />
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-[#2a1a0f] dark:text-[#f7f1e6]">{e.title}</div>
                    <div className="text-xs text-[#2a1a0f]/60 dark:text-[#f7f1e6]/60">{KIND_LABEL[e.kind]}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
