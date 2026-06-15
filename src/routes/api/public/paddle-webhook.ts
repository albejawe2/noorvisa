import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

// Paddle webhook — verifies signature using secret stored in app_settings (managed from dashboard)
export const Route = createFileRoute("/api/public/paddle-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.text();
        const sigHeader = request.headers.get("paddle-signature") || "";

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Load Paddle settings from DB
        const { data: settingRow } = await supabaseAdmin
          .from("app_settings").select("value").eq("key", "paddle").maybeSingle();
        const settings = (settingRow?.value || {}) as {
          enabled?: boolean; webhook_secret?: string; environment?: string;
        };

        if (!settings.enabled) {
          return new Response("Paddle integration disabled", { status: 403 });
        }

        // Verify Paddle signature: format "ts=...;h1=..."
        if (settings.webhook_secret) {
          const parts = Object.fromEntries(sigHeader.split(";").map(p => {
            const i = p.indexOf("="); return [p.slice(0, i), p.slice(i + 1)];
          }));
          const ts = parts.ts; const h1 = parts.h1;
          if (!ts || !h1) return new Response("Missing signature", { status: 401 });
          const signed = `${ts}:${body}`;
          const expected = createHmac("sha256", settings.webhook_secret).update(signed).digest("hex");
          try {
            const a = Buffer.from(h1, "hex");
            const b = Buffer.from(expected, "hex");
            if (a.length !== b.length || !timingSafeEqual(a, b)) {
              return new Response("Invalid signature", { status: 401 });
            }
          } catch {
            return new Response("Invalid signature", { status: 401 });
          }
        }

        let payload: { event_type?: string; data?: Record<string, unknown> };
        try { payload = JSON.parse(body); } catch { return new Response("bad json", { status: 400 }); }

        if (payload.event_type === "transaction.completed" || payload.event_type === "transaction.paid") {
          const tx = payload.data as { id?: string; custom_data?: { app_id?: string }; details?: { totals?: { total?: string; currency_code?: string } } };
          const appId = tx.custom_data?.app_id;
          if (appId) {
            const amount = Number(tx.details?.totals?.total || 0) / 100;
            const currency = tx.details?.totals?.currency_code || "USD";
            await supabaseAdmin.from("payments").insert({
              app_id: appId, amount, currency, method: "Paddle", note: `tx ${tx.id}`,
              paid_at: new Date().toISOString(),
            });
            const { data: pays } = await supabaseAdmin.from("payments").select("amount").eq("app_id", appId);
            const total = (pays || []).reduce((s, p) => s + Number(p.amount || 0), 0);
            await supabaseAdmin.from("visa_apps").update({ paid: total, paddle_transaction_id: tx.id }).eq("id", appId);
            await supabaseAdmin.from("notifications").insert({
              title: "دفعة جديدة عبر Paddle", body: `${amount} ${currency} — رقم الطلب ${appId.slice(0, 8)}`,
              kind: "success", link: `/admin?app=${appId}`, user_id: null,
            });
          }
        }

        return new Response("ok");
      },
    },
  },
});
