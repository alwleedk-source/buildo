'use client';

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, Building2, Wrench, Factory, Hammer, ArrowRight } from "lucide-react";
import type { Service } from '@/lib/db/schema';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { slugify } from "@/lib/utils";

export function ServicesPage() {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const currentLang = i18n.language;

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  // SEO optimization
  
  const getIcon = (iconName?: string | null) => {
    switch (iconName) {
      case 'wrench': return <Wrench className="w-8 h-8 text-primary-foreground" />;
      case 'building': return <Building2 className="w-8 h-8 text-primary-foreground" />;
      case 'factory': return <Factory className="w-8 h-8 text-primary-foreground" />;
      case 'hammer': return <Hammer className="w-8 h-8 text-primary-foreground" />;
      default: return <Building2 className="w-8 h-8 text-primary-foreground" />;
    }
  };

  // Filter services based on search query
  const filteredServices = services.filter(service => {
    const title = currentLang === 'en' ? (service.titleEn || service.titleNl) : service.titleNl;
    const description = currentLang === 'en' ? (service.descriptionEn || service.descriptionNl) : service.descriptionNl;
    
    return (
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="border-b bg-muted/50 mt-16">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-6 w-64" />
          </div>
        </div>

        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-2xl mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="shadow-lg">
                <CardContent className="p-6">
                  <Skeleton className="w-12 h-12 mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Navigation breadcrumb */}
      <div className="border-b bg-muted/50 mt-16">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" data-testid="breadcrumb-home">
              <a className="p-0 h-auto text-muted-foreground hover:text-foreground">
                Home
              </a>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">
              {currentLang === 'en' ? 'Services' : 'Diensten'}
            </span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            {currentLang === 'en' ? 'Our Services' : 'Onze Diensten'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {currentLang === 'en'
              ? 'From innovative renovations to sustainable new construction projects - we offer a complete range of professional construction services'
              : 'Van innovatieve renovaties tot duurzame nieuwbouwprojecten - wij bieden een compleet assortiment van professionele bouwdiensten'
            }
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <input
              type="text"
              placeholder={currentLang === 'en' ? 'Search services...' : 'Zoek diensten...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              data-testid="input-search-services"
            />
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 && searchQuery ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {currentLang === 'en' 
                ? `No services found for "${searchQuery}"`
                : `Geen diensten gevonden voor "${searchQuery}"`
              }
            </p>
            <Button
              variant="outline"
              onClick={() => setSearchQuery("")}
              className="mt-4"
              data-testid="button-clear-search"
            >
              {currentLang === 'en' ? 'Clear search' : 'Wis zoekterm'}
            </Button>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {currentLang === 'en' ? 'No services available yet.' : 'Nog geen diensten beschikbaar.'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="services-grid">
            {filteredServices.map((service) => (
              <Card
                key={service.id}
                className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group"
                data-testid={`service-card-${service.slugNl}`}
              >
                {/* Service Icon/Image */}
                <div className="bg-primary p-8 flex justify-center">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={currentLang === 'en' ? (service.titleEn || service.titleNl) : service.titleNl}
                      className="w-16 h-16 object-contain"
                      loading="lazy"
                    />
                  ) : (
                    getIcon(service.icon)
                  )}
                </div>

                <CardContent className="p-6">
                  <Link href={`/services/${service.slugNl || slugify(service.titleNl)}`} rel="nofollow">
                    <a className="cursor-pointer">
                      <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                        {currentLang === 'en' ? (service.titleEn || service.titleNl) : service.titleNl}
                      </h3>
                    </a>
                  </Link>

                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {currentLang === 'en' ? (service.descriptionEn || service.descriptionNl) : service.descriptionNl}
                  </p>

                  <Link href={`/services/${service.slugNl || slugify(service.titleNl)}`} data-testid={`link-service-${service.slugNl}`} rel="nofollow">
                    <Button className="w-full group">
                      {currentLang === 'en' ? 'More Information' : 'Meer Informatie'}
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16 p-8 bg-muted rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            {currentLang === 'en' 
              ? 'Looking for a specific service?'
              : 'Op zoek naar een specifieke service?'
            }
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {currentLang === 'en'
              ? 'Contact us for a no-obligation conversation about your project. Our experts are ready to help you with tailored advice.'
              : 'Neem contact met ons op voor een vrijblijvend gesprek over uw project. Onze experts staan klaar om u te helpen met advies op maat.'
            }
          </p>
          <Link href="/#contact">
            <Button size="lg" data-testid="button-contact-cta">
              {currentLang === 'en' ? 'Get In Touch' : 'Neem Contact Op'}
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}