import { useLang } from "./LanguageProvider";

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="relative bg-ink text-ivory px-5 sm:px-8 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
          <div>
            <a href="#top" className="inline-flex items-center gap-2 mb-3">
              <div className="size-8 rounded-full bg-sunset" />
              <span className="text-2xl font-display font-bold">
                Noor<span className="text-sunset italic">Visa</span>
              </span>
            </a>
            <p className="text-ivory/60 max-w-sm text-sm">{t.footer.tagline}</p>
          </div>
          <div className="flex gap-6 text-sm text-ivory/70">
            <a href="#services" className="hover:text-ember transition-colors">{t.nav.services}</a>
            <a href="#why" className="hover:text-ember transition-colors">{t.nav.why}</a>
            <a href="#faq" className="hover:text-ember transition-colors">{t.nav.faq}</a>
            <a href="#contact" className="hover:text-ember transition-colors">{t.nav.contact}</a>
          </div>
        </div>
        <div className="border-t border-ivory/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-ivory/50">
          <span>{t.footer.rights}</span>
          <span>Crafted with care · NoorVisa</span>
        </div>
      </div>
    </footer>
  );
}
