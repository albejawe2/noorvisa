"use client";
import { motion } from "framer-motion";
import { MessageCircle, Sparkles, ArrowDown, Globe2, Plane } from "lucide-react";
import portrait from "../assets/noor-portrait-cutout.png";
import { useLang } from "./LanguageProvider";
import { TiltCard } from "./TiltCard";
import { MagneticLink } from "./MagneticButton";
import { Aurora } from "./Aurora";
import { Counter } from "./Counter";

const WHATSAPP = "https://wa.me/962782727279";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { t, lang } = useLang();

  return (
    <section id="top" className="relative min-h-[100svh] pt-24 pb-12 sm:pt-28 sm:pb-16 px-4 sm:px-6 overflow-hidden bg-aurora">
      <Aurora />

      {/* Eyebrow */}
      <div className="relative z-10 max-w-7xl mx-auto flex justify-center mb-6 sm:mb-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs sm:text-sm"
        >
          <span className="size-1.5 rounded-full bg-violet-glow pulse-ring" />
          <span className="font-semibold tracking-tight text-pearl">{t.hero.eyebrow}</span>
        </motion.div>
      </div>

      {/* BENTO GRID */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-6 auto-rows-[minmax(110px,auto)] gap-3 sm:gap-4">

        {/* HEADLINE — large tile */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
          className="col-span-6 md:col-span-4 row-span-3 glass-strong rounded-[2rem] p-6 sm:p-10 grad-border relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 size-64 rounded-full bg-violet-glow/30 blur-3xl" />
          <h1 className="relative text-[2.5rem] leading-[1.02] sm:text-6xl md:text-[5rem] md:leading-[0.95] font-display font-bold tracking-tight text-balance">
            {t.hero.titleStart}{" "}
            <span className="text-electric">{t.hero.titleHighlight}</span>{" "}
            {t.hero.titleEnd}
          </h1>
          <p className="relative mt-5 sm:mt-7 text-base sm:text-lg text-mist max-w-xl text-pretty">
            {t.hero.desc}
          </p>

          <div className="relative mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
            <MagneticLink
              href={WHATSAPP} target="_blank" rel="noopener"
              className="group bg-electric text-white px-7 py-4 rounded-full font-bold text-base sm:text-lg inline-flex items-center justify-center gap-2.5 shadow-[var(--shadow-glow)] hover:shadow-[var(--shadow-violet)] active:scale-95 transition-shadow relative overflow-hidden"
            >
              <span className="absolute inset-0 shimmer-electric opacity-0 group-hover:opacity-100 transition-opacity" />
              <MessageCircle className="size-5 relative" />
              <span className="relative">{t.hero.ctaWhatsapp}</span>
            </MagneticLink>
            <MagneticLink
              href="#services" strength={0.2}
              className="group glass text-pearl hover:bg-white/10 px-7 py-4 rounded-full font-semibold text-base sm:text-lg inline-flex items-center justify-center gap-2 transition-colors"
            >
              {t.hero.ctaServices}
              <ArrowDown className="size-4 group-hover:translate-y-0.5 transition-transform" />
            </MagneticLink>
          </div>
        </motion.div>

        {/* PORTRAIT tile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.35, ease }}
          className="col-span-6 md:col-span-2 row-span-4 md:row-span-3 relative rounded-[2rem] overflow-hidden glass-strong"
        >
          <div className="absolute inset-0 bg-electric opacity-40" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 70%, rgba(0,0,0,0.6), transparent 60%)" }} />
          <img
            src={portrait}
            alt={t.hero.portraitAlt}
            className="absolute inset-x-0 bottom-0 w-full h-auto float-y drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
            loading="eager"
          />
          {/* badge */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[10px] sm:text-xs font-mono text-pearl/80">
            <span className="glass px-2.5 py-1 rounded-full">★ 5.0</span>
            <span className="glass px-2.5 py-1 rounded-full">EST. 2014</span>
          </div>
          <div className="absolute bottom-4 inset-x-4 glass-strong rounded-2xl p-3 flex items-center gap-3">
            <div className="size-9 rounded-xl bg-violet-glow/20 grid place-items-center">
              <Sparkles className="size-4 text-violet-glow" />
            </div>
            <div>
              <div className="text-[10px] text-mist font-mono uppercase tracking-wider">{t.hero.floatA.label}</div>
              <div className="text-sm font-bold">{t.hero.floatA.value}</div>
            </div>
          </div>
        </motion.div>

        {/* STAT 1 — clients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease }}
          className="col-span-3 md:col-span-2 row-span-2 glass rounded-[2rem] p-5 sm:p-7 relative overflow-hidden group hover:bg-white/[0.07] transition-colors"
        >
          <Globe2 className="absolute -bottom-4 -right-4 size-28 text-violet-glow/15 group-hover:text-violet-glow/30 group-hover:rotate-12 transition-all duration-500" />
          <div className="text-[10px] font-mono text-mist uppercase tracking-[0.2em]">{lang === "ar" ? "عملاء حول العالم" : "Worldwide clients"}</div>
          <div className="text-5xl sm:text-6xl font-display font-bold mt-2 text-electric leading-none">
            <Counter value={600} />+
          </div>
          <div className="text-xs text-mist mt-1">{lang === "ar" ? "في ٥٠+ دولة" : "across 50+ countries"}</div>
        </motion.div>

        {/* STAT 2 — years */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease }}
          className="col-span-3 md:col-span-2 row-span-2 glass rounded-[2rem] p-5 sm:p-7 relative overflow-hidden"
        >
          <div className="text-[10px] font-mono text-mist uppercase tracking-[0.2em]">{lang === "ar" ? "خبرة" : "Experience"}</div>
          <div className="text-5xl sm:text-6xl font-display font-bold mt-2 leading-none">
            <Counter value={10} />
            <span className="text-violet-glow">+</span>
          </div>
          <div className="text-xs text-mist mt-1">{lang === "ar" ? "سنوات في المجال" : "years in the field"}</div>
          <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full w-[92%] bg-electric rounded-full" />
          </div>
        </motion.div>

        {/* MARQUEE strip */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="col-span-6 md:col-span-4 glass-strong rounded-[2rem] py-4 overflow-hidden relative"
        >
          <div className="absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-deep to-transparent" />
          <div className="absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-deep to-transparent" />
          <div className="flex marquee-track whitespace-nowrap gap-8 text-2xl sm:text-3xl font-display font-bold">
            {[...(lang === "ar"
              ? ["شنغن", "كندا", "أمريكا", "بريطانيا", "أستراليا", "ألمانيا", "اليابان", "الإمارات", "تركيا", "ماليزيا"]
              : ["Schengen", "Canada", "USA", "UK", "Australia", "Germany", "Japan", "UAE", "Türkiye", "Malaysia"]),
              ...(lang === "ar"
              ? ["شنغن", "كندا", "أمريكا", "بريطانيا", "أستراليا", "ألمانيا", "اليابان", "الإمارات", "تركيا", "ماليزيا"]
              : ["Schengen", "Canada", "USA", "UK", "Australia", "Germany", "Japan", "UAE", "Türkiye", "Malaysia"])
            ].map((c, i) => (
              <span key={i} className="flex items-center gap-8">
                <span className="text-pearl/80">{c}</span>
                <Plane className="size-4 text-violet-glow rotate-45 shrink-0" />
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-mono text-mist uppercase tracking-[0.3em] flex items-center gap-2"
      >
        <span className="size-1 rounded-full bg-violet-glow" />
        scroll
        <span className="size-1 rounded-full bg-violet-glow" />
      </motion.div>
    </section>
  );
}
