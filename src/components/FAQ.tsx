"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useLang } from "./LanguageProvider";

const ease = [0.22, 1, 0.36, 1] as const;

export function FAQ() {
  const { t } = useLang();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-3xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }}
          className="text-center mb-12 sm:mb-14"
        >
          <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-violet-glow mb-4">
            <span className="size-1.5 rounded-full bg-violet-glow" />
            FAQ
          </span>
          <h2 className="text-4xl sm:text-6xl font-display font-bold text-balance">{t.faq.title}</h2>
          <p className="mt-3 text-mist">{t.faq.desc}</p>
        </motion.div>

        <div className="space-y-3">
          {t.faq.items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.05, ease }}
              className="glass rounded-2xl overflow-hidden hover:bg-white/[0.06] transition-colors"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-start px-5 sm:px-7 py-5 flex items-center justify-between gap-4"
              >
                <span className="font-display font-bold text-base sm:text-lg flex-1 text-pearl">{it.q}</span>
                <motion.div
                  animate={{ rotate: open === i ? 45 : 0, scale: open === i ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0 size-9 rounded-full bg-electric grid place-items-center text-white shadow-[var(--shadow-glow)]"
                >
                  <Plus className="size-4" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 sm:px-7 pb-6 text-mist leading-relaxed">{it.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
