'use client';

import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import type { AboutUsPage } from '@/lib/db/schema';

export function AboutUsPage() {
  const { data: aboutUsContent, isLoading } = useQuery<AboutUsPage>({
    queryKey: ['/api/about-us'],
  });
  const { i18n } = useTranslation();
  const router = useRouter();

  // Prepare SEO data (hooks must be called before any return statements)
  const isNl = i18n.language === 'nl';
  const title = isNl ? (aboutUsContent?.titleNl || 'Over Ons') : (aboutUsContent?.titleEn || 'About Us');
  const subtitle = isNl ? (aboutUsContent?.subtitleNl || '') : (aboutUsContent?.subtitleEn || '');
  const metaTitle = isNl ? (aboutUsContent?.metaTitleNl || title) : (aboutUsContent?.metaTitleEn || title);
  const metaDescription = isNl ? (aboutUsContent?.metaDescriptionNl || subtitle) : (aboutUsContent?.metaDescriptionEn || subtitle);

  // SEO optimization (must be called before any conditional returns)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
      "@type": "Organization",
      "name": "BuildIt Professional",
      "url": typeof window !== 'undefined' ? window.location.origin : '',
      "description": metaDescription || subtitle || '',
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "NL"
      },
      "areaServed": "Netherlands",
      "serviceType": ["Construction", "Renovation", "Building Maintenance"]
    }
  };

  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section Skeleton */}
        <div className="relative h-96 bg-muted">
          <Skeleton className="absolute inset-0" />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center space-y-4">
              <Skeleton className="h-12 w-96 mx-auto" />
              <Skeleton className="h-6 w-64 mx-auto" />
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!aboutUsContent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Page Not Found</h1>
          <p className="text-muted-foreground">The about us page content is not available.</p>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Get final content values
  const content = isNl ? (aboutUsContent?.contentNl || '') : (aboutUsContent?.contentEn || '');

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div 
        className="relative h-96 bg-muted bg-cover bg-center"
        style={{
          backgroundImage: aboutUsContent.heroImage 
            ? `url(${aboutUsContent.heroImage})` 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex items-center justify-center text-center text-white">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4" data-testid="text-page-title">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl md:text-2xl text-gray-200" data-testid="text-page-subtitle">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="container mx-auto px-4 py-6 border-b border-border">
        <Button 
          variant="ghost" 
          onClick={() => setLocation('/')}
          className="text-muted-foreground hover:text-foreground"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {isNl ? "Terug naar Home" : "Back to Home"}
        </Button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div 
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
            data-testid="about-us-content"
          />

          {/* Gallery Section */}
          {aboutUsContent.gallery && Array.isArray(aboutUsContent.gallery) && aboutUsContent.gallery.length > 0 ? (
            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                {isNl ? "Galerij" : "Gallery"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aboutUsContent.gallery.map((image: string, index: number) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-shadow"
                      data-testid={`gallery-image-${index}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Additional Info Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg border border-border text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-card-foreground">
                {isNl ? "Ons Team" : "Our Team"}
              </h3>
              <p className="text-muted-foreground">
                {isNl 
                  ? "Ervaren professionals die zich inzetten voor uw project" 
                  : "Experienced professionals dedicated to your project"
                }
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border text-center">
              <Calendar className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-card-foreground">
                {isNl ? "Ervaring" : "Experience"}
              </h3>
              <p className="text-muted-foreground">
                {isNl 
                  ? "Meer dan 20 jaar ervaring in de bouwsector" 
                  : "Over 20 years of experience in construction"
                }
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border text-center">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-card-foreground">
                {isNl ? "Locatie" : "Location"}
              </h3>
              <p className="text-muted-foreground">
                {isNl 
                  ? "Actief in heel Nederland" 
                  : "Active throughout the Netherlands"
                }
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center bg-primary/5 p-8 rounded-lg border border-primary/20">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              {isNl ? "Klaar om te beginnen?" : "Ready to get started?"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isNl 
                ? "Neem contact met ons op voor een vrijblijvende offerte" 
                : "Contact us for a free quote"
              }
            </p>
            <Button 
              size="lg"
              onClick={() => setLocation('/#contact')}
              data-testid="button-contact-cta"
            >
              {isNl ? "Contact Opnemen" : "Get In Touch"}
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}