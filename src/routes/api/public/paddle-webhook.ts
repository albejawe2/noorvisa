import { createFileRoute } from "@tanstack/react-router";

// Paddle webhook: نستقبل أحداث الدفع ونحدّث الطلب
export const Route = createFileRoute("/api/public/paddle-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.text();
        let payload: { event_type?: string; data?: Record<string, unknown> };
        try { payload = JSON.parse(body); } catch { return new Response("bad json", { status: 400 }); }

        // TODO: التحقق من توقيع Paddle عند ربط المفاتيح
        // const signature = request.headers.get("paddle-signature");

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        if (payload.event_type === "transaction.completed" || payload.event_type === "transaction.paid") {
          const tx = payload.data as { id?: string; custom_data?: { app_id?: string }; details?: { totals?: { total?: string } } };
          const appId = tx.custom_data?.app_id;
          if (appId) {
            const amount = Number(tx.details?.totals?.total || 0) / 100;
            await supabaseAdmin.from("payments").insert({
              app_id: appId, amount, currency: "USD", method: "Paddle", note: `tx ${tx.id}`,
              paid_at: new Date().toISOString(),
            });
            const { data: pays } = await supabaseAdmin.from("payments").select("amount").eq("app_id", appId);
            const total = (pays || []).reduce((s, p) => s + Number(p.amount || 0), 0);
            await supabaseAdmin.from("visa_apps").update({ paid: total, paddle_transaction_id: tx.id }).eq("id", appId);
            await supabaseAdmin.from("notifications").insert({
              title: "دفعة جديدة عبر Paddle", body: `${amount} $ — رقم الطلب ${appId.slice(0, 8)}`,
              kind: "success", link: `/admin?app=${appId}`, user_id: null,
            });
          }
        }

        return new Response("ok");
      },
    },
  },
});
