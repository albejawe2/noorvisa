"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLang } from "./LanguageProvider";

export function Marquee() {
  const { lang } = useLang();
  const items = lang === "ar"
    ? ["شنغن", "كندا", "أمريكا", "بريطانيا", "أستراليا", "ألمانيا", "اليابان", "الإمارات", "تركيا", "ماليزيا"]
    : ["Schengen", "Canada", "USA", "UK", "Australia", "Germany", "Japan", "UAE", "Türkiye", "Malaysia"];
  const loop = [...items, ...items];

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <section ref={ref} className="relative py-8 sm:py-12 bg-ink text-ivory overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-ink to-transparent" />
      <div className="absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-l from-ink to-transparent" />
      <motion.div style={{ x }} className="flex marquee-track whitespace-nowrap gap-10 sm:gap-14">
        {loop.map((c, i) => (
          <div key={i} className="flex items-center gap-10 sm:gap-14">
            <span className="text-2xl sm:text-4xl font-display italic opacity-90">{c}</span>
            <span className="size-1.5 rounded-full bg-ember shrink-0" />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
