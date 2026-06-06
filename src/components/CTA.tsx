"use client";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { Aurora } from "./Aurora";
import { MagneticLink } from "./MagneticButton";

const WHATSAPP = "https://wa.me/962782727279";
const ease = [0.22, 1, 0.36, 1] as const;

export function CTA() {
  const { t } = useLang();
  return (
    <section id="contact" className="relative py-24 sm:py-32 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.9, ease }}
        className="relative max-w-6xl mx-auto rounded-[2.5rem] sm:rounded-[3rem] glass-strong p-8 sm:p-16 overflow-hidden grad-border"
      >
        <Aurora />

        <div className="relative text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-7xl font-display font-bold text-balance leading-[1]"
          >
            {t.cta.title.split(" ").map((word, i, arr) => (
              <span key={i}>
                {i === arr.length - 1 ? <span className="text-electric">{word}</span> : word}{" "}
              </span>
            ))}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-5 sm:mt-7 text-base sm:text-xl text-mist max-w-xl mx-auto text-pretty"
          >
            {t.cta.desc}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-8 sm:mt-10 flex flex-col items-center gap-4"
          >
            <MagneticLink
              href={WHATSAPP} target="_blank" rel="noopener"
              className="group bg-electric text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg inline-flex items-center gap-3 hover:shadow-[var(--shadow-violet)] active:scale-95 transition-shadow relative overflow-hidden shadow-[var(--shadow-glow)]"
            >
              <span className="absolute inset-0 shimmer-electric opacity-0 group-hover:opacity-100 transition-opacity" />
              <MessageCircle className="size-5 relative" />
              <span className="relative">{t.cta.button}</span>
              <ArrowRight className="size-5 relative group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 transition-transform" />
            </MagneticLink>
            <span className="text-sm text-mist font-mono">{t.cta.note}</span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
