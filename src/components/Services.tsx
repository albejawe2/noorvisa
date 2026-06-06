"use client";
import { motion } from "framer-motion";
import { useLang } from "./LanguageProvider";
import { Plane, GraduationCap, HeartPulse, Briefcase, Globe2, FileCheck, Bell, CalendarCheck } from "lucide-react";

const ICONS = [Plane, GraduationCap, HeartPulse, Briefcase, Globe2, FileCheck, Bell, CalendarCheck];

export function Services() {
  const { t } = useLang();
  return (
    <section id="services" className="relative py-20 sm:py-32 px-5 sm:px-8 bg-cream">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <span className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-ember mb-3">
            — {t.services.kicker}
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold text-balance leading-tight">
            {t.services.title}
          </h2>
          <p className="mt-4 sm:mt-5 text-base sm:text-lg text-muted-foreground text-pretty">
            {t.services.desc}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {t.services.items.map((s, i) => {
            const Icon = ICONS[i % ICONS.length];
            const highlight = i === 0 || i === 4;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className={`group relative rounded-3xl p-5 sm:p-6 border transition-all ${
                  highlight
                    ? "bg-ink text-ivory border-ink hover:bg-sunset hover:border-transparent"
                    : "bg-white border-ink/8 hover:border-ember/40 hover:-translate-y-1 shadow-sm"
                }`}
              >
                <div
                  className={`size-11 sm:size-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                    highlight ? "bg-ivory/15 text-ivory" : "bg-ember/10 text-ember group-hover:bg-ember group-hover:text-white"
                  }`}
                >
                  <Icon className="size-5 sm:size-6" strokeWidth={1.8} />
                </div>
                <h3 className="font-display font-bold text-lg sm:text-xl mb-1.5">{s.title}</h3>
                <p className={`text-sm leading-relaxed ${highlight ? "text-ivory/70" : "text-muted-foreground"}`}>
                  {s.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
