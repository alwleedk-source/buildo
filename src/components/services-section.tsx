import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Wrench, Factory, Hammer } from "lucide-react";
import Link from 'next/link';
import { useTranslation } from "react-i18next";
import { slugify } from "@/lib/utils";
import type { Service } from '@/lib/db/schema';

export function ServicesSection() {
  const { t } = useTranslation();
  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ['/api/services'],
    queryFn: async () => {
      const res = await fetch('/api/services');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'wrench': return <Wrench className="w-6 h-6 text-primary-foreground" />;
      case 'building': return <Building2 className="w-6 h-6 text-primary-foreground" />;
      case 'factory': return <Factory className="w-6 h-6 text-primary-foreground" />;
      case 'hammer': return <Hammer className="w-6 h-6 text-primary-foreground" />;
      default: return <Building2 className="w-6 h-6 text-primary-foreground" />;
    }
  };

  if (isLoading) {
    return (
      <section className="py-20" data-testid="services-section-loading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="shadow-lg">
                <CardContent className="p-6">
                  <Skeleton className="w-12 h-12 mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const defaultServices = [
    {
      id: '1',
      titleNl: 'Renovatie',
      titleEn: 'Renovation',
      descriptionNl: 'Korte beschrijving van renovatiediensten en expertise',
      descriptionEn: 'Brief description of renovation services and expertise',
      icon: 'wrench',
      image: null,
      slugNl: 'renovatie',
      slugEn: 'renovation',
      order: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      titleNl: 'Woningbouw',
      titleEn: 'Residential Construction',
      descriptionNl: 'Moderne woningbouw met focus op duurzaamheid en kwaliteit',
      descriptionEn: 'Modern residential construction with focus on sustainability and quality',
      icon: 'building',
      image: null,
      slugNl: 'woningbouw',
      slugEn: 'residential-construction',
      order: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      titleNl: 'Commerciële Projecten',
      titleEn: 'Commercial Projects',
      descriptionNl: 'Zakelijke bouwprojecten die impact maken en functioneren',
      descriptionEn: 'Business construction projects that make an impact and function',
      icon: 'factory',
      image: null,
      slugNl: 'commerciele-projecten',
      slugEn: 'commercial-projects',
      order: 2,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4',
      titleNl: 'Infrastructuur & Civiel',
      titleEn: 'Infrastructure & Civil',
      descriptionNl: 'Robuuste infrastructuur voor gemeenschappen en bedrijven',
      descriptionEn: 'Robust infrastructure for communities and businesses',
      icon: 'hammer',
      image: null,
      slugNl: 'infrastructuur-civiel',
      slugEn: 'infrastructure-civil',
      order: 3,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  return (
    <section id="services" className="py-20" data-testid="section-services">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            <Link href="/services" className="hover:text-primary transition-colors">
              {t('services.title')}
            </Link>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-services-subtitle">
            {t('services.description')}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((service) => (
            <Card
              key={service.id}
              className="shadow-lg hover:shadow-xl transition-shadow border border-border"
              data-testid={`service-card-${service.id}`}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  {getIcon(service.icon || undefined)}
                </div>
                <Link href={`/services/${service.slugNl || slugify(service.titleNl || 'service')}`} className="cursor-pointer">
                  <h3 className="text-xl font-semibold text-card-foreground mb-3 hover:text-primary transition-colors" data-testid={`service-title-${service.id}`}>
                    {service.titleNl || 'Service Title'}
                  </h3>
                </Link>
                <p className="text-muted-foreground mb-4" data-testid={`service-description-${service.id}`}>
                  {service.descriptionNl || 'Service description'}
                </p>
                <Link
                  href={`/services/${service.slugNl || slugify(service.titleNl || 'service')}`}
                  className="text-primary font-medium hover:text-primary/80 transition-colors inline-flex items-center"
                  data-testid={`service-link-${service.id}`}
                  rel="nofollow"
                >
                  {t('common.learnMore')} →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}