'use client';

import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle } from "lucide-react";
import type { AboutContent, AboutUsPage } from '@/lib/db/schema';

export function AboutSection() {
  const { data: aboutContent, isLoading } = useQuery<AboutContent>({
    queryKey: ['/api/about'],
  });
  
  // Check if About Us page is active to show/hide "Meer Over Ons" button
  const { data: aboutUsPage } = useQuery<AboutUsPage>({
    queryKey: ['/api/about-us'],
  });
  
  const { i18n } = useTranslation();

  if (isLoading) {
    return (
      <section className="py-20" data-testid="about-section-loading">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-32 w-full" />
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Skeleton className="w-6 h-6 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Skeleton className="w-6 h-6 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-12 w-48" />
            </div>
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  const defaultContent = {
    titleNl: "Over Ons Bedrijf",
    titleEn: "About Our Company",
    descriptionNl: "Een verhaal van vakmanschap en excellentie in de bouwwereld. Bij BuildIt Professional staan kwaliteit, innovatie en duurzaamheid centraal in alles wat we doen. Met meer dan 20 jaar ervaring in de bouwsector hebben we een reputatie opgebouwd als betrouwbare partner voor diverse bouwprojecten.",
    descriptionEn: "A story of craftsmanship and excellence in the construction world. At BuildIt Professional, quality, innovation and sustainability are central to everything we do. With more than 20 years of experience in the construction sector, we have built a reputation as a reliable partner for various construction projects.",
    featuresNl: [
      {
        title: "Kwaliteitsgarantie",
        description: "Rigoureuze kwaliteitscontrole in elke projectfase"
      },
      {
        title: "Duurzame Praktijken", 
        description: "Milieuverantwoordelijkheid in al onze activiteiten"
      }
    ],
    featuresEn: [
      {
        title: "Quality Assurance",
        description: "Rigorous quality control in every project phase"
      },
      {
        title: "Sustainable Practices", 
        description: "Environmental responsibility in all our operations"
      }
    ],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  };

  const content = aboutContent || defaultContent;
  const isNl = i18n.language === 'nl';
  
  // Get current language content
  const title = isNl ? content.titleNl : content.titleEn;
  const description = isNl ? content.descriptionNl : content.descriptionEn;
  const features = isNl 
    ? (Array.isArray(content.featuresNl) ? content.featuresNl : defaultContent.featuresNl)
    : (Array.isArray(content.featuresEn) ? content.featuresEn : defaultContent.featuresEn);

  return (
    <section id="about" className="py-20" data-testid="about-section">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground" data-testid="text-about-title">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-about-description">
              {description}
            </p>
            <div className="space-y-4" data-testid="about-features">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3" data-testid={`feature-${index}`}>
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center mt-1">
                    <CheckCircle className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground" data-testid={`feature-title-${index}`}>
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground" data-testid={`feature-description-${index}`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Only show "Meer Over Ons" button if About Us page is active */}
            {aboutUsPage?.isActive && (
              <Button 
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors" 
                onClick={() => window.open('/about-us', '_blank')}
                data-testid="button-learn-more"
              >
                {isNl ? "Meer Over Ons" : "Learn More About Us"}
              </Button>
            )}
          </div>
          <div className="relative">
            <img
              src={content.image || defaultContent.image}
              alt="About our company"
              className="rounded-2xl shadow-2xl w-full"
              data-testid="img-about"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
