"use client";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { TiltCard } from "./TiltCard";

const ease = [0.22, 1, 0.36, 1] as const;

export function Testimonials() {
  const { t } = useLang();
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-violet-glow mb-4">
            <Star className="size-3 fill-violet-glow" />
            {t.testimonials.title}
          </span>
          <h2 className="text-4xl sm:text-6xl font-display font-bold text-balance">
            {t.testimonials.title}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-3 sm:gap-4">
          {t.testimonials.items.map((tm, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease }}
              className={i === 1 ? "md:-translate-y-6" : ""}
            >
              <TiltCard intensity={5} className={`h-full rounded-[1.75rem] p-7 sm:p-8 relative overflow-hidden ${
                i === 1 ? "bg-electric text-white" : "glass-strong grad-border"
              }`}>
                {i === 1 && <div className="absolute inset-0 noise" />}
                <Quote className={`relative size-8 mb-5 ${i === 1 ? "text-white/70" : "text-violet-glow"}`} />
                <div className="relative flex gap-0.5 mb-4 text-amber-300">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="size-4 fill-current" />
                  ))}
                </div>
                <blockquote className="relative text-base sm:text-lg leading-relaxed mb-6 text-pretty">
                  {tm.quote}
                </blockquote>
                <figcaption className="relative flex items-center gap-3">
                  <div className={`size-11 rounded-full grid place-items-center font-display font-bold text-lg ${
                    i === 1 ? "bg-white/20 text-white" : "bg-electric text-white"
                  }`}>
                    {tm.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold">{tm.name}</div>
                    <div className={`text-xs ${i === 1 ? "text-white/70" : "text-mist"}`}>{tm.role}</div>
                  </div>
                </figcaption>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
