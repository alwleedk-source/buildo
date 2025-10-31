'use client';

import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Shield, Cookie } from "lucide-react";
import { LegalPage } from '@/lib/db/schema';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export function LegalPagePage() {
  const { i18n } = useTranslation();
  const [, params] = useRoute('/legal/:slug');
  const slug = params?.slug;
  const language = i18n.language as 'nl' | 'en';

  const { data: legalPage, isLoading, error } = useQuery<LegalPage>({
    queryKey: ['/api/legal-pages', slug, language],
    queryFn: async () => {
      const response = await fetch(`/api/legal-pages/${slug}?lang=${language}`);
      if (!response.ok) {
        throw new Error('Failed to fetch legal page');
      }
      return response.json();
    },
    enabled: !!slug,
  });

  const getPageIcon = (pageType: string) => {
    switch (pageType) {
      case 'privacy':
        return <Shield className="h-6 w-6" />;
      case 'cookies':
        return <Cookie className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Skeleton className="h-10 w-32 mb-4" />
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
            
            <Card>
              <CardContent className="p-8">
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className={`h-4 ${i === 2 ? 'w-3/4' : 'w-full'}`} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !legalPage) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Pagina niet gevonden
              </h1>
              <p className="text-muted-foreground mb-8">
                De juridische pagina die u zoekt bestaat niet of is niet beschikbaar.
              </p>
              <Link href="/">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Terug naar homepage
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const title = language === 'nl' ? legalPage.titleNl : legalPage.titleEn;
  const content = language === 'nl' ? legalPage.contentNl : legalPage.contentEn;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="mb-6" data-testid="button-back-home">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Terug naar homepage
              </Button>
            </Link>
            
            <div className="flex items-center gap-3 mb-4">
              {getPageIcon(legalPage.pageType)}
              <h1 className="text-3xl md:text-4xl font-bold text-foreground" data-testid="text-legal-title">
                {title}
              </h1>
            </div>
            
            <p className="text-muted-foreground">
              Laatste update: {new Date(legalPage.updatedAt || legalPage.createdAt || new Date()).toLocaleDateString('nl-NL', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </p>
          </div>

          {/* Content */}
          <Card>
            <CardContent className="p-8">
              <div 
                className="prose prose-gray dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
                data-testid="legal-content"
              />
            </CardContent>
          </Card>

          {/* Back to homepage */}
          <div className="mt-8 text-center">
            <Link href="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Terug naar homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}