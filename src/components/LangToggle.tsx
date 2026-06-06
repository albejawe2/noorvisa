"use client";
import { Globe } from "lucide-react";
import { useLang } from "./LanguageProvider";

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => setLang(lang === "ar" ? "en" : "ar")}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass hover:bg-white/10 text-pearl text-xs font-bold transition-colors"
      aria-label="Switch language"
    >
      <Globe className="size-3.5" />
      {lang === "ar" ? "EN" : "AR"}
    </button>
  );
}
