"use client";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useLang } from "./LanguageProvider";

const WHATSAPP = "https://wa.me/962782727279";

export function CTA() {
  const { t } = useLang();
  return (
    <section id="contact" className="relative py-20 sm:py-32 px-5 sm:px-8 bg-ivory">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-5xl mx-auto rounded-[2rem] sm:rounded-[3rem] bg-sunset text-white p-8 sm:p-16 overflow-hidden shadow-[var(--shadow-card)]"
      >
        <div className="absolute -top-20 -right-20 size-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 size-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-3xl sm:text-5xl md:text-6xl font-display font-bold text-balance leading-tight"
          >
            {t.cta.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-4 sm:mt-6 text-base sm:text-xl text-white/85 max-w-xl mx-auto text-pretty"
          >
            {t.cta.desc}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-8 sm:mt-10 flex flex-col items-center gap-4"
          >
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener"
              className="bg-white text-ink px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg inline-flex items-center gap-2.5 hover:scale-[1.04] active:scale-95 transition-transform shadow-xl"
            >
              <MessageCircle className="size-5" />
              {t.cta.button}
            </a>
            <span className="text-sm text-white/80">{t.cta.note}</span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
