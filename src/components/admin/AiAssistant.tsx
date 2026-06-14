import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, Send, Loader2, X } from "lucide-react";
import { askAssistant } from "@/lib/ai-assistant.functions";

type Msg = { role: "user" | "ai"; text: string };

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const ask = useServerFn(askAssistant);

  async function send() {
    if (!q.trim() || busy) return;
    const userMsg: Msg = { role: "user", text: q };
    setMsgs((m) => [...m, userMsg]); setQ(""); setBusy(true);
    try {
      const r = await ask({ data: { question: userMsg.text } });
      setMsgs((m) => [...m, { role: "ai", text: r.reply }]);
    } catch (e) {
      setMsgs((m) => [...m, { role: "ai", text: "حدث خطأ: " + (e instanceof Error ? e.message : "") }]);
    } finally { setBusy(false); }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed bottom-5 ltr:right-5 rtl:left-5 z-40 size-14 rounded-full shadow-2xl grid place-items-center text-[#1a0f08] active:scale-95 transition"
        style={{ background: "linear-gradient(135deg,#d4af37,#c9a04a)" }} aria-label="المساعد الذكي">
        <Sparkles className="size-6" />
      </button>
      {open && (
        <div className="fixed inset-0 z-[90] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-[#2a1a0f] w-full sm:max-w-lg h-[80vh] sm:h-[600px] rounded-t-3xl sm:rounded-3xl flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-[#d4af37] to-[#c9a04a] rounded-t-3xl">
              <h3 className="font-bold text-[#1a0f08] flex items-center gap-2"><Sparkles className="size-5" />المساعد الذكي</h3>
              <button onClick={() => setOpen(false)} className="text-[#1a0f08]"><X className="size-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgs.length === 0 && (
                <div className="text-center text-sm text-[#2a1a0f]/50 dark:text-[#f7f1e6]/50 py-8">
                  <Sparkles className="size-12 mx-auto text-[#d4af37] mb-3" />
                  اسألني عن أي شيء يتعلق بالطلبات أو العملاء أو نصائح للتأشيرات
                </div>
              )}
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap
                    ${m.role === "user" ? "bg-[#d4af37] text-[#1a0f08] rounded-br-sm" : "bg-[#f5efe4] dark:bg-[#1a0f08] text-[#2a1a0f] dark:text-[#f7f1e6] rounded-bl-sm"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {busy && <div className="flex justify-start"><div className="bg-[#f5efe4] dark:bg-[#1a0f08] px-4 py-2.5 rounded-2xl"><Loader2 className="size-4 animate-spin text-[#d4af37]" /></div></div>}
            </div>
            <div className="p-3 border-t flex gap-2">
              <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="اكتب سؤالك..." className="flex-1 bg-[#f5efe4] dark:bg-[#1a0f08] border rounded-xl px-4 py-2.5 text-sm" />
              <button onClick={send} disabled={busy || !q.trim()} className="px-4 rounded-xl font-bold text-[#1a0f08] disabled:opacity-50" style={{ background: "linear-gradient(135deg,#d4af37,#c9a04a)" }}>
                <Send className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
