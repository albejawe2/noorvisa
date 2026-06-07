export type Lang = "ar" | "en";

type Dict = {
  brand: { name: string; tagline: string };
  nav: { services: string; about: string; why: string; faq: string; contact: string; tools: string; cta: string };
  hero: {
    eyebrow: string; titleStart: string; titleHighlight: string; titleEnd: string;
    desc: string; ctaWhatsapp: string; ctaServices: string;
    badgeNumber: string; badgeLabel: string; portraitAlt: string;
    floatA: { label: string; value: string }; floatB: string; trust: string;
  };
  stats: { title: string; items: ReadonlyArray<{ value: number; suffix: string; label: string }> };
  services: { kicker: string; title: string; desc: string; items: ReadonlyArray<{ title: string; desc: string }> };
  why: { kicker: string; title: string; desc: string; items: ReadonlyArray<{ title: string; desc: string }> };
  testimonials: { title: string; items: ReadonlyArray<{ quote: string; name: string; role: string }> };
  faq: { title: string; desc: string; items: ReadonlyArray<{ q: string; a: string }> };
  cta: { title: string; desc: string; button: string; note: string };
  footer: { rights: string; privacy: string; terms: string; contact: string; tagline: string };
  fab: string;
  menuOpen: string;
  menuClose: string;
  tools: {
    kicker: string;
    title: string;
    desc: string;
    tabs: { visa: string; currency: string; country: string; weather: string };
    visa: {
      title: string; desc: string; passport: string; destination: string;
      choose: string; check: string; loading: string;
      result: { free: string; eta: string; evisa: string; required: string; covid: string; refused: string; unknown: string };
      detail: { free: string; eta: string; evisa: string; required: string; covid: string; refused: string; days: string };
      noData: string;
    };
    currency: {
      title: string; desc: string; from: string; to: string; amount: string;
      convert: string; loading: string; rate: string;
    };
    country: {
      title: string; desc: string; select: string; loading: string;
      capital: string; population: string; region: string; languages: string; currencies: string; timezone: string; calling: string;
    };
    weather: {
      title: string; desc: string; loading: string; temp: string; wind: string; humidity: string;
    };
    powered: string;
  };
};

