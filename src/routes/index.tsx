import { createFileRoute } from "@tanstack/react-router";
import { LanguageProvider } from "@/components/LanguageProvider";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Stats } from "@/components/Stats";
import { Services } from "@/components/Services";
import { WhyUs } from "@/components/WhyUs";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "نور فيزا — استشارات تأشيرات راقية بخبرة عالمية | Noor Visa" },
      {
        name: "description",
        content: "نور فيزا — خبراء التأشيرات والاستشارات الدولية منذ 2014. أكثر من 600 عميل ناجح في 50 دولة. استشارة مجانية عبر واتساب خلال 15 دقيقة.",
      },
      { name: "keywords", content: "نور فيزا, خدمات التأشيرات, استخراج فيزا, تأشيرات سياحية, تأشيرات دراسية, استشارات الهجرة, Noor Visa, visa services" },
      { property: "og:title", content: "نور فيزا — استشارات تأشيرات راقية | Noor Visa" },
      { property: "og:description", content: "خبرة 10 سنوات و+600 عميل ناجح. استشارة مجانية عبر واتساب." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ar_JO" },
      { property: "og:locale:alternate", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "Noor Visa",
          alternateName: "نور فيزا",
          description: "Premium global visa services and immigration consultation.",
          telephone: "+962782727279",
          foundingDate: "2014",
          areaServed: "Worldwide",
          serviceType: ["Tourist Visa", "Student Visa", "Medical Visa", "Work Visa", "Immigration Consultation"],
          aggregateRating: { "@type": "AggregateRating", ratingValue: "5", reviewCount: "600" },
          sameAs: ["https://wa.me/962782727279"],
        }),
      },
    ],
  }),
  component: NoorVisaPage,
});

function NoorVisaPage() {
  return (
    <LanguageProvider>
      <div className="bg-ivory text-ink min-h-screen relative">
        <Nav />
        <main>
          <Hero />
          <Marquee />
          <Stats />
          <Services />
          <WhyUs />
          <Testimonials />
          <FAQ />
          <CTA />
        </main>
        <Footer />
        <WhatsAppFab />
      </div>
    </LanguageProvider>
  );
}
