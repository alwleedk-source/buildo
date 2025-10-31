'use client';

import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { StatisticsSection } from '@/components/statistics-section';
import { AboutSection } from '@/components/about-section';
import { ServicesSection } from '@/components/services-section';
import { ProjectsSection } from '@/components/projects-section';
import { BlogSection } from '@/components/blog-section';
import { PartnersSection } from '@/components/partners-section';
import { TestimonialsSection } from '@/components/testimonials-section';
import { ContactSection } from '@/components/contact-section';
import { MaatschappelijkeSection } from '@/components/maatschappelijke-section';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { SectionSetting } from '@/lib/db/schema';

export function HomePage() {
  const { t, i18n } = useTranslation();
  const { data: sectionSettings = [], isLoading } = useQuery<SectionSetting[]>({
    queryKey: ['/api/section-settings'],
  });

  // SEO optimization with structured data for homepage
  const isNl = i18n.language === 'nl';
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BouwMeesters Amsterdam BV",
    "url": typeof window !== 'undefined' ? window.location.origin : '',
    "logo": typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : '',
    "description": t('site.description'),
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Amsterdam",
      "addressCountry": "NL"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["Dutch", "English"]
    },
    "areaServed": {
      "@type": "Place",
      "name": "Amsterdam and Netherlands"
    },
    "serviceType": ["Construction", "Renovation", "Building Maintenance", "Commercial Construction"],
    "knowsAbout": ["Construction", "Architecture", "Building", "Renovation", "Infrastructure"],
    "sameAs": [
      "https://www.linkedin.com/company/bouwmeesters-amsterdam",
      "https://www.facebook.com/bouwmeestersamsterdam"
    ]
  };

  // Use SEO hook without custom title to display only site name
  
  // Map section keys to their components
  const getSectionComponent = (sectionKey: string) => {
    switch (sectionKey) {
      case 'hero':
        return <HeroSection key="hero" />;
      case 'statistics':
        return <StatisticsSection key="statistics" />;
      case 'about':
        return <AboutSection key="about" />;
      case 'services':
        return <ServicesSection key="services" />;
      case 'projects':
        return <ProjectsSection key="projects" />;
      case 'blog':
        return <BlogSection key="blog" />;
      case 'partners':
        return <PartnersSection key="partners" />;
      case 'testimonials':
        return (
          <section key="testimonials" className="py-20 bg-muted">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center mb-16 text-primary">
                Wat Onze Klanten Zeggen
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    name: "Emma V.",
                    text: "Ik ben zeer tevreden met de service die ik heb ontvangen. Het team was professioneel, vriendelijk en heeft al mijn verwachtingen overtroffen.",
                    rating: 5
                  },
                  {
                    name: "Marcus H.", 
                    text: "Fantastische ervaring van begin tot eind! De communicatie was helder, het proces was transparant en het eindresultaat overtrof mijn verwachtingen.",
                    rating: 5
                  },
                  {
                    name: "Sophie M.",
                    text: "Wat een geweldige service! Vanaf het eerste contact voelde ik me gehoord en begrepen. Het team was niet alleen vakkundig maar ook zeer toegankelijk.",
                    rating: 5
                  }
                ].map((testimonial, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-lg">★</span>
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                    <div className="font-semibold text-primary">{testimonial.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      case 'contact':
        return <ContactSection key="contact" />;
      case 'maatschappelijke':
        return <MaatschappelijkeSection key="maatschappelijke" />;
      case 'company-initiatives':
        // Company initiatives section - placeholder for now
        return null;
      default:
        return null;
    }
  };

  // Filter visible sections and sort by order
  const visibleSections = sectionSettings
    .filter(section => section.isVisible)
    .sort((a, b) => a.order - b.order);




  // Create key to force re-render when sections change
  const sectionsKey = visibleSections.map(s => `${s.sectionKey}-${s.order}`).join(',');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="fixed bottom-6 right-6 z-50">
        <Link href="/admin" data-testid="link-admin">
          <Button size="lg" className="shadow-lg" data-testid="button-admin-access">
            <Settings className="w-5 h-5 mr-2" />
            Admin
          </Button>
        </Link>
      </div>
      {isLoading ? (
        // Show full-screen loading to prevent any section from appearing
        <main className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
      ) : (
        <>
          
          <main key={sectionsKey}>
            {visibleSections.map(section => getSectionComponent(section.sectionKey))}
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}
