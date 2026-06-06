"use client";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useLang } from "./LanguageProvider";

export function Testimonials() {
  const { t } = useLang();
  return (
    <section className="relative py-20 sm:py-32 px-5 sm:px-8 bg-cream">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-3xl sm:text-5xl md:text-6xl font-display font-bold text-center mb-12 sm:mb-16 text-balance"
        >
          {t.testimonials.title}
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
          {t.testimonials.items.map((tm, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`relative rounded-3xl p-6 sm:p-8 ${
                i === 1 ? "bg-ink text-ivory md:scale-105 shadow-[var(--shadow-card)]" : "bg-white border border-ink/5"
              }`}
            >
              <Quote className={`size-8 mb-4 ${i === 1 ? "text-ember" : "text-ember/70"}`} />
              <blockquote className="text-base sm:text-lg leading-relaxed mb-6 text-pretty">{tm.quote}</blockquote>
              <figcaption className="flex items-center gap-3">
                <div className={`size-11 rounded-full flex items-center justify-center font-display font-bold text-lg ${
                  i === 1 ? "bg-ember text-white" : "bg-sunset text-white"
                }`}>
                  {tm.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold">{tm.name}</div>
                  <div className={`text-xs ${i === 1 ? "text-ivory/60" : "text-muted-foreground"}`}>{tm.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
