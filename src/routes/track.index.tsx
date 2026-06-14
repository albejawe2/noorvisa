import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plane, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/track/")({
  head: () => ({
    meta: [
      { title: "متابعة طلب التأشيرة — NoorVisa" },
      { name: "description", content: "تابع حالة طلب التأشيرة الخاص بك مع NoorVisa برقم الطلب" },
    ],
  }),
  component: TrackHome,
});

function TrackHome() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  return (
    <div className="min-h-screen grid place-items-center px-4" style={{ background: "linear-gradient(135deg,#1a0f08 0%,#2a1a0f 50%,#3d2715 100%)" }} dir="rtl">
      <div className="w-full max-w-md">
        <a href="/" className="inline-flex items-center gap-2 text-[#d4af37] mb-8 font-bold"><ArrowRight className="size-4" /> العودة للموقع</a>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl mb-4" style={{ background: "linear-gradient(135deg,#d4af37,#c9a04a)" }}>
            <Plane className="size-8 text-[#1a0f08]" />
          </div>
          <h1 className="text-3xl font-bold text-[#f7f1e6]">متابعة طلبك</h1>
          <p className="text-[#d4af37]/70 mt-2 text-sm">أدخل رقم الطلب الذي حصلت عليه منا</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if (code.trim()) navigate({ to: "/track/$code", params: { code: code.trim().toUpperCase() } }); }}
          className="bg-[#2a1a0f]/80 backdrop-blur border border-[#d4af37]/20 rounded-3xl p-6 space-y-4">
          <input autoFocus value={code} onChange={(e) => setCode(e.target.value)} placeholder="NV-XXXXXX"
            className="w-full bg-[#1a0f08] border border-[#d4af37]/30 rounded-xl px-4 py-4 text-[#f7f1e6] focus:outline-none focus:border-[#d4af37] text-center font-mono text-xl uppercase tracking-wider" />
          <button className="w-full py-3.5 rounded-xl font-bold text-[#1a0f08] flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg,#d4af37,#c9a04a)" }}>
            <Search className="size-4" />متابعة
          </button>
        </form>
      </div>
    </div>
  );
}
