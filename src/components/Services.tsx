import { Plane, GraduationCap, HeartPulse, Briefcase, Globe2, FileCheck2, ClipboardList, CalendarCheck } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";

const ICONS = [Plane, GraduationCap, HeartPulse, Briefcase, Globe2, FileCheck2, ClipboardList, CalendarCheck];

export function Services() {
  const { t } = useLang();
  return (
    <section id="services" className="py-20 sm:py-28 md:py-32 px-5 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="md:flex justify-between items-end mb-12 sm:mb-16 gap-12">
          <Reveal className="max-w-2xl">
            <span className="font-mono text-gold text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-3 block">— {t.nav.services}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance">{t.services.title}</h2>
            <p className="text-stone-500 text-base sm:text-lg text-pretty">{t.services.desc}</p>
          </Reveal>
          <div className="hidden md:block h-px bg-gradient-to-l from-gold/40 to-transparent flex-grow mt-8" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5 rounded-sm overflow-hidden">
          {t.services.items.map((s, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal key={s.title} delay={i * 70} className="contents">
                <div className="bg-onyx p-7 sm:p-8 hover:bg-charcoal transition-colors group relative">
                  <div className="size-12 border border-gold/30 rounded-full flex items-center justify-center mb-5 sm:mb-6 text-gold group-hover:bg-gold group-hover:text-onyx group-hover:rotate-[360deg] transition-all duration-500">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 group-hover:text-gold transition-colors">{s.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{s.desc}</p>
                  <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
