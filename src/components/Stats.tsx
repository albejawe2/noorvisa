import { useLang } from "./LanguageProvider";
import { Counter } from "./Counter";
import { Reveal } from "./Reveal";

export function Stats() {
  const { t } = useLang();
  return (
    <section className="py-16 sm:py-20 border-y border-white/5 bg-charcoal/40">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
        {t.stats.items.map((s, i) => (
          <Reveal key={s.label} delay={i * 100} className="text-center">
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-gold font-mono">
              <Counter value={s.value} suffix={s.suffix} />
            </div>
            <div className="text-stone-500 text-xs sm:text-sm tracking-wide">{s.label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