export const translations: Record<Lang, Dict> = {
  ar: {
    brand: { name: "NoorVisa", tagline: "بوابتك الموثوقة إلى العالم منذ 2016." },
    nav: { services: "الخدمات", about: "عني", why: "لماذا أنا", faq: "الأسئلة", contact: "تواصل", tools: "أدوات السفر", cta: "استشارة مجانية" },
    hero: {
      eyebrow: "أعمل بشكل مستقل منذ 2016 — موثوق عالمياً",
      titleStart: "بوابتك إلى",
      titleHighlight: "العالم",
      titleEnd: "بثقة",
      desc: "أنا نور — مستشار مستقل في تأشيرات السفر والاستشارات الدولية بخبرة 9 سنوات. ساعدت أكثر من 600 شخص على تحقيق أحلامهم حول العالم بنفسي ومن دون وسطاء.",
      ctaWhatsapp: "ابدأ الآن عبر واتساب",
      ctaServices: "اكتشف الخدمات",
      badgeNumber: "+600",
      badgeLabel: "شخص ناجح",
      portraitAlt: "نور — مستشار التأشيرات المستقل",
      floatA: { label: "نسبة القبول", value: "98%" },
      floatB: "شخص سعيد",
      trust: "تقييم العملاء الموثقين",
    },
    stats: {
      title: "أرقام تتحدث عن الثقة",
      items: [
        { value: 9, suffix: "+", label: "سنوات خبرة" },
        { value: 600, suffix: "+", label: "شخص سعيد" },
        { value: 50, suffix: "+", label: "دولة" },
        { value: 98, suffix: "%", label: "نسبة قبول" },
      ],
    },
    services: {
      kicker: "الخدمات",
      title: "كل تأشيرة تستحق، أجعلها ممكنة",
      desc: "حلول متكاملة لكل نوع من السفر والطلب الدولي بأعلى معايير الاحترافية الشخصية.",
      items: [
        { title: "تأشيرات سياحية", desc: "إجراءات سياحية لأكثر من 150 وجهة حول العالم." },
        { title: "تأشيرات دراسية", desc: "دعم كامل لتأمين القبول الجامعي وتأشيرة الدراسة." },
        { title: "تأشيرات علاجية", desc: "تنسيق المواعيد الطبية في أفضل المراكز العالمية." },
        { title: "تأشيرات عمل", desc: "حلول مخصصة للمهنيين والشركات دولياً." },
        { title: "ترجمة وثائق معتمدة", desc: "ترجمة قانونية مصدّقة لجميع الوثائق الرسمية، مقبولة في السفارات." },
        { title: "تأمين سفر دولي", desc: "بوالص تأمين سفر معتمدة لشنغن وكل الوجهات بأفضل الأسعار." },
        { title: "استشارات الهجرة", desc: "تحليل شامل لفرص الهجرة القانونية لكل حالة." },
        { title: "تجهيز ومتابعة الملفات", desc: "إعداد احترافي ومتابعة دقيقة حتى استلام التأشيرة." },
      ],
    },
    why: {
      kicker: "لماذا تختارني",
      title: "خبرة شخصية موثقة، شفافية كاملة",
      desc: "تتعامل معي مباشرة — لا وسطاء ولا موظفين. منذ 2016 وأنا أحوّل الأحلام إلى ختم سفر.",
      items: [
        { title: "خبرة 9 سنوات", desc: "تسع سنوات من العمل المتخصص الشخصي في عالم التأشيرات." },
        { title: "تغطية عالمية", desc: "علاقات شخصية مع السفارات في أكثر من 50 دولة." },
        { title: "استجابة فورية", desc: "أرد عليك بنفسي على مدار الساعة دون فلاتر أو سكرتارية." },
        { title: "شفافية كاملة", desc: "لا رسوم خفية ولا وعود زائفة — فقط الحقيقة منّي إليك مباشرة." },
      ],
    },
    testimonials: {
      title: "ماذا يقول عملائي",
      items: [
        { quote: "احترافية عالية وسرعة مذهلة في استخراج فيزا الشنغن. تواصل شخصي ومباشر طوال الإجراءات.", name: "أحمد المهندس", role: "رجل أعمال" },
        { quote: "أفضل شخص تعاملت معه — صدق وأمانة ودقة. يرد بنفسه في أي وقت.", name: "سارة علي", role: "طالبة دراسات عليا" },
        { quote: "ساعدني شخصياً في قبول الجامعة والفيزا الأمريكية بكل سهولة وسلاسة.", name: "محمد الهاشمي", role: "طالب جامعي" },
      ],
    },
    faq: {
      title: "أسئلة شائعة",
      desc: "كل ما تحتاج معرفته قبل أن تبدأ.",
      items: [
        { q: "كم تستغرق عملية معالجة الطلب؟", a: "تختلف المدة حسب نوع التأشيرة، لكن في المتوسط من أسبوع إلى أربعة أسابيع." },
        { q: "هل تضمن الحصول على التأشيرة؟", a: "أضمن أعلى نسب القبول من خلال الإعداد المحترف للملف، لكن القرار النهائي يبقى للسفارة." },
        { q: "ما الدول التي تشملها خدماتك؟", a: "أقدم خدماتي لأكثر من 50 دولة تشمل أوروبا، أمريكا، كندا، أستراليا، آسيا، والخليج." },
        { q: "هل تترجم الوثائق رسمياً؟", a: "نعم، ترجمة قانونية معتمدة ومصدّقة مقبولة من جميع السفارات والجهات الرسمية." },
        { q: "هل توفر تأمين سفر؟", a: "نعم، بوالص تأمين سفر دولي معتمدة لشنغن وكل الوجهات بأفضل الأسعار." },
        { q: "كيف أبدأ الإجراءات معك؟", a: "تواصل معي مباشرة عبر واتساب لاستشارة مجانية، وسأرشدك خطوة بخطوة." },
        { q: "هل الاستشارة الأولى مجانية فعلاً؟", a: "نعم تماماً، استشارة شاملة معي شخصياً عبر واتساب دون أي التزام." },
      ],
    },
    cta: { title: "ابدأ رحلتك الدولية اليوم", desc: "أنا جاهز للرد على استفساراتك خلال دقائق وتقديم خطة عمل واضحة بنفسي.", button: "تحدث معي الآن", note: "استجابة شخصية خلال أقل من 15 دقيقة" },
    footer: { rights: "© 2026 NoorVisa — جميع الحقوق محفوظة", privacy: "الخصوصية", terms: "الشروط", contact: "تواصل", tagline: "بوابتك الموثوقة إلى العالم منذ 2016." },
    fab: "تحدث معي",
    menuOpen: "افتح القائمة",
    menuClose: "أغلق القائمة",
    tools: {
      kicker: "أدوات ذكية",
      title: "مركز ذكاء السفر",
      desc: "أدوات تفاعلية حية مدعومة ببيانات عالمية حقيقية — تحقق من متطلبات الفيزا، حوّل العملات، وتعرّف على وجهتك قبل السفر.",
      tabs: { visa: "متطلبات الفيزا", currency: "حاسبة العملة", country: "معلومات الدولة", weather: "الطقس الآن" },
      visa: {
        title: "تحقق فوري من متطلبات الفيزا",
        desc: "اختر جنسية جواز سفرك ووجهتك لمعرفة هل تحتاج فيزا أم لا.",
        passport: "جواز السفر",
        destination: "الوجهة",
        choose: "اختر دولة...",
        check: "تحقق الآن",
        loading: "جاري التحقق...",
        result: {
          free: "دخول بدون فيزا",
          eta: "تأشيرة عند الوصول",
          evisa: "فيزا إلكترونية",
          required: "تحتاج فيزا مسبقة",
          covid: "متطلبات خاصة",
          refused: "ممنوع الدخول",
          unknown: "بيانات غير متاحة",
        },
        detail: {
          free: "بإمكانك الدخول مباشرة بدون تأشيرة مسبقة.",
          eta: "تحصل على التأشيرة عند الوصول إلى المطار.",
          evisa: "تقدّم بطلب فيزا إلكترونية قبل السفر.",
          required: "يجب التقديم للحصول على فيزا من السفارة قبل السفر.",
          covid: "هناك متطلبات صحية أو إجراءات خاصة — تواصل معي.",
          refused: "السفر إلى هذه الدولة محظور لحاملي هذا الجواز حالياً.",
          days: "يوم",
        },
        noData: "لم نعثر على بيانات لهذا المسار. تواصل معي للحصول على معلومات دقيقة.",
      },
      currency: {
        title: "حاسبة العملات الفورية",
        desc: "أسعار صرف حية محدّثة لحظياً — خطط لميزانية رحلتك بدقة.",
        from: "من",
        to: "إلى",
        amount: "المبلغ",
        convert: "تحويل",
        loading: "جاري التحويل...",
        rate: "سعر الصرف",
      },
      country: {
        title: "بطاقة الدولة الذكية",
        desc: "كل ما تحتاج معرفته عن وجهتك في لمحة.",
        select: "اختر الدولة",
        loading: "جاري التحميل...",
        capital: "العاصمة",
        population: "عدد السكان",
        region: "المنطقة",
        languages: "اللغات",
        currencies: "العملة",
        timezone: "التوقيت",
        calling: "مفتاح الاتصال",
      },
      weather: {
        title: "حالة الطقس الحالية",
        desc: "طقس عاصمة وجهتك مباشرة.",
        loading: "جاري التحميل...",
        temp: "الحرارة",
        wind: "الرياح",
        humidity: "الرطوبة",
      },
      powered: "بيانات حية من REST Countries و Open-Meteo و Frankfurter — مصادر مجانية ومفتوحة.",
    },
  },
  en: {
    brand: { name: "NoorVisa", tagline: "Your trusted gateway to the world since 2016." },
    nav: { services: "Services", about: "About Me", why: "Why Me", faq: "FAQ", contact: "Contact", tools: "Travel Tools", cta: "Free Consultation" },
    hero: {
      eyebrow: "Independent since 2016 — Trusted Worldwide",
      titleStart: "Your gateway to the",
      titleHighlight: "world",
      titleEnd: "with confidence",
      desc: "I'm Noor — an independent visa & immigration consultant with 9 years of experience. I've personally helped 600+ people realize their global dreams, with no middlemen.",
      ctaWhatsapp: "Start on WhatsApp",
      ctaServices: "Explore services",
      badgeNumber: "+600",
      badgeLabel: "Successful clients",
      portraitAlt: "Noor — Independent Visa Consultant",
      floatA: { label: "Approval rate", value: "98%" },
      floatB: "Happy clients",
      trust: "From verified clients",
    },
    stats: {
      title: "Numbers that build trust",
      items: [
        { value: 9, suffix: "+", label: "Years experience" },
        { value: 600, suffix: "+", label: "Happy clients" },
        { value: 50, suffix: "+", label: "Countries" },
        { value: 98, suffix: "%", label: "Approval rate" },
      ],
    },
    services: {
      kicker: "Services",
      title: "Every visa deserves expertise",
      desc: "End-to-end personal solutions for every type of international application.",
      items: [
        { title: "Tourist Visas", desc: "Streamlined travel procedures for 150+ destinations." },
        { title: "Student Visas", desc: "Full support to secure admission and study visas." },
        { title: "Medical Visas", desc: "Appointments at the world's top medical centers." },
        { title: "Work Visas", desc: "Tailored solutions for professionals and companies." },
        { title: "Certified Translation", desc: "Legally certified document translation accepted by all embassies." },
        { title: "Travel Insurance", desc: "Approved Schengen-grade travel insurance at the best rates." },
        { title: "Immigration", desc: "Comprehensive analysis of legal immigration pathways." },
        { title: "File Prep & Follow-up", desc: "Professional prep and continuous follow-up until approval." },
      ],
    },
    why: {
      kicker: "Why choose me",
      title: "Personal expertise, total transparency",
      desc: "You deal with me directly — no middlemen, no staff. Since 2016, turning dreams into stamped passports.",
      items: [
        { title: "9 Years of Expertise", desc: "Nine years of specialized personal visa work." },
        { title: "Global Coverage", desc: "Personal relationships with embassies in 50+ countries." },
        { title: "Instant Personal Reply", desc: "I respond personally around the clock — no filters." },
        { title: "Full Transparency", desc: "No hidden fees, no false promises — just the truth from me to you." },
      ],
    },
    testimonials: {
      title: "What my clients say",
      items: [
        { quote: "Exceptional professionalism and amazing speed with my Schengen visa. Direct personal contact throughout.", name: "Ahmed Al-Muhandes", role: "Businessman" },
        { quote: "Best person I've ever worked with — honesty, integrity, replies personally anytime.", name: "Sara Ali", role: "Graduate Student" },
        { quote: "He helped me personally secure my university admission and US visa effortlessly.", name: "Mohammed Al-Hashimi", role: "University Student" },
      ],
    },
    faq: {
      title: "Frequently asked",
      desc: "Everything you need to know before starting.",
      items: [
        { q: "How long does processing take?", a: "It varies by visa type, but typically one to four weeks on average." },
        { q: "Do you guarantee getting the visa?", a: "I guarantee top approval rates through professional file prep, but the final decision is the embassy's." },
        { q: "Which countries do you cover?", a: "50+ countries including Europe, USA, Canada, Australia, Asia, and the Gulf." },
        { q: "Do you provide certified translation?", a: "Yes — legally certified translation accepted by all embassies and official bodies." },
        { q: "Do you provide travel insurance?", a: "Yes — Schengen-grade international travel insurance at the best rates." },
        { q: "How do I get started?", a: "Reach me directly on WhatsApp for a free consultation, and I'll guide you step by step." },
        { q: "Is the first consultation really free?", a: "Absolutely — a full personal consultation on WhatsApp with zero commitment." },
      ],
    },
    cta: { title: "Start your global journey today", desc: "I respond personally in minutes with a clear plan tailored to your case.", button: "Talk to me now", note: "Personal reply in under 15 minutes" },
    footer: { rights: "© 2026 NoorVisa — All rights reserved", privacy: "Privacy", terms: "Terms", contact: "Contact", tagline: "Your trusted gateway to the world since 2016." },
    fab: "Chat with me",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    tools: {
      kicker: "Smart Tools",
      title: "Travel Intelligence Hub",
      desc: "Live interactive tools powered by real global data — check visa requirements, convert currencies, and explore your destination before you fly.",
      tabs: { visa: "Visa Requirements", currency: "Currency", country: "Country Facts", weather: "Live Weather" },
      visa: {
        title: "Instant Visa Requirement Check",
        desc: "Pick your passport and destination to see if you need a visa.",
        passport: "Passport",
        destination: "Destination",
        choose: "Select a country...",
        check: "Check now",
        loading: "Checking...",
        result: {
          free: "Visa-free entry",
          eta: "Visa on arrival",
          evisa: "e-Visa",
          required: "Visa required",
          covid: "Special requirements",
          refused: "Entry not allowed",
          unknown: "No data available",
        },
        detail: {
          free: "You can enter directly without a prior visa.",
          eta: "You'll get a visa stamped on arrival at the airport.",
          evisa: "Apply for an electronic visa before traveling.",
          required: "You must apply for a visa at the embassy before traveling.",
          covid: "Special health or entry rules apply — contact me.",
          refused: "Travel to this country is currently restricted for this passport.",
          days: "days",
        },
        noData: "No data found for this route. Contact me for accurate info.",
      },
      currency: {
        title: "Live Currency Converter",
        desc: "Real-time exchange rates — plan your travel budget precisely.",
        from: "From",
        to: "To",
        amount: "Amount",
        convert: "Convert",
        loading: "Converting...",
        rate: "Exchange rate",
      },
      country: {
        title: "Smart Country Card",
        desc: "Everything you need to know about your destination at a glance.",
        select: "Pick a country",
        loading: "Loading...",
        capital: "Capital",
        population: "Population",
        region: "Region",
        languages: "Languages",
        currencies: "Currency",
        timezone: "Timezone",
        calling: "Calling code",
      },
      weather: {
        title: "Live Weather",
        desc: "Live weather for your destination's capital.",
        loading: "Loading...",
        temp: "Temp",
        wind: "Wind",
        humidity: "Humidity",
      },
      powered: "Live data from REST Countries, Open-Meteo & Frankfurter — free open APIs.",
    },
  },
};

export type Translations = Dict;
