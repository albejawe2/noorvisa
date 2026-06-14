import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Plane, CheckCircle2, Clock, XCircle, FileText, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/track/$code")({
  head: ({ params }) => ({
    meta: [
      { title: `متابعة الطلب ${params.code} — NoorVisa` },
      { name: "description", content: "تابع حالة طلب التأشيرة الخاص بك مع NoorVisa" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: TrackPage,
  errorComponent: () => <div className="min-h-screen grid place-items-center text-[#d4af37]">حدث خطأ</div>,
  notFoundComponent: () => <div className="min-h-screen grid place-items-center text-[#d4af37]">الطلب غير موجود</div>,
});

type TrackResult = {
  track_code: string; full_name: string; country: string; visa_type: string; status: string;
  appointment_date: string | null; submission_date: string | null;
  decision_date: string | null; travel_date: string | null; created_at: string;
};

const STATUS: Record<string, { label: string; color: string; Icon: typeof Clock; step: number }> = {
  new: { label: "تم استلام الطلب", color: "#3b82f6", Icon: FileText, step: 1 },
  in_review: { label: "قيد المراجعة", color: "#f59e0b", Icon: Clock, step: 2 },
  approved: { label: "تمت الموافقة", color: "#10b981", Icon: CheckCircle2, step: 3 },
  issued: { label: "صدرت التأشيرة", color: "#8b5cf6", Icon: Plane, step: 4 },
  rejected: { label: "تم الرفض", color: "#ef4444", Icon: XCircle, step: 0 },
};

function TrackPage() {
  const { code } = Route.useParams();
  const [data, setData] = useState<TrackResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    supabase.rpc("lookup_app_by_track_code", { _code: code }).then(({ data, error }) => {
      setLoading(false);
      if (error || !data || (Array.isArray(data) && data.length === 0)) { setNotFound(true); return; }
      setData(Array.isArray(data) ? data[0] as TrackResult : data as TrackResult);
    });
  }, [code]);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg,#1a0f08 0%,#2a1a0f 50%,#3d2715 100%)" }} dir="rtl">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <a href="/" className="inline-flex items-center gap-2 text-[#d4af37] mb-8 font-bold"><ArrowRight className="size-4" /> العودة للموقع</a>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl mb-4" style={{ background: "linear-gradient(135deg,#d4af37,#c9a04a)" }}>
            <Plane className="size-8 text-[#1a0f08]" />
          </div>
          <h1 className="text-3xl font-bold text-[#f7f1e6]">متابعة الطلب</h1>
          <p className="text-[#d4af37]/70 mt-2 text-sm">رقم الطلب: <span className="font-bold text-[#d4af37]">{code}</span></p>
        </div>

        {loading && <div className="text-center text-[#d4af37]">جاري التحميل...</div>}
        {notFound && (
          <div className="bg-rose-500/15 border border-rose-500/30 rounded-3xl p-8 text-center">
            <XCircle className="size-12 mx-auto text-rose-400 mb-3" />
            <h2 className="text-xl font-bold text-rose-200">رقم الطلب غير صحيح</h2>
            <p className="text-rose-200/70 mt-2 text-sm">تأكد من الرقم أو تواصل معنا</p>
            <SearchAnother />
          </div>
        )}
        {data && (
          <div className="space-y-6">
            <div className="bg-[#2a1a0f]/80 backdrop-blur border border-[#d4af37]/20 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#d4af37]/20">
                <div className="size-14 rounded-2xl grid place-items-center" style={{ background: STATUS[data.status]?.color || "#888" }}>
                  {(() => { const Icon = STATUS[data.status]?.Icon || Clock; return <Icon className="size-7 text-white" />; })()}
                </div>
                <div>
                  <div className="text-xs text-[#d4af37]/70 font-bold">الحالة الحالية</div>
                  <div className="text-xl font-bold text-[#f7f1e6]">{STATUS[data.status]?.label || data.status}</div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <Row label="مقدم الطلب" value={data.full_name} />
                <Row label="الدولة" value={data.country} />
                <Row label="نوع التأشيرة" value={data.visa_type} />
                <Row label="تاريخ الإنشاء" value={new Date(data.created_at).toLocaleDateString("ar")} />
                {data.appointment_date && <Row label="موعد السفارة" value={new Date(data.appointment_date).toLocaleDateString("ar")} />}
                {data.submission_date && <Row label="تاريخ التقديم" value={new Date(data.submission_date).toLocaleDateString("ar")} />}
                {data.decision_date && <Row label="تاريخ القرار" value={new Date(data.decision_date).toLocaleDateString("ar")} />}
                {data.travel_date && <Row label="تاريخ السفر" value={new Date(data.travel_date).toLocaleDateString("ar")} />}
              </div>
            </div>

            <Timeline status={data.status} />
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-[#d4af37]/10 last:border-0">
      <span className="text-[#d4af37]/70">{label}</span>
      <span className="text-[#f7f1e6] font-bold">{value}</span>
    </div>
  );
}

function Timeline({ status }: { status: string }) {
  const currentStep = STATUS[status]?.step ?? 0;
  const steps = [
    { n: 1, label: "استلام الطلب" }, { n: 2, label: "المراجعة" },
    { n: 3, label: "الموافقة" }, { n: 4, label: "إصدار التأشيرة" },
  ];
  return (
    <div className="bg-[#2a1a0f]/80 backdrop-blur border border-[#d4af37]/20 rounded-3xl p-6">
      <h3 className="text-[#f7f1e6] font-bold mb-4">مراحل الطلب</h3>
      <div className="space-y-3">
        {steps.map((s) => {
          const done = s.n <= currentStep;
          const active = s.n === currentStep;
          return (
            <div key={s.n} className="flex items-center gap-3">
              <div className={`size-8 rounded-full grid place-items-center text-xs font-bold ${done ? "text-[#1a0f08]" : "text-[#d4af37]/40"} ${active ? "ring-2 ring-[#d4af37] animate-pulse" : ""}`}
                style={{ background: done ? "#d4af37" : "rgba(212,175,55,0.1)" }}>
                {done ? "✓" : s.n}
              </div>
              <span className={`text-sm ${done ? "text-[#f7f1e6] font-bold" : "text-[#d4af37]/50"}`}>{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SearchAnother() {
  const [c, setC] = useState("");
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (c.trim()) window.location.href = `/track/${c.trim().toUpperCase()}`; }} className="mt-6 flex gap-2">
      <input value={c} onChange={(e) => setC(e.target.value)} placeholder="NV-XXXXXX" className="flex-1 bg-[#1a0f08] border border-[#d4af37]/30 rounded-xl px-4 py-3 text-[#f7f1e6] focus:outline-none focus:border-[#d4af37] text-center font-mono uppercase" />
      <button className="px-5 rounded-xl font-bold text-[#1a0f08]" style={{ background: "linear-gradient(135deg,#d4af37,#c9a04a)" }}><Search className="size-4" /></button>
    </form>
  );
}
