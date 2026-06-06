import { Star, Quote } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";

export function Testimonials() {
  const { t } = useLang();
  return (
    <section className="py-20 sm:py-28 md:py-32 px-5 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <Reveal className="max-w-2xl mb-12 sm:mb-16">
          <span className="font-mono text-gold text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-3 block">— Testimonials</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-balance">{t.testimonials.title}</h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {t.testimonials.items.map((c, i) => (
            <Reveal key={c.name} delay={i * 120}>
              <figure className="relative h-full bg-charcoal/40 border border-white/5 hover:border-gold/30 p-7 sm:p-8 rounded-sm transition-all hover:-translate-y-1">
                <Quote className="absolute top-5 ltr:right-5 rtl:left-5 size-8 text-gold/20" />
                <div className="flex gap-0.5 text-gold mb-4">
                  {[...Array(5)].map((_, k) => (
                    <Star key={k} className="size-3.5 fill-gold" />
                  ))}
                </div>
                <blockquote className="text-stone-200 leading-relaxed mb-6 text-base sm:text-lg">
                  “{c.quote}”
                </blockquote>
                <figcaption className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="size-10 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 ring-1 ring-gold/20 flex items-center justify-center text-gold font-bold">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{c.name}</div>
                    <div className="text-xs text-stone-500">{c.role}</div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
