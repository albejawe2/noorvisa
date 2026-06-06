"use client";
import { motion } from "framer-motion";
import { Award, Globe, Clock, Shield } from "lucide-react";
import { useLang } from "./LanguageProvider";

const ICONS = [Award, Globe, Clock, Shield];

export function WhyUs() {
  const { t } = useLang();
  return (
    <section id="why" className="relative py-20 sm:py-32 px-5 sm:px-8 bg-ivory overflow-hidden">
      <div className="absolute -right-40 top-1/3 size-96 rounded-full bg-ember/10 blur-3xl pointer-events-none" />
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mb-12 sm:mb-16 text-center md:text-start mx-auto md:mx-0"
        >
          <span className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-ember mb-3">
            — {t.why.kicker}
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold text-balance leading-tight">
            {t.why.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-pretty">{t.why.desc}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {t.why.items.map((it, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group bg-white rounded-3xl p-6 sm:p-8 border border-ink/5 hover:border-ember/30 hover:shadow-[var(--shadow-card)] transition-all flex gap-5"
              >
                <div className="shrink-0">
                  <div className="size-14 rounded-2xl bg-sunset flex items-center justify-center text-white shadow-[var(--shadow-soft)]">
                    <Icon className="size-6" strokeWidth={1.8} />
                  </div>
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl mb-1.5">{it.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{it.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
