"use client";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useLang } from "./LanguageProvider";

const WHATSAPP = "https://wa.me/962782727279";

export function WhatsAppFab() {
  const { t } = useLang();
  return (
    <motion.a
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 200, damping: 18 }}
      href={WHATSAPP}
      target="_blank"
      rel="noopener"
      aria-label={t.fab}
      className="fixed bottom-5 ltr:right-5 rtl:left-5 z-40 group"
    >
      <span className="absolute inset-0 rounded-full bg-ember pulse-ring" />
      <span className="relative flex items-center gap-2 bg-ink text-ivory rounded-full pl-4 pr-5 py-3.5 sm:py-4 shadow-[var(--shadow-card)] hover:bg-sunset hover:text-white transition-colors">
        <MessageCircle className="size-5 sm:size-6" />
        <span className="hidden sm:inline text-sm font-bold">{t.fab}</span>
      </span>
    </motion.a>
  );
}
