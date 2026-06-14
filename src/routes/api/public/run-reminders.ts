import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/run-reminders")({
  server: {
    handlers: {
      POST: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const now = new Date();
        const inThreeDays = new Date(now.getTime() + 3 * 86400000).toISOString();
        const today = now.toISOString();

        // طلبات بمواعيد سفارة قادمة خلال 3 أيام
        const { data: upcoming } = await supabaseAdmin
          .from("visa_apps")
          .select("id, full_name, country, appointment_date, travel_date")
          .or(`appointment_date.gte.${today},travel_date.gte.${today.slice(0, 10)}`)
          .lte("appointment_date", inThreeDays);

        const notifications = (upcoming || []).flatMap((a) => {
          const out: { title: string; body: string; kind: string; link: string }[] = [];
          if (a.appointment_date) {
            const d = new Date(a.appointment_date);
            const days = Math.ceil((d.getTime() - now.getTime()) / 86400000);
            if (days <= 3 && days >= 0) {
              out.push({
                title: `موعد سفارة قريب — ${a.full_name}`,
                body: `موعد ${a.country} خلال ${days} يوم`,
                kind: "warning",
                link: `/admin?app=${a.id}`,
              });
            }
          }
          return out;
        });

        if (notifications.length > 0) {
          await supabaseAdmin.from("notifications").insert(notifications.map((n) => ({ ...n, user_id: null })));
        }

        return Response.json({ ok: true, created: notifications.length });
      },
    },
  },
});
