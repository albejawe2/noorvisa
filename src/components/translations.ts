export type Lang = "ar" | "en";

type Dict = {
  nav: { services: string; about: string; why: string; faq: string; contact: string; cta: string };
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
};

export const translations: Record<Lang, Dict> = {
  ar: {
    nav: { services: "الخدمات", about: "عن المؤسسة", why: "لماذا نحن", faq: "الأسئلة", contact: "تواصل", cta: "استشارة مجانية" },
    hero: {
      eyebrow: "تأسست 2014 — موثوقة عالمياً",
      titleStart: "بوابتك إلى",
      titleHighlight: "العالم",
      titleEnd: "بثقة",
      desc: "نور فيزا — عشر سنوات من الخبرة في تأشيرات السفر والاستشارات الدولية، ساعدنا أكثر من 600 عميل على تحقيق أحلامهم حول العالم.",
      ctaWhatsapp: "ابدأ الآن عبر واتساب",
      ctaServices: "اكتشف الخدمات",
      badgeNumber: "+600",
      badgeLabel: "عميل ناجح",
      portraitAlt: "نور فيزا — مستشارة التأشيرات المعتمدة",
      floatA: { label: "نسبة القبول", value: "98%" },
      floatB: "عميل سعيد",
      trust: "تقييم عملائنا الموثقين",
    },
    stats: {
      title: "أرقام تتحدث عن الثقة",
      items: [
        { value: 10, suffix: "+", label: "سنوات خبرة" },
        { value: 600, suffix: "+", label: "عميل سعيد" },
        { value: 50, suffix: "+", label: "دولة" },
        { value: 98, suffix: "%", label: "نسبة قبول" },
      ],
    },
    services: {
      kicker: "خدماتنا",
      title: "كل تأشيرة تستحق، نجعلها ممكنة",
      desc: "حلول متكاملة لكل نوع من السفر والطلب الدولي بأعلى معايير الاحترافية.",
      items: [
        { title: "تأشيرات سياحية", desc: "إجراءات سياحية لأكثر من 150 وجهة حول العالم." },
        { title: "تأشيرات دراسية", desc: "دعم كامل لتأمين القبول الجامعي وتأشيرة الدراسة." },
        { title: "تأشيرات علاجية", desc: "تنسيق المواعيد الطبية في أفضل المراكز العالمية." },
        { title: "تأشيرات عمل", desc: "حلول مخصصة للشركات والمهنيين دولياً." },
        { title: "استشارات الهجرة", desc: "تحليل شامل لفرص الهجرة القانونية لكل حالة." },
        { title: "تجهيز الملفات", desc: "إعداد احترافي يضمن أعلى نسب القبول." },
        { title: "متابعة الطلبات", desc: "تحديثات دورية وتواصل مستمر مع السفارات." },
        { title: "حجز المواعيد", desc: "تأمين مواعيد السفارات بأسرع وقت ممكن." },
      ],
    },
    why: {
      kicker: "لماذا نور فيزا",
      title: "خبرة موثقة، شفافية كاملة",
      desc: "نتائج تتحدث عن نفسها — منذ 2014 ونحن نحوّل الأحلام إلى ختم سفر.",
      items: [
        { title: "خبرة عشر سنوات", desc: "عقد كامل من العمل المتخصص في عالم التأشيرات الدولية." },
        { title: "تغطية عالمية", desc: "علاقات راسخة مع السفارات في أكثر من 50 دولة." },
        { title: "استجابة فورية", desc: "فريق متاح على مدار الساعة للرد على استفساراتك." },
        { title: "شفافية كاملة", desc: "لا رسوم خفية ولا وعود زائفة — فقط الحقيقة." },
      ],
    },
    testimonials: {
      title: "ماذا يقول عملاؤنا",
      items: [
        { quote: "احترافية عالية وسرعة مذهلة في استخراج فيزا الشنغن. أنصح بهم بشدة!", name: "أحمد المهندس", role: "رجل أعمال" },
        { quote: "أفضل مكتب تعاملت معه على الإطلاق — صدق وأمانة ودقة في المواعيد.", name: "سارة علي", role: "طالبة دراسات عليا" },
        { quote: "ساعدوني في قبول الجامعة والفيزا الأمريكية بكل سهولة وسلاسة.", name: "محمد الهاشمي", role: "طالب جامعي" },
      ],
    },
    faq: {
      title: "أسئلة شائعة",
      desc: "كل ما تحتاج معرفته قبل أن تبدأ.",
      items: [
        { q: "كم تستغرق عملية معالجة الطلب؟", a: "تختلف المدة حسب نوع التأشيرة، لكن في المتوسط من أسبوع إلى أربعة أسابيع." },
        { q: "هل تضمنون الحصول على التأشيرة؟", a: "نضمن أعلى نسب القبول من خلال الإعداد المحترف للملف، لكن القرار النهائي يبقى للسفارة." },
        { q: "ما هي الدول التي تشملها خدماتكم؟", a: "نقدم خدماتنا لأكثر من 50 دولة تشمل أوروبا، أمريكا، كندا، أستراليا، آسيا، والخليج." },
        { q: "كيف أبدأ الإجراءات معكم؟", a: "تواصل معنا عبر واتساب لاستشارة مجانية، وسنرشدك خطوة بخطوة." },
        { q: "هل خدمة الاستشارة الأولى مجانية فعلاً؟", a: "نعم تماماً، استشارة شاملة عبر واتساب دون أي التزام." },
      ],
    },
    cta: { title: "ابدأ رحلتك الدولية اليوم", desc: "فريقنا جاهز للرد على استفساراتك خلال دقائق وتقديم خطة عمل واضحة.", button: "تحدث معنا الآن", note: "استجابة خلال أقل من 15 دقيقة" },
    footer: { rights: "© 2026 نور فيزا — جميع الحقوق محفوظة", privacy: "الخصوصية", terms: "الشروط", contact: "تواصل", tagline: "بوابتك الموثوقة إلى العالم منذ 2014." },
    fab: "تحدث معنا",
    menuOpen: "افتح القائمة",
    menuClose: "أغلق القائمة",
  },
  en: {
    nav: { services: "Services", about: "About", why: "Why Us", faq: "FAQ", contact: "Contact", cta: "Free Consultation" },
    hero: {
      eyebrow: "Est. 2014 — Trusted Worldwide",
      titleStart: "Your gateway to the",
      titleHighlight: "world",
      titleEnd: "with confidence",
      desc: "Noor Visa — a decade of expertise in visa and immigration services, helping 600+ clients realize their global dreams.",
      ctaWhatsapp: "Start on WhatsApp",
      ctaServices: "Explore services",
      badgeNumber: "+600",
      badgeLabel: "Successful Clients",
      portraitAlt: "Noor Visa — Certified Visa Consultant",
      floatA: { label: "Approval rate", value: "98%" },
      floatB: "Happy clients",
      trust: "From verified clients",
    },
    stats: {
      title: "Numbers that build trust",
      items: [
        { value: 10, suffix: "+", label: "Years experience" },
        { value: 600, suffix: "+", label: "Happy clients" },
        { value: 50, suffix: "+", label: "Countries" },
        { value: 98, suffix: "%", label: "Approval rate" },
      ],
    },
    services: {
      kicker: "Services",
      title: "Every visa deserves expertise",
      desc: "End-to-end solutions for every type of international application.",
      items: [
        { title: "Tourist Visas", desc: "Streamlined travel procedures for 150+ destinations." },
        { title: "Student Visas", desc: "Full support to secure admission and study visas." },
        { title: "Medical Visas", desc: "Appointments at the world's top medical centers." },
        { title: "Work Visas", desc: "Tailored solutions for companies and professionals." },
        { title: "Immigration", desc: "Comprehensive analysis of legal immigration pathways." },
        { title: "File Preparation", desc: "Professional prep that maximizes approval rates." },
        { title: "Follow-up", desc: "Regular updates and continuous embassy communication." },
        { title: "Appointments", desc: "Embassy slots secured as fast as possible." },
      ],
    },
    why: {
      kicker: "Why Noor Visa",
      title: "Proven expertise, total transparency",
      desc: "Since 2014, turning dreams into stamped passports.",
      items: [
        { title: "A Decade of Expertise", desc: "Ten years of specialized international visa work." },
        { title: "Global Coverage", desc: "Strong relationships with embassies in 50+ countries." },
        { title: "Instant Response", desc: "Team available around the clock for your inquiries." },
        { title: "Full Transparency", desc: "No hidden fees, no false promises — just the truth." },
      ],
    },
    testimonials: {
      title: "What our clients say",
      items: [
        { quote: "Exceptional professionalism and amazing speed with my Schengen visa.", name: "Ahmed Al-Muhandes", role: "Businessman" },
        { quote: "Best office I've ever worked with — honesty, integrity, punctuality.", name: "Sara Ali", role: "Graduate Student" },
        { quote: "They helped me secure my university admission and US visa effortlessly.", name: "Mohammed Al-Hashimi", role: "University Student" },
      ],
    },
    faq: {
      title: "Frequently asked",
      desc: "Everything you need to know before starting.",
      items: [
        { q: "How long does processing take?", a: "It varies by visa type, but typically one to four weeks on average." },
        { q: "Do you guarantee getting the visa?", a: "We guarantee top approval rates through professional file prep, but the final decision is the embassy's." },
        { q: "Which countries do you cover?", a: "50+ countries including Europe, USA, Canada, Australia, Asia, and the Gulf." },
        { q: "How do I get started?", a: "Reach us on WhatsApp for a free consultation, and we'll guide you step by step." },
        { q: "Is the first consultation really free?", a: "Absolutely — a full consultation on WhatsApp with zero commitment." },
      ],
    },
    cta: { title: "Start your global journey today", desc: "Our team responds in minutes with a clear plan tailored to your case.", button: "Talk to us now", note: "Reply in under 15 minutes" },
    footer: { rights: "© 2026 Noor Visa — All rights reserved", privacy: "Privacy", terms: "Terms", contact: "Contact", tagline: "Your trusted gateway to the world since 2014." },
    fab: "Chat with us",
    menuOpen: "Open menu",
    menuClose: "Close menu",
  },
};

export type Translations = Dict;
