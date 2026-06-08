"use client";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Coins, Globe2, Search, Loader2, CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { useLang } from "./LanguageProvider";

type Country = {
  cca2: string;
  name: { common: string };
  translations?: Record<string, { common?: string }>;
  capital?: string[];
  population?: number;
  region?: string;
  languages?: Record<string, string>;
  currencies?: Record<string, { name: string; symbol?: string }>;
  timezones?: string[];
  idd?: { root?: string; suffixes?: string[] };
  latlng?: [number, number];
  capitalInfo?: { latlng?: [number, number] };
  flag?: string;
};

const VISA_STATUS_KEY: Record<string, "free" | "eta" | "evisa" | "required" | "covid" | "refused" | "unknown"> = {
  "visa free": "free",
  "visa-free": "free",
  "visa on arrival": "eta",
  "e-visa": "evisa",
  "evisa": "evisa",
  "visa required": "required",
  "covid ban": "covid",
  "no admission": "refused",
};

function parseVisaCell(raw: string): { status: "free" | "eta" | "evisa" | "required" | "covid" | "refused" | "unknown"; days?: number } {
  if (!raw) return { status: "unknown" };
  const v = raw.trim().toLowerCase();
  if (/^\d+$/.test(v)) return { status: "free", days: parseInt(v, 10) };
  if (v === "visa free" || v === "visa-free") return { status: "free" };
  if (v === "visa on arrival") return { status: "eta" };
  if (v === "e-visa" || v === "evisa") return { status: "evisa" };
  if (v === "visa required") return { status: "required" };
  if (v === "covid ban") return { status: "covid" };
  if (v === "no admission") return { status: "refused" };
  if (v === "-1" || v === "-1 ") return { status: "unknown" };
  return VISA_STATUS_KEY[v] ? { status: VISA_STATUS_KEY[v] } : { status: "unknown" };
}

// Cache promises
let countriesPromise: Promise<Country[]> | null = null;
function fetchCountries(): Promise<Country[]> {
  if (!countriesPromise) {
    countriesPromise = fetch("https://restcountries.com/v3.1/all?fields=cca2,name,translations,capital,population,region,languages,currencies,timezones,idd,flag,capitalInfo")
      .then((r) => {
        if (!r.ok) throw new Error("countries fetch failed " + r.status);
        return r.json();
      })
      .then((arr: Country[]) => arr.sort((a, b) => a.name.common.localeCompare(b.name.common)))
      .catch((e) => { countriesPromise = null; throw e; });
  }
  return countriesPromise;
}

let visaMatrixPromise: Promise<Record<string, Record<string, string>>> | null = null;
function fetchVisaMatrix(): Promise<Record<string, Record<string, string>>> {
  if (!visaMatrixPromise) {
    visaMatrixPromise = fetch("https://raw.githubusercontent.com/ilyankou/passport-index-dataset/master/passport-index-matrix-iso2.csv")
      .then((r) => r.text())
      .then((csv) => {
        const lines = csv.trim().split("\n");
        const header = lines[0].split(",").map((s) => s.trim());
        const matrix: Record<string, Record<string, string>> = {};
        for (let i = 1; i < lines.length; i++) {
          const cells = lines[i].split(",");
          const passport = cells[0].trim().toUpperCase();
          matrix[passport] = {};
          for (let j = 1; j < header.length; j++) {
            matrix[passport][header[j].toUpperCase()] = (cells[j] ?? "").trim();
          }
        }
        return matrix;
      });
  }
  return visaMatrixPromise;
}

function countryLabel(c: Country, lang: "ar" | "en"): string {
  if (lang === "ar") {
    const ara = c.translations?.["ara"]?.common;
    if (ara) return ara;
  }
  return c.name.common;
}

