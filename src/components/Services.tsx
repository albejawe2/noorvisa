"use client";
import { motion } from "framer-motion";
import { useLang } from "./LanguageProvider";
import { TiltCard } from "./TiltCard";
import { Plane, GraduationCap, HeartPulse, Briefcase, Globe2, FileCheck, Bell, CalendarCheck, ArrowUpRight } from "lucide-react";

const ICONS = [Plane, GraduationCap, HeartPulse, Briefcase, Globe2, FileCheck, Bell, CalendarCheck];

// Bento layout — static classes so Tailwind v4 picks them up
const BENTO = [
  "col-span-2 md:col-span-3 md:row-span-2",
  "col-span-2 md:col-span-3 md:row-span-1",
  "col-span-1 md:col-span-2 md:row-span-1",
  "col-span-2 md:col-span-2 md:row-span-2",
  "col-span-1 md:col-span-2 md:row-span-1",
  "col-span-2 md:col-span-3 md:row-span-1",
  "col-span-2 md:col-span-3 md:row-span-1",
  "col-span-2 md:col-span-6 md:row-span-1",
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Services() {
  const { t } = useLang();
  return (
    <section id="services" className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
      {/* heading */}
      <div className="relative z-10 max-w-7xl mx-auto mb-12 sm:mb-16 grid md:grid-cols-2 gap-6 items-end">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-violet-glow mb-4">
            <span className="size-1.5 rounded-full bg-violet-glow" />
            {t.services.kicker}
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-bold text-balance leading-[1]">
            {t.services.title}
          </h2>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7, delay: 0.15 }}
          className="text-base sm:text-lg text-mist text-pretty md:max-w-md md:justify-self-end"
        >
          {t.services.desc}
        </motion.p>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-6 auto-rows-[minmax(140px,auto)] gap-3 sm:gap-4">
        {t.services.items.map((s, i) => {
          const Icon = ICONS[i % ICONS.length];
          const [cs, rs] = BENTO[i] ?? [3, 1];
          const featured = i === 0 || i === 3;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.07, ease }}
              className={`col-span-2 md:col-span-${cs} row-span-${rs}`}
              style={{ gridColumn: `span ${cs} / span ${cs}`, gridRow: `span ${rs} / span ${rs}` }}
            >
              <TiltCard
                intensity={6}
                className={`relative h-full w-full rounded-[1.75rem] p-5 sm:p-7 overflow-hidden group transition-colors ${
                  featured ? "bg-electric text-white" : "glass hover:bg-white/[0.07]"
                }`}
              >
                {featured && <div className="absolute inset-0 noise" />}
                <div className="relative flex flex-col h-full justify-between gap-6">
                  <div className={`size-12 rounded-2xl grid place-items-center ${
                    featured ? "bg-white/20" : "bg-violet-glow/15 text-violet-glow"
                  }`}>
                    <Icon className="size-5" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl sm:text-2xl mb-1.5">{s.title}</h3>
                    <p className={`text-sm leading-relaxed ${featured ? "text-white/85" : "text-mist"}`}>
                      {s.desc}
                    </p>
                  </div>
                  <ArrowUpRight className={`absolute top-0 ltr:right-0 rtl:left-0 size-5 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all ${
                    featured ? "text-white" : "text-violet-glow"
                  }`} />
                </div>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
