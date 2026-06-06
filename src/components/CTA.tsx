import { MessageCircle } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";

const WHATSAPP = "https://wa.me/962782727279";

export function CTA() {
  const { t } = useLang();
  return (
    <section id="contact" className="py-20 sm:py-28 md:py-32 px-5 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="relative overflow-hidden border border-gold/20 p-8 sm:p-12 md:p-16 lg:p-20 text-center bg-[radial-gradient(circle_at_top,#1c1810_0%,#0a0a0a_70%)] rounded-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.08),transparent_60%)]" />
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 sm:mb-6 text-balance">
                {t.cta.title}
              </h2>
              <p className="text-stone-400 mb-8 sm:mb-10 text-base sm:text-lg max-w-2xl mx-auto text-pretty">
                {t.cta.desc}
              </p>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-3 bg-gold text-onyx px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-xl font-black rounded-sm hover:scale-105 transition-transform shadow-2xl shadow-gold/30 shimmer-gold"
              >
                <MessageCircle className="size-5 sm:size-6" />
                {t.cta.button}
              </a>
              <div className="mt-6 text-xs sm:text-sm text-stone-500 font-mono tracking-wide">
                ⚡ {t.cta.note}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
