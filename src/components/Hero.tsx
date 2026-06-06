import portrait from "../assets/noor-portrait.png.asset.json";
import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";
import { MessageCircle, ArrowDown } from "lucide-react";

const WHATSAPP = "https://wa.me/962782727279";

export function Hero() {
  const { t, lang } = useLang();
  const arrow = lang === "ar" ? "←" : "→";

  return (
    <section id="top" className="relative min-h-screen flex flex-col md:flex-row items-center justify-center pt-28 pb-16 md:pt-32 md:pb-24 px-5 sm:px-6 gap-10 md:gap-12 overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#1a1a1a_0%,#0a0a0a_70%)]" />
      <div className="absolute top-1/3 -left-32 size-72 md:size-96 rounded-full bg-gold/10 blur-[120px]" />
      <div className="absolute bottom-0 -right-32 size-72 md:size-96 rounded-full bg-gold/5 blur-[120px]" />

      <div className="relative z-10 w-full max-w-2xl">
        <Reveal>
          <span className="inline-flex items-center gap-2 font-mono text-gold text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-5 sm:mb-6">
            <span className="size-1.5 rounded-full bg-gold pulse-gold" />
            {t.hero.eyebrow}
          </span>
        </Reveal>
        <Reveal delay={120}>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-5 sm:mb-6 text-balance ${lang === "ar" ? "font-arabic" : "font-sans"}`}>
            {t.hero.titleStart} <span className="text-gold italic">{t.hero.titleHighlight}</span> {t.hero.titleEnd}
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <p className={`text-base sm:text-lg md:text-xl text-stone-400 mb-7 sm:mb-8 max-w-lg leading-relaxed text-pretty ${lang === "ar" ? "font-arabic" : "font-sans"}`}>
            {t.hero.desc}
          </p>
        </Reveal>
        <Reveal delay={360}>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener"
              className="shimmer-gold text-onyx px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg font-bold rounded-sm inline-flex items-center justify-center gap-3 group shadow-xl shadow-gold/20 hover:shadow-gold/40 transition-shadow active:scale-95"
            >
              <MessageCircle className="size-5 shrink-0" />
              {t.hero.ctaWhatsapp}
              <span className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">{arrow}</span>
            </a>
            <a
              href="#services"
              className="border border-white/15 hover:border-gold hover:bg-white/5 px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg font-medium rounded-sm transition-all text-center inline-flex items-center justify-center gap-2"
            >
              {t.hero.ctaServices}
              <ArrowDown className="size-4 opacity-60" />
            </a>
          </div>
        </Reveal>
      </div>

      <Reveal delay={300} className="relative z-10 w-full max-w-sm md:max-w-md">
        <div className="relative float-y">
          <div className="absolute -inset-3 sm:-inset-4 border border-gold/30 rounded-lg" />
          <div className="absolute -inset-1 bg-gradient-to-tr from-gold/20 via-transparent to-gold/10 rounded-lg blur-xl" />
          <div className="relative w-full aspect-[4/5] bg-charcoal rounded-lg overflow-hidden ring-1 ring-white/10">
            <img
              src={portrait.url}
              alt={t.hero.portraitAlt}
              className="w-full h-full object-cover object-top"
              loading="eager"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-onyx via-onyx/40 to-transparent" />
          </div>
          <div className="absolute -bottom-5 ltr:-right-4 rtl:-left-4 sm:ltr:-right-6 sm:rtl:-left-6 bg-onyx border border-gold/30 p-4 sm:p-5 rounded-lg shadow-2xl shadow-gold/20">
            <div className="text-2xl sm:text-3xl font-bold text-gold font-mono leading-none">{t.hero.badgeNumber}</div>
            <div className="text-[10px] text-stone-400 font-mono tracking-tight mt-1 uppercase">{t.hero.badgeLabel}</div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
