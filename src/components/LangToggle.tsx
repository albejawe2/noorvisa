import { useLang } from "./LanguageProvider";

export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, toggle } = useLang();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle language"
      className={`px-3 py-1.5 border border-white/15 rounded text-[11px] font-mono uppercase tracking-widest text-stone-200 hover:border-gold hover:text-gold transition-colors ${className}`}
    >
      {lang === "ar" ? "EN" : "ع"}
    </button>
  );
}
