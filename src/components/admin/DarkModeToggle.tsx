import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const KEY = "noorvisa-admin-theme";

export function useAdminTheme() {
  useEffect(() => {
    const t = localStorage.getItem(KEY) || "light";
    document.documentElement.classList.toggle("dark", t === "dark");
    return () => document.documentElement.classList.remove("dark");
  }, []);
}

export default function DarkModeToggle() {
  const [dark, setDark] = useState(() => typeof window !== "undefined" && localStorage.getItem(KEY) === "dark");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(KEY, dark ? "dark" : "light");
  }, [dark]);
  return (
    <button onClick={() => setDark(!dark)} className="p-2 rounded-lg hover:bg-[#f5efe4] dark:hover:bg-[#1a0f08]" aria-label="تبديل الوضع">
      {dark ? <Sun className="size-5 text-[#d4af37]" /> : <Moon className="size-5 text-[#2a1a0f]" />}
    </button>
  );
}
