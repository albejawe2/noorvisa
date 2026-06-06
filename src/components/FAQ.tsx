import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";

export function FAQ() {
  const { t } = useLang();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 sm:py-28 md:py-32 px-5 sm:px-6 bg-charcoal/20 border-y border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20">
        <Reveal>
          <span className="font-mono text-gold text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-3 block">— FAQ</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance">{t.faq.title}</h2>
          <p className="text-stone-500 text-base sm:text-lg">{t.faq.desc}</p>
        </Reveal>

        <div className="divide-y divide-white/5 border-y border-white/5">
          {t.faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={i} delay={i * 60}>
                <div>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex justify-between items-center gap-4 py-5 sm:py-6 text-start group"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base sm:text-lg font-bold group-hover:text-gold transition-colors">
                      {item.q}
                    </span>
                    <span className={`shrink-0 size-8 rounded-full border flex items-center justify-center transition-all ${isOpen ? "bg-gold text-onyx border-gold" : "border-white/15 text-stone-300 group-hover:border-gold group-hover:text-gold"}`}>
                      {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                    </span>
                  </button>
                  <div
                    className="grid transition-all duration-500 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="text-stone-400 leading-relaxed pb-6 pe-12 text-sm sm:text-base">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
