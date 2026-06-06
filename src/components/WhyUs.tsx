import { Award, Globe, Zap, ShieldCheck } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";

const ICONS = [Award, Globe, Zap, ShieldCheck];

export function WhyUs() {
  const { t } = useLang();
  return (
    <section id="why" className="py-20 sm:py-28 md:py-32 px-5 sm:px-6 bg-charcoal/30 border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <Reveal className="max-w-2xl mb-12 sm:mb-16">
          <span className="font-mono text-gold text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-3 block">— {t.nav.why}</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance">{t.why.title}</h2>
          <p className="text-stone-500 text-base sm:text-lg text-pretty">{t.why.desc}</p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {t.why.items.map((w, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal key={w.title} delay={i * 90}>
                <div className="bg-onyx/60 backdrop-blur-sm border border-white/5 hover:border-gold/40 p-7 sm:p-8 rounded-sm h-full transition-all hover:-translate-y-1 group">
                  <div className="text-gold mb-5">
                    <Icon className="size-7 sm:size-8 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{w.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{w.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
