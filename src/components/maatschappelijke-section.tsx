import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Link from 'next/link';
import { CompanyInitiative, CompanyInitiativesSettings } from '@/lib/db/schema';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heart, Users, Leaf, Award, ArrowRight, Target, TrendingUp, BarChart3, CheckCircle } from "lucide-react";

export function MaatschappelijkeSection() {
  const { t, i18n } = useTranslation();

  const { data: initiatives = [], isLoading } = useQuery<CompanyInitiative[]>({
    queryKey: ['/api/company-initiatives'],
  });

  const { data: settings } = useQuery<CompanyInitiativesSettings>({
    queryKey: ['/api/company-initiatives-settings'],
  });
  const isNl = i18n.language === 'nl';

  if (isLoading) {
    return (
      <section className="py-20 bg-muted" data-testid="maatschappelijke-section-loading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="shadow-lg">
                <CardContent className="p-6">
                  <Skeleton className="h-48 w-full mb-4 rounded" />
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

  // Company initiatives are always shown

  const getIcon = (index: number) => {
    const icons = [Heart, Leaf, Users, Award, Target, TrendingUp, BarChart3, CheckCircle];
    const IconComponent = icons[index % icons.length];
    return <IconComponent className="w-6 h-6" />;
  };

  // Dynamic section configuration from admin settings
  const getSectionTitle = () => {
    if (!settings) return t('navigation.maatschappelijke');
    return isNl ? settings.titleNl : settings.titleEn;
  };
  
  const getSectionSubtitle = () => {
    if (!settings) return t('maatschappelijke.ctaDescription');
    return isNl ? settings.descriptionNl : settings.descriptionEn;
  };

  const getSectionClasses = () => "relative py-20 bg-muted";
  const getGridClasses = () => "grid md:grid-cols-2 lg:grid-cols-3 gap-8";
  const getCardClasses = () => "group relative overflow-hidden bg-card/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 motion-safe:hover:-translate-y-2";

  return (
    <>
      <section id="maatschappelijke" className={getSectionClasses()} data-testid="maatschappelijke-section">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" data-testid="text-maatschappelijke-title">
              {getSectionTitle()}
            </h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed opacity-80" data-testid="text-maatschappelijke-subtitle">
              {getSectionSubtitle()}
            </p>
          </div>

          {initiatives.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">{t('maatschappelijke.noContent', 'Content voor deze sectie wordt binnenkort weergegeven.')}</p>
            </div>
          ) : (
            <div className={getGridClasses()}>
              {initiatives.slice(0, 3).map((item, index) => (
                <Card key={item.id} className={getCardClasses()} data-testid={`maatschappelijke-item-${item.id}`}>
                  <div className="relative overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={isNl ? item.titleNl : (item.titleEn || item.titleNl)} className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                    ) : (
                      <div className="w-full h-56 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20">
                        {getIcon(index)}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6 relative">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                      {isNl ? item.titleNl : item.titleEn}
                    </h3>
                    <p className="mb-4 line-clamp-3 leading-relaxed opacity-80">
                      {isNl ? item.descriptionNl : item.descriptionEn}
                    </p>
                    <Button asChild variant="link" className="p-0 text-primary">
                      <Link href={`/maatschappelijke/${item.id}`}>
                        {t('maatschappelijke.learnMore', 'Meer Informatie')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {initiatives.length > 0 && (
            <div className="text-center mt-12">
              <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href="/maatschappelijke">
                  {t('maatschappelijke.ctaButton', 'Doe Mee')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}