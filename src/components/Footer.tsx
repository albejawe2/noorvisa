import { useLang } from "./LanguageProvider";

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="relative border-t border-white/5 px-4 sm:px-6 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
          <div>
            <a href="#top" className="inline-flex items-center gap-2.5 mb-3">
              <div className="size-8 rounded-full bg-electric shadow-[var(--shadow-glow)]" />
              <span className="text-2xl font-display font-bold text-pearl">
                نور <span className="text-electric italic">فيزا</span>
              </span>
            </a>
            <p className="text-mist max-w-sm text-sm">{t.footer.tagline}</p>
          </div>
          <div className="flex gap-6 text-sm text-mist">
            <a href="#services" className="hover:text-violet-glow transition-colors">{t.nav.services}</a>
            <a href="#why" className="hover:text-violet-glow transition-colors">{t.nav.why}</a>
            <a href="#faq" className="hover:text-violet-glow transition-colors">{t.nav.faq}</a>
            <a href="#contact" className="hover:text-violet-glow transition-colors">{t.nav.contact}</a>
          </div>
        </div>
        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-mist font-mono">
          <span>{t.footer.rights}</span>
          <span>Crafted with care · نور فيزا</span>
        </div>
      </div>
    </footer>
  );
}
