import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { listNotifications, markNotificationRead, markAllRead, type Notification } from "@/lib/admin-store";

export default function NotificationsBell() {
  const [list, setList] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const reload = () => listNotifications().then(setList);
  useEffect(() => { reload(); const t = setInterval(reload, 60000); return () => clearInterval(t); }, []);
  const unread = list.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-lg hover:bg-[#f5efe4] dark:hover:bg-[#1a0f08]">
        <Bell className="size-5 text-[#2a1a0f] dark:text-[#f7f1e6]" />
        {unread > 0 && <span className="absolute -top-0.5 -right-0.5 size-5 rounded-full bg-rose-500 text-white text-[10px] grid place-items-center font-bold">{unread}</span>}
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} className="fixed inset-0 z-40" />
          <div className="absolute top-full left-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-[#2a1a0f] rounded-2xl shadow-2xl border border-[#2a1a0f]/10 dark:border-[#d4af37]/20 z-50">
            <div className="sticky top-0 bg-white dark:bg-[#2a1a0f] p-3 border-b flex justify-between items-center">
              <span className="font-bold text-sm text-[#2a1a0f] dark:text-[#f7f1e6]">الإشعارات</span>
              {unread > 0 && <button onClick={async () => { await markAllRead(); reload(); }} className="text-xs text-[#d4af37] font-bold">تعليم الكل</button>}
            </div>
            {list.length === 0 ? (
              <div className="text-center py-10 text-sm text-[#2a1a0f]/50">لا توجد إشعارات</div>
            ) : list.map((n) => (
              <div key={n.id} onClick={async () => { if (!n.read) { await markNotificationRead(n.id); reload(); } }}
                className={`p-3 border-b border-[#2a1a0f]/5 dark:border-[#d4af37]/10 cursor-pointer hover:bg-[#f5efe4] dark:hover:bg-[#1a0f08] ${!n.read ? "bg-[#d4af37]/5" : ""}`}>
                <div className="flex items-start gap-2">
                  {!n.read && <span className="size-2 rounded-full bg-[#d4af37] mt-1.5 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-[#2a1a0f] dark:text-[#f7f1e6]">{n.title}</div>
                    {n.body && <div className="text-xs text-[#2a1a0f]/70 dark:text-[#f7f1e6]/70 mt-0.5">{n.body}</div>}
                    <div className="text-[10px] text-[#2a1a0f]/40 mt-1">{new Date(n.created_at).toLocaleString("ar")}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
