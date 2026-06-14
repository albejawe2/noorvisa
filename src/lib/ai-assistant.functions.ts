import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const askAssistant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { question: string; context?: string }) => d)
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) return { reply: "LOVABLE_API_KEY غير مهيأ" };
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "أنت مساعد ذكي للوحة تحكم نور فيزا. أجب بالعربية بإيجاز ومهنية، واقترح خطوات عملية." },
          ...(data.context ? [{ role: "system", content: `سياق:\n${data.context}` }] : []),
          { role: "user", content: data.question },
        ],
      }),
    });
    if (!res.ok) return { reply: `خطأ: ${res.status}` };
    const j = await res.json() as { choices?: { message?: { content?: string } }[] };
    return { reply: j.choices?.[0]?.message?.content || "لا توجد إجابة" };
  });
