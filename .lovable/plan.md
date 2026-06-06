# Noor Visa — خطة التنفيذ

موقع فاخر ثنائي اللغة (عربي افتراضي RTL + إنجليزي) لخدمات التأشيرات باتجاه **Sovereign Ledger**: ألوان أونيكس/فحمي مع ذهبي ناعم، خطوط IBM Plex Sans Arabic + Inter + JetBrains Mono، شبكة خدمات بخطوط شعرية، بورتريه مؤطر بالذهبي، أنيميشن في كل قسم، **مُحسَّن للجوال 100%**.

## النطاق

- **اللغة الافتراضية:** عربي (RTL)، مع زر تبديل إلى الإنجليزي يغير `dir` والمحتوى مع انتقال ناعم.
- **الصورة الشخصية:** صورتك المرفوعة في الهيرو (مؤطرة بإطار ذهبي + شارة "+600 عميل").
- **زر واتساب:** `https://wa.me/962782727279` في كل CTA + زر عائم ثابت.
- بدون باكند — موقع تسويقي صرف، حالة اللغة في `localStorage`.

## التركيز على الجوال (Mobile-First)

- الهيرو يتكدس عمودياً على الجوال (نص فوق الصورة)، أحجام خطوط متدرجة (`text-4xl` على الجوال → `text-7xl` على الديسكتوب).
- شبكة الخدمات: عمود واحد على الجوال → عمودان على التابلت → أربعة على الديسكتوب.
- نَفّ الموبايل: قائمة hamburger منزلقة مع زر واتساب بارز.
- الإحصائيات: شبكة 2×2 على الجوال.
- زر واتساب العائم محسّن لإبهام الجوال (حجم كبير، أسفل اليسار).
- اختبار فعلي على viewport جوال أثناء البناء.

## الأنيميشن في كل قسم

- `fadeInUp` على ظهور كل قسم عبر IntersectionObserver (مكوّن `Reveal`).
- عدادات متحركة (count-up) في قسم الإحصائيات.
- shimmer ذهبي على زر CTA الرئيسي.
- hover: تغيير لون الحدود إلى ذهبي + رفع بسيط للبطاقات.
- نقطة نبض حية في شارة "خبير التأشيرات الأول".
- انتقال ناعم بين الألوان عند تبديل اللغة.
- accordion ناعم للأسئلة الشائعة.
- تأخير متسلسل (stagger) على بطاقات الخدمات والإحصائيات.

## التوكنز (src/styles.css)

- `:root`: `--onyx #0A0A0A`، `--charcoal #141414`، `--gold #C5A059`، `--gold-muted #8C7345`، stone scale.
- `@theme inline`: تسجيل `--color-onyx`، `--color-charcoal`، `--color-gold`، `--font-arabic`، `--font-sans`، `--font-mono`.
- keyframes: `fadeInUp`، `shimmer`، `pulse-gold`.
- utilities: `.animate-reveal`، `.shimmer-gold`.

## الملفات الجديدة

- `src/routes/__root.tsx` — تحميل خطوط Google عبر `<link>`، SEO افتراضي، JSON-LD لـ Organization.
- `src/routes/index.tsx` — استبدال placeholder بالصفحة الكاملة + SEO كامل (LocalBusiness JSON-LD).
- `src/components/LanguageProvider.tsx` — Context + localStorage + تطبيق `dir`/`lang` على `<html>`.
- `src/components/translations.ts` — قاموس AR/EN لكل النصوص.
- `src/components/LangToggle.tsx` — زر AR/EN.
- `src/components/Nav.tsx` — نَفّ ثابت زجاجي + قائمة جوال منزلقة.
- `src/components/Hero.tsx` — العنوان + الفقرة + الصورة المؤطرة + الشارة.
- `src/components/Stats.tsx` — 4 عدادات متحركة.
- `src/components/Services.tsx` — 8 بطاقات خدمات بأيقونات Lucide.
- `src/components/WhyUs.tsx` — 4 ركائز ثقة.
- `src/components/Testimonials.tsx` — 3 شهادات.
- `src/components/FAQ.tsx` — accordion بـ 5 أسئلة.
- `src/components/CTA.tsx` — كرت ذهبي كبير بزر واتساب.
- `src/components/Footer.tsx` — تذييل أنيق.
- `src/components/WhatsAppFab.tsx` — زر واتساب عائم ثابت.
- `src/components/Reveal.tsx` — مكوّن ظهور بـ IntersectionObserver.
- `src/components/Counter.tsx` — عدّاد متحرك.

## SEO

- العنوان: "نور فيزا — خدمات تأشيرات احترافية | Noor Visa"
- الوصف: استشارة مجانية، 10 سنوات خبرة، 600 عميل عالمياً.
- كلمات مفتاحية: خدمات التأشيرات، استخراج فيزا، تأشيرات سياح