export function TravelHub() {
  const { t } = useLang();
  const [tab, setTab] = useState<"visa" | "currency" | "country">("visa");
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    fetchCountries().then(setCountries).catch(() => setCountries([]));
  }, []);

  const tabs = [
    { id: "visa" as const, label: t.tools.tabs.visa, icon: Plane },
    { id: "currency" as const, label: t.tools.tabs.currency, icon: Coins },
    { id: "country" as const, label: t.tools.tabs.country, icon: Globe2 },
  ];

  return (
    <section id="tools" className="relative py-20 sm:py-32 px-5 sm:px-8 bg-ivory overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-cream to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-14"
        >
          <span className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-ember mb-3">
            — {t.tools.kicker}
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold text-balance leading-tight">
            {t.tools.title}
          </h2>
          <p className="mt-4 sm:mt-5 text-base sm:text-lg text-muted-foreground text-pretty">
            {t.tools.desc}
          </p>
        </motion.div>

        {/* Tab bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tb) => {
            const Icon = tb.icon;
            const active = tab === tb.id;
            return (
              <button
                key={tb.id}
                onClick={() => setTab(tb.id)}
                className={`group inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  active ? "bg-ink text-ivory shadow-[var(--shadow-soft)]" : "bg-white border border-ink/10 text-ink/70 hover:border-ember/40 hover:text-ink"
                }`}
              >
                <Icon className="size-4" />
                {tb.label}
              </button>
            );
          })}
        </div>

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl border border-ink/8 shadow-[var(--shadow-card)] p-5 sm:p-8 min-h-[440px]"
        >
          {tab === "visa" && <VisaPanel countries={countries} />}
          {tab === "currency" && <CurrencyPanel countries={countries} />}
          {tab === "country" && <CountryPanel countries={countries} />}
          
        </motion.div>

        <p className="mt-5 text-center text-xs text-muted-foreground">{t.tools.powered}</p>
      </div>
    </section>
  );
}

/* ---------------- Visa Panel ---------------- */
function VisaPanel({ countries }: { countries: Country[] }) {
  const { t, lang } = useLang();
  const [passport, setPassport] = useState("IQ");
  const [destination, setDestination] = useState("TR");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ status: ReturnType<typeof parseVisaCell>["status"]; days?: number } | null>(null);

  const check = async () => {
    setLoading(true);
    setResult(null);
    try {
      const matrix = await fetchVisaMatrix();
      const raw = matrix[passport.toUpperCase()]?.[destination.toUpperCase()] ?? "";
      setResult(parseVisaCell(raw));
    } catch {
      setResult({ status: "unknown" });
    }
    setLoading(false);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      <div>
        <h3 className="text-2xl sm:text-3xl font-display font-bold mb-2">{t.tools.visa.title}</h3>
        <p className="text-sm text-muted-foreground mb-6">{t.tools.visa.desc}</p>

        <div className="space-y-4">
          <CountrySelect label={t.tools.visa.passport} value={passport} onChange={setPassport} countries={countries} />
          <CountrySelect label={t.tools.visa.destination} value={destination} onChange={setDestination} countries={countries} />
          <button
            onClick={check}
            disabled={loading || !passport || !destination}
            className="w-full bg-sunset text-white py-3.5 rounded-2xl font-bold inline-flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-transform disabled:opacity-60"
          >
            {loading ? <Loader2 className="size-5 animate-spin" /> : <Search className="size-5" />}
            {loading ? t.tools.visa.loading : t.tools.visa.check}
          </button>
        </div>
      </div>

      <div className="lg:pl-6 ltr:lg:border-l rtl:lg:border-r border-ink/5">
        <AnimatePresence mode="wait">
          {!result && !loading && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full grid place-items-center text-center py-12">
              <div>
                <div className="size-20 mx-auto rounded-full bg-cream grid place-items-center mb-4">
                  <Plane className="size-9 text-ember" />
                </div>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">{t.tools.visa.desc}</p>
              </div>
            </motion.div>
          )}
          {result && (
            <motion.div key={result.status} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-cream/60">
              <VisaResultCard status={result.status} days={result.days} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function VisaResultCard({ status, days }: { status: ReturnType<typeof parseVisaCell>["status"]; days?: number }) {
  const { t } = useLang();
  const cfg = {
    free: { icon: CheckCircle2, color: "text-emerald-deep", bg: "bg-emerald-deep/10" },
    eta: { icon: CheckCircle2, color: "text-amber-warm", bg: "bg-amber-warm/15" },
    evisa: { icon: Info, color: "text-ember", bg: "bg-ember/10" },
    required: { icon: AlertTriangle, color: "text-rose-deep", bg: "bg-rose-deep/10" },
    covid: { icon: AlertTriangle, color: "text-amber-warm", bg: "bg-amber-warm/15" },
    refused: { icon: XCircle, color: "text-rose-deep", bg: "bg-rose-deep/10" },
    unknown: { icon: Info, color: "text-ink/60", bg: "bg-ink/5" },
  }[status];
  const Icon = cfg.icon;

  return (
    <div>
      <div className={`size-16 rounded-2xl grid place-items-center ${cfg.bg} mb-4`}>
        <Icon className={`size-8 ${cfg.color}`} strokeWidth={2} />
      </div>
      <h4 className="text-2xl font-display font-bold mb-1">{t.tools.visa.result[status]}</h4>
      {days !== undefined && (
        <div className="text-sm font-semibold text-ember mb-2">
          {days} {t.tools.visa.detail.days}
        </div>
      )}
      <p className="text-sm text-muted-foreground leading-relaxed">
        {status === "unknown" ? t.tools.visa.noData : t.tools.visa.detail[status]}
      </p>
    </div>
  );
}

function CountrySelect({ label, value, onChange, countries }: { label: string; value: string; onChange: (v: string) => void; countries: Country[] }) {
  const { lang } = useLang();
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-cream/60 border border-ink/10 rounded-2xl px-4 py-3 text-sm font-medium text-ink focus:outline-none focus:ring-2 focus:ring-ember"
      >
        {countries.length === 0 && <option>...</option>}
        {countries.map((c) => (
          <option key={c.cca2} value={c.cca2}>
            {c.flag ?? ""} {countryLabel(c, lang)}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ---------------- Currency Panel ---------------- */
function CurrencyPanel({ countries }: { countries: Country[] }) {
  const { t } = useLang();
  const currencies = useMemo(() => {
    const set = new Map<string, string>();
    countries.forEach((c) => {
      if (c.currencies) Object.entries(c.currencies).forEach(([code, info]) => set.set(code, info.name));
    });
    return Array.from(set.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [countries]);

  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [amount, setAmount] = useState("100");
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const convert = async () => {
    setLoading(true);
    setRate(null);
    try {
      const r = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`).then((x) => x.json());
      setRate(r.rates?.[to] ?? null);
    } catch {
      setRate(null);
    }
    setLoading(false);
  };

  useEffect(() => { convert(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const converted = rate !== null ? (parseFloat(amount || "0") * rate).toFixed(2) : null;

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      <div>
        <h3 className="text-2xl sm:text-3xl font-display font-bold mb-2">{t.tools.currency.title}</h3>
        <p className="text-sm text-muted-foreground mb-6">{t.tools.currency.desc}</p>
        <div className="space-y-4">
          <label className="block">
            <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{t.tools.currency.amount}</span>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-cream/60 border border-ink/10 rounded-2xl px-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-ember" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <CurrencySelect label={t.tools.currency.from} value={from} onChange={setFrom} options={currencies} />
            <CurrencySelect label={t.tools.currency.to} value={to} onChange={setTo} options={currencies} />
          </div>
          <button onClick={convert} disabled={loading} className="w-full bg-sunset text-white py-3.5 rounded-2xl font-bold inline-flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-transform disabled:opacity-60">
            {loading ? <Loader2 className="size-5 animate-spin" /> : <Coins className="size-5" />}
            {loading ? t.tools.currency.loading : t.tools.currency.convert}
          </button>
        </div>
      </div>
      <div className="lg:pl-6 ltr:lg:border-l rtl:lg:border-r border-ink/5">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-cream to-amber-warm/10 min-h-[280px] flex flex-col justify-center">
          {converted !== null && rate !== null ? (
            <>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{amount} {from} =</div>
              <div className="text-5xl sm:text-6xl font-display font-bold text-sunset leading-none break-all">
                {converted} <span className="text-2xl text-ink">{to}</span>
              </div>
              <div className="mt-5 text-sm text-muted-foreground">{t.tools.currency.rate}: <span className="font-bold text-ink">1 {from} = {rate.toFixed(4)} {to}</span></div>
            </>
          ) : (
            <div className="text-center text-muted-foreground">
              <Coins className="size-12 mx-auto mb-3 text-ember/50" />
              <p className="text-sm">{loading ? t.tools.currency.loading : "—"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CurrencySelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-cream/60 border border-ink/10 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ember">
        {options.length === 0 && <option>USD</option>}
        {options.map(([code, name]) => (
          <option key={code} value={code}>{code} — {name}</option>
        ))}
      </select>
    </label>
  );
}

/* ---------------- Country Panel ---------------- */
function CountryPanel({ countries }: { countries: Country[] }) {
  const { t, lang } = useLang();
  const [code, setCode] = useState("FR");
  const country = countries.find((c) => c.cca2 === code);

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      <div>
        <h3 className="text-2xl sm:text-3xl font-display font-bold mb-2">{t.tools.country.title}</h3>
        <p className="text-sm text-muted-foreground mb-6">{t.tools.country.desc}</p>
        <CountrySelect label={t.tools.country.select} value={code} onChange={setCode} countries={countries} />
      </div>
      <div className="lg:pl-6 ltr:lg:border-l rtl:lg:border-r border-ink/5">
        {country ? (
          <motion.div key={country.cca2} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-cream/60">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-5xl">{country.flag}</span>
              <div>
                <div className="text-2xl font-display font-bold">{countryLabel(country, lang)}</div>
                <div className="text-xs text-muted-foreground">{country.region}</div>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <Stat label={t.tools.country.capital} value={country.capital?.[0] ?? "—"} />
              <Stat label={t.tools.country.population} value={country.population?.toLocaleString(lang === "ar" ? "ar-EG" : "en-US") ?? "—"} />
              <Stat label={t.tools.country.languages} value={country.languages ? Object.values(country.languages).slice(0, 3).join(", ") : "—"} />
              <Stat label={t.tools.country.currencies} value={country.currencies ? Object.entries(country.currencies).map(([k, v]) => `${k} ${v.symbol ?? ""}`).join(", ") : "—"} />
              <Stat label={t.tools.country.timezone} value={country.timezones?.[0] ?? "—"} />
              <Stat label={t.tools.country.calling} value={country.idd?.root ? `${country.idd.root}${country.idd.suffixes?.[0] ?? ""}` : "—"} />
            </dl>
          </motion.div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">{t.tools.country.loading}</div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</dt>
      <dd className="font-bold text-ink mt-0.5 break-words">{value}</dd>
    </div>
  );
}

/* ---------------- Weather Panel ---------------- */
function WeatherPanel({ countries }: { countries: Country[] }) {
  const { t, lang } = useLang();
  const [code, setCode] = useState("FR");
  const country = countries.find((c) => c.cca2 === code);
  const [weather, setWeather] = useState<{ temperature: number; windspeed: number; weathercode: number; humidity?: number } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!country?.capitalInfo?.latlng) return;
    const [lat, lon] = country.capitalInfo.latlng;
    setLoading(true);
    setWeather(null);
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code`)
      .then((r) => r.json())
      .then((j) => {
        setWeather({
          temperature: j.current?.temperature_2m,
          windspeed: j.current?.wind_speed_10m,
          humidity: j.current?.relative_humidity_2m,
          weathercode: j.current?.weather_code,
        });
      })
      .catch(() => setWeather(null))
      .finally(() => setLoading(false));
  }, [country]);

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      <div>
        <h3 className="text-2xl sm:text-3xl font-display font-bold mb-2">{t.tools.weather.title}</h3>
        <p className="text-sm text-muted-foreground mb-6">{t.tools.weather.desc}</p>
        <CountrySelect label={t.tools.country.select} value={code} onChange={setCode} countries={countries} />
      </div>
      <div className="lg:pl-6 ltr:lg:border-l rtl:lg:border-r border-ink/5">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-50 to-cream min-h-[280px] flex flex-col justify-center">
          {loading && <div className="text-center text-muted-foreground"><Loader2 className="size-8 mx-auto animate-spin text-ember" /><p className="mt-2 text-sm">{t.tools.weather.loading}</p></div>}
          {!loading && weather && country && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{country.flag}</span>
                <div>
                  <div className="text-lg font-display font-bold">{country.capital?.[0]}</div>
                  <div className="text-xs text-muted-foreground">{countryLabel(country, lang)}</div>
                </div>
              </div>
              <div className="text-6xl sm:text-7xl font-display font-bold text-sunset leading-none">
                {Math.round(weather.temperature)}°
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <Stat label={t.tools.weather.wind} value={`${Math.round(weather.windspeed)} km/h`} />
                <Stat label={t.tools.weather.humidity} value={`${weather.humidity ?? "—"}%`} />
              </div>
            </>
          )}
          {!loading && !weather && <div className="text-center text-muted-foreground text-sm">—</div>}
        </div>
      </div>
    </div>
  );
}
