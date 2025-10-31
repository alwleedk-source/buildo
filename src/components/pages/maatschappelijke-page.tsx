'use client';
import { useSEO } from '@/hooks/useSEO';

import { useQuery } from "@tanstack/react-query";
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatisticsSection } from '@/components/statistics-section';
import { MaatschappelijkeStatisticsSection } from '@/components/maatschappelijke-statistics-section';
import {
  ArrowRight,
  Heart,
  Users,
  TreePine,
  Building,
  Target,
  Award,
  Calendar,
  MapPin
} from "lucide-react";
import { CompanyInitiative, CompanyInitiativesSettings, Statistic } from '@/lib/db/schema';

export function MaatschappelijkePage() {
  // Fetch content data - show ALL initiatives
  const { data: content = [], isLoading: isLoadingContent } = useQuery<CompanyInitiative[]>({
    queryKey: ["/api/company-initiatives"],
  });

  // Fetch settings data
  const { data: settings, isLoading: isLoadingSettings } = useQuery<CompanyInitiativesSettings>({
    queryKey: ["/api/company-initiatives-settings"],
  });

  const isLoading = isLoadingContent || isLoadingSettings;

  // SEO optimization for maatschappelijke page - use dynamic settings
  useSEO({
    title: settings?.metaTitleNl || "Maatschappelijke Verantwoordelijkheid | BuildIt Professional",
    description: settings?.metaDescriptionNl || "Ontdek onze maatschappelijke initiatieven voor duurzaamheid, gemeenschapsbetrokkenheid en sociale verantwoordelijkheid. Samen bouwen we aan een betere toekomst.",
    keywords: "maatschappelijke verantwoordelijkheid, duurzaamheid, CSR, gemeenschapsbetrokkenheid, sociale impact, milieu, bouwsector",
    type: 'website',
    image: settings?.ogImage || undefined,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": settings?.titleNl || "Maatschappelijke Verantwoordelijkheid",
      "description": settings?.descriptionNl || "Onze maatschappelijke initiatieven en CSR-programma's",
      "url": `${window.location.origin}/maatschappelijke`,
      "inLanguage": "nl-NL",
      "mainEntity": {
        "@type": "Organization",
        "@id": `${window.location.origin}/#organization`,
        "name": "BuildIt Professional",
        "description": "Bouwbedrijf met focus op maatschappelijke verantwoordelijkheid"
      }
    }
  });

  // Icon mapping for initiatives
  const getInitiativeIcon = (index: number) => {
    const icons = [Heart, TreePine, Users, Award, Building, Target];
    const colors = ["text-green-600", "text-blue-600", "text-purple-600", "text-orange-600", "text-red-600", "text-indigo-600"];
    return { 
      icon: icons[index % icons.length], 
      color: colors[index % colors.length] 
    };
  };

  // Show ALL content, not just featured
  const allContent = content.filter(item => item.isActive !== false);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-gray-50 pt-20 pb-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-green-600 transition-colors duration-200">
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">
                {settings?.titleNl || "Maatschappelijke Verantwoordelijkheid"}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Section - Simplified */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900" data-testid="title-main">
                {settings?.titleNl || "Maatschappelijke Verantwoordelijkheid"}
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto" data-testid="subtitle-main">
                {settings?.descriptionNl || "Samen bouwen we aan een duurzamere en verantwoordelijke toekomst."}
              </p>
              {settings?.heroButtonTextNl && (
                <Link href={settings?.heroButtonUrlNl || "/contact"}>
                  <Button
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    data-testid="button-hero-cta"
                  >
                    {settings.heroButtonTextNl}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Statistics Section with Full Admin Controls */}
        {(settings?.showStatistics ?? true) && (
          <StatisticsSection />
        )}

        {/* Maatschappelijke Impact Statistics */}
        <MaatschappelijkeStatisticsSection />

        {/* All Initiatives - Main Content */}
        {(settings?.showInitiatives ?? true) && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="title-initiatives">
                  {settings?.initiativesTitleNl || "Onze Maatschappelijke Initiatieven"}
                </h2>
                {settings?.initiativesDescriptionNl && (
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    {settings.initiativesDescriptionNl}
                  </p>
                )}
              </div>

              {allContent.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Er zijn momenteel geen actieve initiatieven.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {allContent.map((item, index) => {
                    const { icon: IconComponent, color } = getInitiativeIcon(index);
                    return (
                      <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md" data-testid={`initiative-card-${item.id}`}>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center`}>
                              <IconComponent className={`h-5 w-5 ${color}`} />
                            </div>
                            <Badge variant="secondary" className="text-xs" data-testid={`badge-category-${item.id}`}>
                              {item.category || 'Initiative'}
                            </Badge>
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                            {item.titleNl}
                          </h3>
                          
                          <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                            {item.descriptionNl}
                          </p>
                          
                          {item.image && (
                            <div className="w-full h-32 mb-4 rounded-lg overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.titleNl}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('nl-NL') : 'Unknown'}</span>
                            </div>
                            <Link href={`/maatschappelijke/${item.id}`}>
                              <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700" data-testid={`button-read-more-${item.id}`}>
                                Meer lezen
                                <ArrowRight className="ml-1 h-3 w-3" />
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Call to Action - Simplified */}
        {(settings?.showCallToAction ?? true) && (settings?.ctaTitleNl || settings?.ctaDescriptionNl) && (
          <section className="py-12 bg-gray-100">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center">
                {settings?.ctaTitleNl && (
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900" data-testid="title-cta">
                    {settings.ctaTitleNl}
                  </h2>
                )}
                {settings?.ctaDescriptionNl && (
                  <p className="text-gray-600 mb-6">
                    {settings.ctaDescriptionNl}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {settings?.ctaButtonTextNl && (
                    <Link href={settings?.ctaButtonUrlNl || "/contact"}>
                      <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" data-testid="button-get-involved">
                        {settings.ctaButtonTextNl}
                      </Button>
                    </Link>
                  )}
                  {settings?.learnMoreTextNl && (
                    <Link href={settings?.learnMoreUrlNl || "/about-us"}>
                      <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white" data-testid="button-learn-more-cta">
                        {settings.learnMoreTextNl}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
      <Footer />
    </>
  );
}