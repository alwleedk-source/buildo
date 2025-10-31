'use client';

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { Partner, PartnersSettings } from '@/lib/db/schema';

export function PartnersSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { i18n } = useTranslation();
  
  const { data: partners = [], isLoading: partnersLoading } = useQuery<Partner[]>({
    queryKey: ['/api/partners'],
  });

  const { data: settings, isLoading: settingsLoading } = useQuery<PartnersSettings>({
    queryKey: ['/api/partners-settings'],
  });

  const isLoading = partnersLoading || settingsLoading;
  const isNl = i18n.language === 'nl';

  if (isLoading) {
    return (
      <section className="py-20 bg-muted" data-testid="partners-section-loading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-16 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6 shadow-sm">
                <div className="text-center">
                  <Skeleton className="w-16 h-16 mx-auto mb-4" />
                  <Skeleton className="h-4 w-20 mx-auto mb-1" />
                  <Skeleton className="h-3 w-16 mx-auto mb-1" />
                  <Skeleton className="h-3 w-12 mx-auto" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const defaultPartners: Partner[] = [
    {
      id: '1',
      name: 'Green Materials Co',
      descriptionNl: null,
      descriptionEn: null,
      logo: null,
      categoryNl: 'Materialen',
      categoryEn: 'Materials',
      website: null,
      since: 'Sinds 2021',
      order: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Safety First Ltd',
      descriptionNl: null,
      descriptionEn: null,
      logo: null,
      categoryNl: 'Veiligheid',
      categoryEn: 'Safety',
      website: null,
      since: 'Sinds 2019',
      order: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'Tech Solutions BV',
      descriptionNl: null,
      descriptionEn: null,
      logo: null,
      categoryNl: 'Technologie',
      categoryEn: 'Technology',
      website: null,
      since: 'Sinds 2020',
      order: 2,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4',
      name: 'EcoDesign Studio',
      descriptionNl: null,
      descriptionEn: null,
      logo: null,
      categoryNl: 'Architectuur',
      categoryEn: 'Architecture',
      website: null,
      since: 'Sinds 2018',
      order: 3,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const displayPartners = partners.length > 0 ? partners : defaultPartners;

  // Get background style classes
  const getBackgroundClasses = () => {
    if (!settings) return "bg-muted";
    switch (settings.backgroundStyle) {
      case "white": return "bg-background";
      case "primary": return "bg-primary/5";
      case "gradient": return "bg-gradient-to-br from-primary/5 to-muted/50";
      default: return "bg-muted";
    }
  };

  // Get card style classes
  const getCardClasses = (baseClasses: string) => {
    if (!settings) return baseClasses;
    switch (settings.cardStyle) {
      case "minimal": return cn(baseClasses, "border-none shadow-none bg-transparent");
      case "elevated": return cn(baseClasses, "shadow-lg hover:shadow-xl");
      case "bordered": return cn(baseClasses, "border-2 border-primary/20");
      default: return baseClasses;
    }
  };

  // Get grid classes based on items per row
  const getGridClasses = () => {
    if (!settings || settings.displayStyle !== "grid") return "grid grid-cols-2 md:grid-cols-4 gap-8";
    const cols = settings.itemsPerRow || 4;
    return `grid grid-cols-2 md:grid-cols-${Math.min(cols, 6)} gap-8`;
  };

  // Carousel navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(displayPartners.length / 3));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(displayPartners.length / 3)) % Math.ceil(displayPartners.length / 3));
  };

  // Render partner card
  const renderPartnerCard = (partner: Partner) => {
    const baseCardClasses = "rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center";
    const cardClasses = getCardClasses(baseCardClasses);

    return (
      <Card
        key={partner.id}
        className={cardClasses}
        data-testid={`partner-card-${partner.id}`}
      >
        <CardContent className="p-0">
          {settings?.showLogos && (
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
              {partner.logo ? (
                <img 
                  src={partner.logo} 
                  alt={`${partner.name} logo`} 
                  className="w-12 h-12 object-contain rounded"
                  data-testid={`partner-logo-${partner.id}`}
                />
              ) : (
                <div className="text-xs text-muted-foreground">LOGO</div>
              )}
            </div>
          )}
          <h3 className="font-semibold text-card-foreground text-sm" data-testid={`partner-name-${partner.id}`}>
            {partner.name}
          </h3>
          {settings?.showCategories && (
            <p className="text-xs text-muted-foreground mt-1" data-testid={`partner-category-${partner.id}`}>
              {isNl ? (partner.categoryNl || partner.categoryEn) : (partner.categoryEn || partner.categoryNl)}
            </p>
          )}
          {settings?.showSince && (
            <p className="text-xs text-muted-foreground" data-testid={`partner-since-${partner.id}`}>
              {partner.since}
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  // Render partners based on display style
  const renderPartners = () => {
    if (!settings) return null;

    switch (settings.displayStyle) {
      case "list":
        return (
          <div className="space-y-4">
            {displayPartners.map(renderPartnerCard)}
          </div>
        );
      
      case "carousel":
        const itemsPerSlide = 3;
        const totalSlides = Math.ceil(displayPartners.length / itemsPerSlide);
        
        return (
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: totalSlides }, (_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {displayPartners
                        .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                        .map(renderPartnerCard)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {totalSlides > 1 && (
              <div className="flex justify-center mt-8 gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevSlide}
                  className="rounded-full w-10 h-10 p-0"
                  data-testid="carousel-prev"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextSlide}
                  className="rounded-full w-10 h-10 p-0"
                  data-testid="carousel-next"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        );
      
      case "minimal":
        return (
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {displayPartners.map((partner) => (
              <div key={partner.id} className="text-center">
                {settings.showLogos && partner.logo && (
                  <img 
                    src={partner.logo} 
                    alt={`${partner.name} logo`} 
                    className="w-20 h-20 object-contain mx-auto mb-2"
                    data-testid={`partner-logo-${partner.id}`}
                  />
                )}
                <h3 className="font-medium text-sm" data-testid={`partner-name-${partner.id}`}>
                  {partner.name}
                </h3>
              </div>
            ))}
          </div>
        );
      
      default: // grid
        return (
          <div className={getGridClasses()}>
            {displayPartners.map(renderPartnerCard)}
          </div>
        );
    }
  };

  return (
    <section className={`py-20 ${getBackgroundClasses()}`} data-testid="partners-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-partners-title">
            {isNl 
              ? (settings?.titleNl || "Onze Partners")
              : (settings?.titleEn || "Our Partners")
            }
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-partners-subtitle">
            {isNl 
              ? (settings?.descriptionNl || "Samen bouwen we een betere toekomst. We werken samen met betrouwbare partners om de beste service en kwaliteit te bieden. Ontdek de bedrijven waar we mee samenwerken voor innovatieve bouwoplossingen.")
              : (settings?.descriptionEn || "Together we build a better future. We work with reliable partners to provide the best service and quality. Discover the companies we partner with for innovative construction solutions.")
            }
          </p>
        </div>
        
        {renderPartners()}
        
        {settings?.showCta && (
          <div className="text-center mt-12">
            <p className="text-lg font-semibold text-foreground mb-6" data-testid="text-partnership-cta">
              {isNl 
                ? (settings?.ctaTitleNl || "Geïnteresseerd in samenwerking?")
                : (settings?.ctaTitleEn || "Interested in partnership?")
              }
            </p>
            <p className="text-muted-foreground mb-8" data-testid="text-partnership-description">
              {isNl 
                ? (settings?.ctaDescriptionNl || "Ontdek hoe we samen kunnen groeien en succesvol kunnen zijn in de bouwsector.")
                : (settings?.ctaDescriptionEn || "Discover how we can grow together and be successful in the construction sector.")
              }
            </p>
            <Button
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              data-testid="button-contact-partnership"
            >
              {isNl 
                ? (settings?.ctaButtonTextNl || "Neem Contact Op")
                : (settings?.ctaButtonTextEn || "Contact Us")
              }
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
