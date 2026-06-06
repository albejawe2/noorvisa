export type Lang = "ar" | "en";

type Dict = {
  nav: { services: string; about: string; why: string; faq: string; contact: string; cta: string };
  hero: { eyebrow: string; titleStart: string; titleHighlight: string; titleEnd: string; desc: string; ctaWhatsapp: string; ctaServices: string; badgeNumber: string; badgeLabel: string; portraitAlt: string };
  stats: { title: string; items: ReadonlyArray<{ value: number; suffix: string; label: string }> };
  services: { title: string; desc: string; items: ReadonlyArray<{ title: string; desc: string }> };
  why: { title: string; desc: string; items: ReadonlyArray<{ title: string; desc: string }> };
  testimonials: { title: string; items: ReadonlyArray<{ quote: string; name: string; role: string }> };
  faq: { title: string; desc: string; items: ReadonlyArray<{ q: string; a: string }> };
  cta: { title: string; desc: string; button: string; note: string };
  footer: { rights: string; privacy: string; terms: string; contact: string };
  fab: string;
  menuOpen: string;
  menuClose: string;
};

export const translations: Record<Lang, Dict> = {
  ar: {
    nav: {
      services: "الخدمات",
      about: "عن المؤسسة",
      why: "لماذا نحن",
      faq: "الأسئلة الشائعة",
      contact: "تواصل",
      cta: "استشارة مجانية",
    },
    hero: {
      eyebrow: "تأسست 2014 — خدمات تأشيرات راقية",
      titleStart: "نوّر فيزا — خدمات تأشيرات",
      titleHighlight: "احترافية",
      titleEnd: "بخبرة عالمية",
      desc: "أكثر من 10 سنوات من الخبرة في خدمات التأشيرات والاستشارات الدولية، مع أكثر من 600 عميل من مختلف أنحاء العالم.",
      ctaWhatsapp: "تواصل عبر واتساب",
      ctaServices: "خدماتنا",
      badgeNumber: "+600",
      badgeLabel: "عميل ناجح",
      portraitAlt: "نور فيزا — مستشارة التأشيرات المعتمدة",
    },
    stats: {
      title: "أرقام تتحدث عن الثقة",
      items: [
        { value: 10, suffix: "+", label: "سنوات خبرة" },
        { value: 600, suffix: "+", label: "عميل سعيد" },
        { value: 50, suffix: "+", label: "دولة حول العالم" },
        { value: 24, suffix: "/7", label: "سرعة استجابة" },
      ],
    },
    services: {
      title: "حلول التأشيرات المتكاملة",
      desc: "نقدم خدمات متخصصة لكل نوع من أنواع السفر والطلب الدولي بأعلى معايير الاحترافية.",
      items: [
        { title: "تأشيرات سياحية", desc: "تسهيل كافة إجراءات السياحة والسفر لأكثر من 150 وجهة حول العالم." },
        { title: "تأشيرات دراسية", desc: "دعم كامل للطلاب في تأمين القبول الجامعي وتأشيرات الدراسة الدولية." },
        { title: "تأشيرات علاجية", desc: "تنسيق المواعيد الطبية وتأشيرات العلاج في أفضل المراكز العالمية." },
        { title: "تأشيرات عمل", desc: "حلول مخصصة للشركات والمهنيين الراغبين في العمل دولياً." },
        { title: "استشارات الهجرة", desc: "تحليل شامل لفرص الهجرة القانونية والمسارات المتاحة لكل حالة." },
        { title: "تجهيز الملفات", desc: "إعداد احترافي لملفات السفارات لضمان أعلى نسب القبول." },
        { title: "متابعة الطلبات", desc: "تحديثات دورية عن حالة طلبك وتواصل مستمر مع الجهات المعنية." },
        { title: "حجز المواعيد", desc: "تأمين مواعيد السفارات ومراكز التقديم بأسرع وقت ممكن." },
      ],
    },
    why: {
      title: "لماذا نور فيزا؟",
      desc: "خبرة موثقة، شفافية كاملة، ونتائج تتحدث عن نفسها.",
      items: [
        { title: "خبرة عشر سنوات", desc: "عقد كامل من العمل المتخصص في عالم التأشيرات الدولية." },
        { title: "تغطية عالمية", desc: "علاقات راسخة مع السفارات في أكثر من 50 دولة." },
        { title: "استجابة فورية", desc: "فريق متاح على مدار الساعة للرد على استفساراتك." },
        { title: "شفافية كاملة", desc: "لا رسوم خفية ولا وعود زائفة — فقط الحقيقة منذ اللحظة الأولى." },
      ],
    },
    testimonials: {
      title: "ماذا يقول عملاؤنا",
      items: [
        { quote: "احترافية عالية في التعامل وسرعة مذهلة في استخراج فيزا الشنغن.", name: "أحمد المهندس", role: "رجل أعمال" },
        { quote: "أفضل مكتب تعاملت معه، صدق وأمانة ودقة في المواعيد.", name: "سارة علي", role: "طالبة دراسات عليا" },
        { quote: "ساعدوني في تأمين قبول الجامعة والفيزا الأمريكية بكل سهولة.", name: "محمد الهاشمي", role: "طالب جامعي" },
      ],
    },
    faq: {
      title: "الأسئلة الشائعة",
      desc: "كل ما تحتاج معرفته قبل أن تبدأ.",
      items: [
        { q: "كم تستغرق عملية معالجة الطلب؟", a: "تختلف المدة حسب نوع التأشيرة والدولة، لكن في المتوسط من أسبوع إلى أربعة أسابيع. نحرص على إنجاز كل خطوة بأسرع وقت ممكن." },
        { q: "هل تضمنون الحصول على التأشيرة؟", a: "نضمن لك أعلى نسب القبول من خلال الإعداد المحترف للملف، لكن القرار النهائي يبقى للسفارة. شفافيتنا الكاملة تعني أننا نخبرك مسبقاً بفرص نجاح ملفك." },
        { q: "ما هي الدول التي تشملها خدماتكم؟", a: "نقدم خدماتنا لأكثر من 50 دولة حول العالم تشمل أوروبا، أمريكا، كندا، أستراليا، آسيا، والخليج العربي." },
        { q: "كيف أبدأ الإجراءات معكم؟", a: "تواصل معنا عبر واتساب للحصول على استشارة مجانية، وسنرشدك خطوة بخطوة لما يناسب حالتك." },
        { q: "هل خدمة الاستشارة الأولى مجانية فعلاً؟", a: "نعم تماماً. نقدم استشارة أولى مجانية شاملة عبر واتساب دون أي التزام منك." },
      ],
    },
    cta: {
      title: "ابدأ رحلتك الدولية اليوم",
      desc: "فريقنا جاهز للرد على جميع استفساراتك وتقديم المشورة المهنية اللازمة خلال دقائق.",
      button: "تحدث معنا الآن",
      note: "استجابة خلال أقل من 15 دقيقة",
    },
    footer: {
      rights: "© 2026 نور فيزا — جميع الحقوق محفوظة",
      privacy: "الخصوصية",
      terms: "الشروط",
      contact: "تواصل",
    },
    fab: "تحدث معنا",
    menuOpen: "افتح القائمة",
    menuClose: "أغلق القائمة",
  },
  en: {
    nav: {
      services: "Services",
      about: "About",
      why: "Why Us",
      faq: "FAQ",
      contact: "Contact",
      cta: "Free Consultation",
    },
    hero: {
      eyebrow: "Est. 2014 — Premium Visa Services",
      titleStart: "Noor Visa — Premium",
      titleHighlight: "Global",
      titleEnd: "Visa Services",
      desc: "Over 10 years of experience in visa services and international consultation, helping more than 600 clients worldwide.",
      ctaWhatsapp: "Chat on WhatsApp",
      ctaServices: "Our Services",
      badgeNumber: "+600",
      badgeLabel: "Successful Clients",
      portraitAlt: "Noor Visa — Certified Visa Consultant",
    },
    stats: {
      title: "Numbers that build trust",
      items: [
        { value: 10, suffix: "+", label: "Years of Experience" },
        { value: 600, suffix: "+", label: "Happy Clients" },
        { value: 50, suffix: "+", label: "Countries Worldwide" },
        { value: 24, suffix: "/7", label: "Response Speed" },
      ],
    },
    services: {
      title: "Comprehensive Visa Solutions",
      desc: "Specialized services for every type of travel and international application with the highest professional standards.",
      items: [
        { title: "Tourist Visas", desc: "Streamlined tourism and travel procedures for 150+ destinations worldwide." },
        { title: "Student Visas", desc: "Full support for students to secure university admissions and study visas." },
        { title: "Medical Visas", desc: "Coordinating medical appointments and treatment visas at top global centers." },
        { title: "Work Visas", desc: "Tailored solutions for companies and professionals seeking international work." },
        { title: "Immigration Consultation", desc: "Comprehensive analysis of legal immigration opportunities and pathways." },
        { title: "File Preparation", desc: "Professional preparation of embassy files to ensure the highest approval rates." },
        { title: "Application Follow-up", desc: "Regular updates on your application status and continuous communication with authorities." },
        { title: "Appointment Booking", desc: "Securing embassy and application center appointments as fast as possible." },
      ],
    },
    why: {
      title: "Why Noor Visa?",
      desc: "Proven expertise, full transparency, and results that speak for themselves.",
      items: [
        { title: "A Decade of Expertise", desc: "Ten full years of specialized work in international visa services." },
        { title: "Global Coverage", desc: "Established relationships with embassies in over 50 countries." },
        { title: "Instant Response", desc: "A team available around the clock to answer your inquiries." },
        { title: "Full Transparency", desc: "No hidden fees, no false promises — just the truth from the very first moment." },
      ],
    },
    testimonials: {
      title: "What Our Clients Say",
      items: [
        { quote: "Exceptional professionalism and remarkable speed in obtaining the Schengen visa.", name: "Ahmed Al-Muhandes", role: "Businessman" },
        { quote: "The best office I have dealt with, honesty, integrity, and punctuality.", name: "Sara Ali", role: "Graduate Student" },
        { quote: "They helped me secure my university admission and US visa with ease.", name: "Mohammed Al-Hashimi", role: "University Student" },
      ],
    },
    faq: {
      title: "Frequently Asked Questions",
      desc: "Everything you need to know before getting started.",
      items: [
        { q: "How long does processing take?", a: "It varies by visa type and country, but on average from one to four weeks. We ensure every step is completed as quickly as possible." },
        { q: "Do you guarantee getting the visa?", a: "We guarantee the highest approval rates through professional file preparation, but the final decision remains with the embassy. Our transparency means we tell you upfront about your file's chances." },
        { q: "Which countries do your services cover?", a: "We provide services for over 50 countries worldwide including Europe, USA, Canada, Australia, Asia, and the Gulf." },
        { q: "How do I start with you?", a: "Contact us via WhatsApp for a free consultation, and we will guide you step by step through what suits your case." },
        { q: "Is the first consultation really free?", a: "Absolutely. We provide a comprehensive free first consultation via WhatsApp with no commitment from you." },
      ],
    },
    cta: {
      title: "Start Your International Journey Today",
      desc: "Our team is ready to answer all your inquiries and provide professional advice within minutes.",
      button: "Talk to us now",
      note: "Response in under 15 minutes",
    },
    footer: {
      rights: "© 2026 Noor Visa — All Rights Reserved",
      privacy: "Privacy",
      terms: "Terms",
      contact: "Contact",
    },
    fab: "Chat with us",
    menuOpen: "Open menu",
    menuClose: "Close menu",
  },
} as const;

export type Translations = typeof translations.ar;
