"use client";

/** Animated aurora background — pure CSS, no canvas. Place as absolute layer. */
export function Aurora({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute top-[-20%] left-[10%] size-[60vw] max-w-[800px] rounded-full blob"
           style={{ background: "radial-gradient(circle, rgba(139,92,246,0.45), transparent 60%)", filter: "blur(60px)" }} />
      <div className="absolute top-[20%] right-[-10%] size-[50vw] max-w-[700px] rounded-full blob-2"
           style={{ background: "radial-gradient(circle, rgba(34,211,238,0.3), transparent 60%)", filter: "blur(70px)" }} />
      <div className="absolute bottom-[-15%] left-[20%] size-[55vw] max-w-[700px] rounded-full blob"
           style={{ background: "radial-gradient(circle, rgba(79,70,229,0.5), transparent 60%)", filter: "blur(80px)" }} />
      {/* grid overlay */}
      <div className="absolute inset-0 opacity-[0.04]"
           style={{
             backgroundImage: "linear-gradient(rgba(244,244,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(244,244,255,1) 1px, transparent 1px)",
             backgroundSize: "60px 60px",
           }} />
    </div>
  );
}
