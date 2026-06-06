"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useLang } from "./LanguageProvider";

export function FAQ() {
  const { t } = useLang();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-20 sm:py-32 px-5 sm:px-8 bg-ivory">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-ember mb-3">
            — FAQ
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-balance">{t.faq.title}</h2>
          <p className="mt-3 text-muted-foreground">{t.faq.desc}</p>
        </motion.div>

        <div className="space-y-3">
          {t.faq.items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-ink/8 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-start px-5 sm:px-7 py-5 flex items-center justify-between gap-4 hover:bg-cream/40 transition-colors"
              >
                <span className="font-display font-bold text-base sm:text-lg flex-1">{it.q}</span>
                <motion.div
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0 size-9 rounded-full bg-sunset flex items-center justify-center text-white"
                >
                  <Plus className="size-4" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 sm:px-7 pb-6 text-muted-foreground leading-relaxed">{it.a}</div>
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
