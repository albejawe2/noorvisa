"use client";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "./LanguageProvider";
import { LangToggle } from "./LangToggle";

const CONTACT = "tel:+962782727279";

export function Nav() {
  const { t } = useLang();
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
    { href: "#tools", label: t.nav.tools },
    { href: "#why", label: t.nav.why },
    { href: "#faq", label: t.nav.faq },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-3 sm:top-4 inset-x-3 sm:inset-x-6 z-50 rounded-full transition-all duration-500 ${
          scrolled ? "bg-white/85 backdrop-blur-xl shadow-md border border-ink/5" : "bg-white/40 backdrop-blur"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2">
            <div className="size-7 sm:size-8 rounded-full bg-sunset shadow-[var(--shadow-soft)]" />
            <span className="text-base sm:text-lg font-display font-bold tracking-tight">
              Noor<span className="text-sunset italic">Visa</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-ink/80">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-ember transition-colors">
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LangToggle />
            <a
              href={CONTACT}
              className="hidden sm:inline-flex bg-ink text-ivory hover:bg-sunset hover:text-white px-4 py-2 text-xs sm:text-sm font-bold rounded-full transition-all active:scale-95"
            >
              {t.nav.cta}
            </a>
            <button
              onClick={() => setOpen(true)}
              aria-label={t.menuOpen}
              className="md:hidden size-9 -mr-1 grid place-items-center text-ink"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] md:hidden bg-warm-gradient"
          >
            <div className="relative h-full flex flex-col px-6 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-lg font-display font-bold">
                  Noor<span className="text-sunset italic">Visa</span>
                </span>
                <button onClick={() => setOpen(false)} aria-label={t.menuClose} className="size-9 grid place-items-center">
                  <X className="size-5" />
                </button>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-1 -mt-12">
                {links.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    className="text-4xl font-display font-bold py-4 border-b border-ink/10 hover:text-ember transition-colors"
                  >
                    {l.label}
                  </motion.a>
                ))}
                <motion.a
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  href={CONTACT}
                  onClick={() => setOpen(false)}
                  className="mt-8 bg-sunset text-white text-center px-6 py-4 text-lg font-bold rounded-full shadow-[var(--shadow-soft)]"
                >
                  {t.nav.cta}
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
