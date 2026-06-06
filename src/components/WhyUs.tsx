"use client";
import { motion } from "framer-motion";
import { Award, Globe, Clock, Shield } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { TiltCard } from "./TiltCard";

const ICONS = [Award, Globe, Clock, Shield];
const ease = [0.22, 1, 0.36, 1] as const;

export function WhyUs() {
  const { t } = useLang();
  return (
    <section id="why" className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-50 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }}
          className="max-w-2xl mb-12 sm:mb-16"
        >
          <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-violet-glow mb-4">
            <span className="size-1.5 rounded-full bg-violet-glow" />
            {t.why.kicker}
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-bold text-balance leading-[1]">
            {t.why.title}
          </h2>
          <p className="mt-5 text-base sm:text-lg text-mist text-pretty">{t.why.desc}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {t.why.items.map((it, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: i * 0.08, ease }}
              >
                <TiltCard intensity={6} className="h-full glass-strong rounded-[1.75rem] p-6 sm:p-7 grad-border relative overflow-hidden">
                  <div className="relative flex flex-col h-full gap-5">
                    <div className="size-14 rounded-2xl bg-electric grid place-items-center text-white shadow-[var(--shadow-glow)]">
                      <Icon className="size-6" strokeWidth={1.8} />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-violet-glow mb-1">0{i + 1}</div>
                      <h3 className="font-display font-bold text-xl sm:text-2xl mb-1.5">{it.title}</h3>
                      <p className="text-sm text-mist leading-relaxed">{it.desc}</p>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
