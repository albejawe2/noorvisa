import { useLang } from "./LanguageProvider";

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="py-10 sm:py-12 border-t border-white/5 px-5 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-stone-500 text-xs sm:text-sm font-mono text-center md:text-start">
          {t.footer.rights}
        </div>
        <div className="flex gap-6 sm:gap-8 text-stone-400 text-[11px] sm:text-xs font-mono uppercase tracking-widest">
          <a href="#" className="hover:text-gold transition-colors">{t.footer.privacy}</a>
          <a href="#" className="hover:text-gold transition-colors">{t.footer.terms}</a>
          <a href="#contact" className="hover:text-gold transition-colors">{t.footer.contact}</a>
        </div>
      </div>
    </footer>
  );
}
