import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { LangToggle } from "./LangToggle";

const WHATSAPP = "https://wa.me/962782727279";

export function Nav() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const links = [
    { href: "#services", label: t.nav.services },
    { href: "#why", label: t.nav.why },
    { href: "#faq", label: t.nav.faq },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-onyx/85 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2">
            <span className={`text-lg sm:text-xl font-bold tracking-tight ${lang === "ar" ? "font-arabic" : "font-sans"}`}>
              NOOR <span className="text-gold">VISA</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-300">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-gold transition-colors relative group">
                {l.label}
                <span className="absolute -bottom-1 inset-x-0 h-px bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LangToggle />
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener"
              className="hidden sm:inline-flex bg-gold text-onyx px-4 py-2 text-xs sm:text-sm font-bold rounded-sm hover:bg-gold-bright transition-all active:scale-95"
            >
              {t.nav.cta}
            </a>
            <button
              onClick={() => setOpen(true)}
              aria-label={t.menuOpen}
              className="md:hidden p-2 -mx-2 text-stone-200 hover:text-gold transition-colors"
            >
              <Menu className="size-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-[60] md:hidden transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-onyx/95 backdrop-blur-xl" onClick={() => setOpen(false)} />
        <div className="relative h-full flex flex-col px-6 pt-6">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold tracking-tight">
              NOOR <span className="text-gold">VISA</span>
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label={t.menuClose}
              className="p-2 -mx-2 text-stone-200 hover:text-gold transition-colors"
            >
              <X className="size-6" />
            </button>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-2 -mt-12">
            {links.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-3xl font-bold py-3 border-b border-white/5 hover:text-gold transition-colors"
                style={{
                  animation: open ? `fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) both` : undefined,
                  animationDelay: `${100 + i * 70}ms`,
                }}
              >
                {l.label}
              </a>
            ))}
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener"
              onClick={() => setOpen(false)}
              className="mt-8 bg-gold text-onyx text-center px-6 py-4 text-lg font-bold rounded-sm shimmer-gold"
              style={{ animation: open ? "fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) both" : undefined, animationDelay: "420ms" }}
            >
              {t.nav.cta}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
