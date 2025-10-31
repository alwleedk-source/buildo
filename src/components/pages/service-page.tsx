'use client';
import { useSEO } from '@/hooks/useSEO';

import { useQuery } from "@tanstack/react-query";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ChevronRight, Wrench, Building2, Factory, Hammer, Phone, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Service } from '@/lib/db/schema';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export function ServicePage() {
  const { t, i18n } = useTranslation();
  const { slug } = useParams<{ slug: string }>();

  const { data: service, isLoading, error } = useQuery<Service>({
    queryKey: ['/api/services', slug],
    queryFn: async () => {
      const response = await fetch(`/api/services/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Service not found');
        }
        throw new Error('Failed to fetch service');
      }
      return response.json();
    },
    enabled: !!slug
  });

  // Determine language once
  const isNl = i18n.language === 'nl';
  const title = isNl ? service?.titleNl : service?.titleEn;
  const description = isNl ? service?.descriptionNl : service?.descriptionEn;

  // SEO optimization with service data
  useSEO({
    title: title ? `${title} | ${t('site.title')}` : t('services.page.loading'),
    description: description || t('services.page.defaultDescription'),
    keywords: title ? `${title}, ${t('services.page.keywords')}` : t('services.page.keywords'),
    type: 'website',
  });

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'wrench': return <Wrench className="w-12 h-12 text-primary" />;
      case 'building': return <Building2 className="w-12 h-12 text-primary" />;
      case 'factory': return <Factory className="w-12 h-12 text-primary" />;
      case 'hammer': return <Hammer className="w-12 h-12 text-primary" />;
      default: return <Building2 className="w-12 h-12 text-primary" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        {/* Breadcrumb Skeleton */}
        <div className="border-b bg-muted/50 mt-16">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-6 w-64" />
          </div>
        </div>

        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-3/4 mb-8" />
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <Skeleton className="h-8 w-32 mb-4" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-3/4 mb-8" />
                <Skeleton className="h-10 w-32" />
              </div>
              <div>
                <Skeleton className="w-full h-64" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-foreground">{t('services.service.notFound')}</h1>
            <p className="text-muted-foreground mb-8">{t('services.service.notFoundDescription')}</p>
            <Link href="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('services.service.backToHome')}
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Navigation breadcrumb */}
        <div className="border-b bg-muted/50 mt-16">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link href="/" data-testid="breadcrumb-home">
                <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
                  {t('navigation.home')}
                </Button>
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">{title}</span>
            </nav>
          </div>
        </div>

        {/* Service Content */}
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            {/* Back to Home */}
            <Link href="/">
              <Button variant="ghost" className="mb-8 -ml-4" data-testid="button-back-to-home">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('services.service.backToHome')}
              </Button>
            </Link>

            {/* Service Header */}
            <div className="text-center mb-16">
              <div className="flex justify-center mb-6" data-testid="service-icon">
                {getIcon(service.icon || undefined)}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground" data-testid="service-title">
                {title}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="service-description">
                {description}
              </p>
            </div>

            {/* Service Details */}
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="text-2xl font-bold mb-6 text-foreground">{t('services.service.details')}</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">{t('services.service.professional')}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">{t('services.service.quality')}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">{t('services.service.warranty')}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">{t('services.service.support')}</p>
                  </div>
                </div>
              </div>

              {/* Service Image */}
              <div>
                {service.image ? (
                  <img
                    src={service.image}
                    alt={title}
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                    data-testid="service-image"
                  />
                ) : (
                  <div className="w-full h-64 bg-muted rounded-lg shadow-lg flex items-center justify-center">
                    {getIcon(service.icon || undefined)}
                  </div>
                )}
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-muted/50 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4 text-foreground">{t('services.service.interested')}</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                {t('services.service.contactDescription')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/#contact">
                  <Button size="lg" data-testid="button-contact-us">
                    <Phone className="w-4 h-4 mr-2" />
                    {t('contact.title')}
                  </Button>
                </Link>
                <Button variant="outline" size="lg" data-testid="button-request-quote">
                  <Mail className="w-4 h-4 mr-2" />
                  {t('services.service.requestQuote')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}