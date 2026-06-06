"use client";
import { motion } from "framer-motion";
import { useLang } from "./LanguageProvider";
import { Counter } from "./Counter";

export function Stats() {
  const { t } = useLang();
  return (
    <section className="relative py-20 sm:py-28 px-5 sm:px-8 bg-ivory">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-3xl sm:text-5xl font-display font-bold text-center mb-12 sm:mb-16 text-balance"
        >
          {t.stats.title}
        </motion.h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {t.stats.items.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative bg-white rounded-3xl p-5 sm:p-8 border border-ink/5 hover:border-ember/40 hover:-translate-y-1 transition-all shadow-sm hover:shadow-[var(--shadow-card)]"
            >
              <div className="text-4xl sm:text-6xl font-display font-bold text-sunset leading-none">
                <Counter value={s.value} />
                <span>{s.suffix}</span>
              </div>
              <div className="mt-3 sm:mt-4 text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
