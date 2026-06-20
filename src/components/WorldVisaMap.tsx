"use client";
import { useEffect, useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import { Map as MapIcon, X, Plus, Minus, RotateCcw, CheckCircle2, Info, AlertTriangle, XCircle, Search } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { NUMERIC_TO_ISO2 } from "./isoCodes";

type VisaStatus = "free" | "eta" | "evisa" | "required" | "covid" | "refused" | "unknown";
type Country = { cca2: string; name: { common: string }; translations?: Record<string, { common?: string }>; flag?: string };

const TOPO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

function parseVisaCell(raw: string): { status: VisaStatus; days?: number } {
  if (!raw) return { status: "unknown" };
  const v = raw.trim().toLowerCase();
  if (/^\d+$/.test(v)) return { status: "free", days: parseInt(v, 10) };
  if (v === "visa free" || v === "visa-free") return { status: "free" };
  if (v === "visa on arrival") return { status: "eta" };
  if (v === "e-visa" || v === "evisa") return { status: "evisa" };
  if (v === "visa required") return { status: "required" };
  if (v === "covid ban") return { status: "covid" };
  if (v === "no admission") return { status: "refused" };
  return { status: "unknown" };
}

let countriesP: Promise<Country[]> | null = null;
function getCountries() {
  if (!countriesP) {
    countriesP = fetch("/api/public/countries?fields=cca2,name,translations,flag")
      .then((r) => r.json())
      .then((a: Country[]) => a.sort((x, y) => x.name.common.localeCompare(y.name.common)))
      .catch((e) => { countriesP = null; throw e; });
  }
  return countriesP;
}

let matrixP: Promise<Record<string, Record<string, string>>> | null = null;
function getMatrix() {
  if (!matrixP) {
    matrixP = fetch("https://raw.githubusercontent.com/ilyankou/passport-index-dataset/master/passport-index-matrix-iso2.csv")
      .then((r) => r.text())
      .then((csv) => {
        const lines = csv.trim().split("\n");
        const header = lines[0].split(",").map((s) => s.trim().toUpperCase());
        const m: Record<string, Record<string, string>> = {};
        for (let i = 1; i < lines.length; i++) {
          const c = lines[i].split(",");
          const p = c[0].trim().toUpperCase();
          m[p] = {};
          for (let j = 1; j < header.length; j++) m[p][header[j]] = (c[j] ?? "").trim();
        }
        return m;
      })
      .catch((e) => { matrixP = null; throw e; });
  }
  return matrixP;
}

const STATUS_COLOR: Record<VisaStatus, string> = {
  free: "#10b981",
  eta: "#f59e0b",
  evisa: "#3b82f6",
  required: "#ef4444",
  covid: "#a855f7",
  refused: "#7f1d1d",
  unknown: "#e5e7eb",
};

const TXT = {
  ar: {
    kicker: "خريطة العالم التفاعلية",
    title: "اضغط على أي دولة لترى متطلبات الفيزا فوراً",
    desc: "خريطة حرارية ملوّنة — اختر جنسية جواز سفرك وستتلوّن دول العالم حسب متطلبات الدخول.",
    passport: "جواز السفر",
    search: "ابحث عن دولة...",
    zoomIn: "تكبير",
    zoomOut: "تصغير",
    reset: "إعادة الضبط",
    loading: "جاري تحميل الخريطة...",
    tip: "💡 اسحب الخريطة للتحريك، ولاستخدم الأزرار للتكبير. اضغط على أي دولة.",
    legend: "مفتاح الألوان",
    pickHint: "اختر دولة من الخريطة لعرض تفاصيلها هنا",
    result: { free: "بدون فيزا", eta: "فيزا عند الوصول", evisa: "فيزا إلكترونية", required: "تحتاج فيزا مسبقة", covid: "متطلبات خاصة", refused: "ممنوع الدخول", unknown: "بيانات غير متاحة" },
    detail: { free: "بإمكانك الدخول مباشرة بدون تأشيرة مسبقة.", eta: "تحصل على التأشيرة عند الوصول للمطار.", evisa: "تقدّم بطلب فيزا إلكترونية قبل السفر.", required: "يجب التقديم للحصول على فيزا من السفارة قبل السفر.", covid: "هناك متطلبات صحية أو إجراءات خاصة.", refused: "السفر إلى هذه الدولة محظور لهذا الجواز حالياً.", unknown: "لا تتوفر بيانات لهذا المسار." },
    days: "يوم بدون فيزا",
    consult: "احجز استشارة عبر واتساب",
  },
  en: {
    kicker: "Interactive World Map",
    title: "Tap any country to see visa requirements instantly",
    desc: "Live color-coded heat map — pick your passport and the world lights up by entry requirements.",
    passport: "Passport",
    search: "Search a country...",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    reset: "Reset",
    loading: "Loading map...",
    tip: "💡 Drag to pan, use buttons to zoom. Tap any country.",
    legend: "Legend",
    pickHint: "Pick a country on the map to see details here",
    result: { free: "Visa-free", eta: "Visa on arrival", evisa: "e-Visa", required: "Visa required", covid: "Special rules", refused: "Entry not allowed", unknown: "No data" },
    detail: { free: "You can enter directly with no prior visa.", eta: "You'll get a visa stamped on arrival.", evisa: "Apply for an e-Visa before travel.", required: "Apply for a visa at the embassy before travel.", covid: "Special health or entry rules apply.", refused: "Travel restricted for this passport.", unknown: "No data found for this route." },
    days: "days visa-free",
    consult: "Book a consultation call",
  },
};

const STATUS_ICON: Record<VisaStatus, typeof CheckCircle2> = {
  free: CheckCircle2, eta: CheckCircle2, evisa: Info, required: AlertTriangle, covid: AlertTriangle, refused: XCircle, unknown: Info,
};

function countryLabel(c: Country | undefined, lang: "ar" | "en"): string {
  if (!c) return "";
  if (lang === "ar") {
    const ara = c.translations?.["ara"]?.common;
    if (ara) return ara;
  }
  return c.name.common;
}

export function WorldVisaMap() {
  const { lang } = useLang();
  const t = TXT[lang];
  const [countries, setCountries] = useState<Country[]>([]);
  const [matrix, setMatrix] = useState<Record<string, Record<string, string>> | null>(null);
  const [passport, setPassport] = useState("IQ");
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([20, 15]);
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    getCountries().then(setCountries).catch(() => setCountries([]));
    getMatrix().then(setMatrix).catch(() => setMatrix(null));
  }, []);

  const countryByIso2 = useMemo(() => {
    const m: Record<string, Country> = {};
    countries.forEach((c) => { m[c.cca2.toUpperCase()] = c; });
    return m;
  }, [countries]);

  const passportRow = matrix?.[passport.toUpperCase()] ?? {};

  const getStatus = (iso2: string): VisaStatus => {
    if (!matrix) return "unknown";
    if (iso2 === passport.toUpperCase()) return "free";
    return parseVisaCell(passportRow[iso2] ?? "").status;
  };

  const selectedCell = selected ? parseVisaCell(passportRow[selected] ?? "") : null;
  const selectedCountry = selected ? countryByIso2[selected] : undefined;

  const filteredCountries = useMemo(() => {
    if (!search.trim()) return countries.slice(0, 50);
    const q = search.trim().toLowerCase();
    return countries.filter((c) => c.name.common.toLowerCase().includes(q) || (c.translations?.["ara"]?.common ?? "").includes(q)).slice(0, 50);
  }, [countries, search]);

  const legendItems: { s: VisaStatus; label: string }[] = [
    { s: "free", label: t.result.free },
    { s: "eta", label: t.result.eta },
    { s: "evisa", label: t.result.evisa },
    { s: "required", label: t.result.required },
    { s: "refused", label: t.result.refused },
    { s: "unknown", label: t.result.unknown },
  ];

  const SelectedIcon = selectedCell ? STATUS_ICON[selectedCell.status] : Info;

  return (
    <section id="map" className="relative py-20 sm:py-32 px-5 sm:px-8 bg-gradient-to-b from-ivory via-cream/30 to-ivory overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }} className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-ember mb-3">
            <MapIcon className="size-4" /> — {t.kicker}
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold text-balance leading-tight">{t.title}</h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-pretty">{t.desc}</p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          {/* Map card */}
          <div className="bg-white rounded-3xl border border-ink/8 shadow-[var(--shadow-card)] overflow-hidden">
            {/* Controls bar */}
            <div className="flex flex-wrap items-center gap-3 p-4 sm:p-5 border-b border-ink/5 bg-cream/40">
              <label className="flex-1 min-w-[180px]">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{t.passport}</span>
                <select value={passport} onChange={(e) => setPassport(e.target.value)} className="w-full bg-white border border-ink/10 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ember">
                  {countries.length === 0 && <option value="IQ">🇮🇶 Iraq</option>}
                  {countries.map((c) => (
                    <option key={c.cca2} value={c.cca2}>{c.flag ?? ""} {countryLabel(c, lang)}</option>
                  ))}
                </select>
              </label>
              <div className="flex items-center gap-1.5">
                <button aria-label={t.zoomIn} onClick={() => setZoom((z) => Math.min(z * 1.5, 8))} className="size-10 grid place-items-center rounded-xl bg-white border border-ink/10 hover:border-ember/40 transition"><Plus className="size-4" /></button>
                <button aria-label={t.zoomOut} onClick={() => setZoom((z) => Math.max(z / 1.5, 1))} className="size-10 grid place-items-center rounded-xl bg-white border border-ink/10 hover:border-ember/40 transition"><Minus className="size-4" /></button>
                <button aria-label={t.reset} onClick={() => { setZoom(1); setCenter([20, 15]); }} className="size-10 grid place-items-center rounded-xl bg-white border border-ink/10 hover:border-ember/40 transition"><RotateCcw className="size-4" /></button>
              </div>
            </div>

            {/* Map */}
            <div className="relative bg-[#f7f4ee] aspect-[16/10] sm:aspect-[16/9]">
              {!matrix && (
                <div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">{t.loading}</div>
              )}
              <ComposableMap projection="geoEqualEarth" projectionConfig={{ scale: 160 }} style={{ width: "100%", height: "100%" }}>
                <ZoomableGroup zoom={zoom} center={center} minZoom={1} maxZoom={8} onMoveEnd={({ coordinates, zoom: z }) => { setCenter(coordinates as [number, number]); setZoom(z); }}>
                  <Geographies geography={TOPO_URL}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const numId = String(geo.id).padStart(3, "0");
                        const iso2 = NUMERIC_TO_ISO2[numId];
                        const status: VisaStatus = iso2 ? getStatus(iso2) : "unknown";
                        const isSelected = iso2 && iso2 === selected;
                        const isHover = iso2 && iso2 === hover;
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onClick={() => iso2 && setSelected(iso2)}
                            onMouseEnter={() => iso2 && setHover(iso2)}
                            onMouseLeave={() => setHover(null)}
                            style={{
                              default: {
                                fill: STATUS_COLOR[status],
                                stroke: "#fff",
                                strokeWidth: 0.4,
                                outline: "none",
                                cursor: iso2 ? "pointer" : "default",
                                transition: "all 0.2s",
                              },
                              hover: {
                                fill: STATUS_COLOR[status],
                                stroke: "#0d0d0d",
                                strokeWidth: 0.9,
                                outline: "none",
                                filter: "brightness(1.12)",
                                cursor: iso2 ? "pointer" : "default",
                              },
                              pressed: { fill: STATUS_COLOR[status], outline: "none" },
                            }}
                            stroke={isSelected ? "#0d0d0d" : isHover ? "#333" : "#fff"}
                            strokeWidth={isSelected ? 1.4 : 0.4}
                          />
                        );
                      })
                    }
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>
            </div>

            {/* Legend */}
            <div className="p-4 sm:p-5 border-t border-ink/5 bg-white">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">{t.legend}</div>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {legendItems.map((it) => (
                  <div key={it.s} className="inline-flex items-center gap-2 text-xs sm:text-sm">
                    <span className="size-3.5 rounded-sm" style={{ background: STATUS_COLOR[it.s] }} />
                    <span className="text-ink/80">{it.label}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">{t.tip}</p>
            </div>
          </div>

          {/* Details panel */}
          <aside className="bg-white rounded-3xl border border-ink/8 shadow-[var(--shadow-card)] p-5 sm:p-6 flex flex-col">
            <label className="block mb-4">
              <div className="relative">
                <Search className="absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 size-4 text-muted-foreground" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.search} className="w-full bg-cream/40 border border-ink/10 rounded-xl ltr:pl-9 rtl:pr-9 ltr:pr-3 rtl:pl-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ember" />
              </div>
              {search.trim() && (
                <div className="mt-2 max-h-44 overflow-y-auto rounded-xl border border-ink/5 bg-cream/30 divide-y divide-ink/5">
                  {filteredCountries.length === 0 && <div className="px-3 py-2 text-xs text-muted-foreground">—</div>}
                  {filteredCountries.map((c) => (
                    <button key={c.cca2} onClick={() => { setSelected(c.cca2.toUpperCase()); setSearch(""); }} className="w-full text-start px-3 py-2 text-sm hover:bg-white flex items-center gap-2">
                      <span>{c.flag}</span><span>{countryLabel(c, lang)}</span>
                    </button>
                  ))}
                </div>
              )}
            </label>

            <AnimatePresence mode="wait">
              {!selected ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 grid place-items-center text-center py-10">
                  <div>
                    <div className="size-20 mx-auto rounded-full bg-cream grid place-items-center mb-4">
                      <MapIcon className="size-9 text-ember" />
                    </div>
                    <p className="text-sm text-muted-foreground max-w-[220px] mx-auto">{t.pickHint}</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div key={selected} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{selectedCountry?.flag ?? "🏳️"}</span>
                      <div>
                        <div className="text-xl font-display font-bold leading-tight">{countryLabel(selectedCountry, lang) || selected}</div>
                        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{selected}</div>
                      </div>
                    </div>
                    <button aria-label="close" onClick={() => setSelected(null)} className="size-8 grid place-items-center rounded-full bg-cream/60 hover:bg-cream"><X className="size-4" /></button>
                  </div>

                  {selectedCell && (
                    <div className="p-5 rounded-2xl" style={{ background: `color-mix(in oklab, ${STATUS_COLOR[selectedCell.status]} 12%, white)` }}>
                      <div className="size-12 rounded-xl grid place-items-center mb-3" style={{ background: `color-mix(in oklab, ${STATUS_COLOR[selectedCell.status]} 25%, white)` }}>
                        <SelectedIcon className="size-6" style={{ color: STATUS_COLOR[selectedCell.status] }} strokeWidth={2.2} />
                      </div>
                      <h4 className="text-lg font-display font-bold mb-1">{t.result[selectedCell.status]}</h4>
                      {selectedCell.days !== undefined && (
                        <div className="text-sm font-semibold text-ember mb-1">{selectedCell.days} {t.days}</div>
                      )}
                      <p className="text-sm text-ink/70 leading-relaxed">{t.detail[selectedCell.status]}</p>
                    </div>
                  )}

                  <a href="tel:+962782727279" className="mt-5 inline-flex items-center justify-center gap-2 bg-ink text-ivory py-3 rounded-2xl text-sm font-bold hover:scale-[1.01] active:scale-95 transition-transform">
                    {t.consult}
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </aside>
        </div>
      </div>
    </section>
  );
}
