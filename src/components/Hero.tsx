"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Phone, Sparkles, ArrowDown } from "lucide-react";
import portrait from "../assets/noor-portrait-cutout.png";
import { useLang } from "./LanguageProvider";

const CONTACT = "tel:+962782727279";

export function Hero() {
  const { t, lang } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Apple-style: portrait scales/moves while text slides up sequentially
  const imgScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.7]);
  const imgY = useTransform(scrollYProgress, [0, 0.6], [0, -80]);
  const bgRotate = useTransform(scrollYProgress, [0, 1], [0, 25]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative min-h-[100svh] pt-24 pb-12 sm:pt-28 sm:pb-16 px-5 sm:px-8 overflow-hidden bg-warm-gradient grain"
    >
      {/* Decorative sunset blob */}
      <motion.div
        style={{ rotate: bgRotate }}
        className="absolute -top-32 -right-32 sm:-right-20 size-[420px] sm:size-[620px] rounded-full opacity-70 blur-3xl"
      >
        <div className="w-full h-full bg-sunset rounded-full" />
      </motion.div>
      <div className="absolute bottom-0 -left-20 size-72 sm:size-96 rounded-full bg-amber-warm/20 blur-3xl" />

      {/* Top eyebrow chip */}
      <div className="relative z-10 max-w-6xl mx-auto flex justify-center mb-6 sm:mb-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-ink/10 rounded-full px-4 py-1.5 text-xs sm:text-sm shadow-sm"
        >
          <span className="size-1.5 rounded-full bg-ember pulse-ring" />
          <span className="font-semibold tracking-tight">{t.hero.eyebrow}</span>
        </motion.div>
      </div>

      {/* Main grid: portrait + headline */}
      <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Portrait — mobile first: large floating cutout */}
        <motion.div
          style={{ scale: imgScale, y: imgY }}
          className="relative order-1 md:order-2 mx-auto w-full max-w-[340px] sm:max-w-[420px]"
        >
          {/* Sunset disc behind portrait */}
          <div className="absolute inset-x-4 top-8 bottom-8 bg-sunset rounded-[40%] blur-2xl opacity-60" />
          <div className="absolute inset-x-8 top-12 bottom-12 bg-sunset rounded-full opacity-90" />

          {/* Cutout image */}
          <motion.img
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            src={portrait}
            alt={t.hero.portraitAlt}
            className="relative w-full h-auto drop-shadow-[0_30px_50px_rgba(225,29,72,0.35)] float-soft"
            loading="eager"
          />

          {/* Floating mini cards */}
          <motion.div
            initial={{ opacity: 0, x: lang === "ar" ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="absolute top-8 ltr:-left-2 rtl:-right-2 sm:ltr:-left-6 sm:rtl:-right-6 bg-white shadow-[var(--shadow-card)] rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 flex items-center gap-2"
          >
            <div className="size-8 rounded-full bg-emerald-deep/10 flex items-center justify-center">
              <Sparkles className="size-4 text-emerald-deep" />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs text-muted-foreground font-medium">{t.hero.floatA.label}</div>
              <div className="text-xs sm:text-sm font-bold">{t.hero.floatA.value}</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: lang === "ar" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="absolute bottom-12 ltr:-right-2 rtl:-left-2 sm:ltr:-right-4 sm:rtl:-left-4 bg-ink text-ivory shadow-[var(--shadow-card)] rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3"
          >
            <div className="text-2xl sm:text-3xl font-display font-bold leading-none">+600</div>
            <div className="text-[10px] sm:text-xs opacity-70 mt-0.5">{t.hero.floatB}</div>
          </motion.div>
        </motion.div>

        {/* Text content */}
        <div className="order-2 md:order-1 text-center md:text-start">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-[2.6rem] leading-[1.05] sm:text-6xl md:text-[4.5rem] md:leading-[1] font-display font-bold tracking-tight text-balance"
          >
            {t.hero.titleStart}{" "}
            <span className="text-sunset italic">{t.hero.titleHighlight}</span>{" "}
            {t.hero.titleEnd}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="mt-5 sm:mt-7 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto md:mx-0 text-pretty"
          >
            {t.hero.desc}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.95 }}
            className="mt-7 sm:mt-9 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start"
          >
            <a
              href={CONTACT}
              className="group bg-sunset text-white px-7 py-4 rounded-full font-bold text-base sm:text-lg inline-flex items-center justify-center gap-2.5 shadow-[var(--shadow-soft)] hover:scale-[1.03] active:scale-95 transition-transform"
            >
              <Phone className="size-5" />
              {t.hero.ctaWhatsapp}
            </a>
            <a
              href="#services"
              className="group border border-ink/15 hover:border-ink hover:bg-white text-ink px-7 py-4 rounded-full font-semibold text-base sm:text-lg inline-flex items-center justify-center gap-2 transition-colors"
            >
              {t.hero.ctaServices}
              <ArrowDown className="size-4 group-hover:translate-y-0.5 transition-transform" />
            </a>
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-8 flex items-center justify-center md:justify-start gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-amber-warm text-base">★★★★★</span>
              <span className="font-semibold text-ink">5.0</span>
            </div>
            <div className="w-px h-4 bg-ink/15" />
            <div>{t.hero.trust}</div>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:block">
        <div className="scroll-cue relative w-6 h-10 border border-ink/30 rounded-full" />
      </div>
    </section>
  );
}
