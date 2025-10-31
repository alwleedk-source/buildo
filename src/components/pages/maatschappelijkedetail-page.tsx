'use client';

import { useQuery } from "@tanstack/react-query";
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Share2,
  BookOpen,
  Target,
  Award
} from "lucide-react";
import { CompanyInitiative, CompanyInitiativesSettings } from '@/lib/db/schema';

export function MaatschappelijkeDetailPage() {
  const [, params] = useRoute("/maatschappelijke/:id");
  const { id } = params || {};

  // Fetch specific content item
  const { data: item, isLoading } = useQuery<CompanyInitiative>({
    queryKey: ["/api/company-initiatives", id],
    enabled: !!id,
  });

  // Fetch settings for dynamic content
  const { data: settings } = useQuery<CompanyInitiativesSettings>({
    queryKey: ["/api/company-initiatives-settings"],
  });

  // Fetch all content for related items
  const { data: allContent = [] } = useQuery<CompanyInitiative[]>({
    queryKey: ["/api/company-initiatives"],
  });

  // Get related content (excluding current item)
  const relatedContent = allContent
    .filter(content => content.id !== id)
    .slice(0, 3);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!item) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Content Not Found</h1>
            <p className="text-gray-600 mb-6">The requested content could not be found.</p>
            <Link href="/maatschappelijke">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Overview
              </Button>
            </Link>
          </div>
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
              <Link href="/maatschappelijke" className="hover:text-green-600 transition-colors duration-200">
                {settings?.titleNl || "Maatschappelijke Verantwoordelijkheid"}
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">
                {item.titleNl}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative">
          {item.image && (
            <div className="w-full h-96 relative overflow-hidden">
              <img 
                src={item.image} 
                alt={item.titleNl}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 text-white p-8">
                <div className="container mx-auto">
                  <Badge className="mb-4 bg-white/20 text-white">
                    CSR Initiative
                  </Badge>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {item.titleNl}
                  </h1>
                  <p className="text-xl text-gray-200 max-w-2xl">
                    {item.descriptionNl}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="mb-8">
                <CardContent className="p-8">
                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8 pb-8 border-b">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('nl-NL') : 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Netherlands</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>5 min read</span>
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="prose prose-lg max-w-none">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {item.descriptionNl}
                    </div>
                  </div>

                  {/* Impact Metrics */}
                  <div className="mt-12 p-6 bg-green-50 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" />
                      Initiative Category
                    </h3>
                    <div className="text-gray-700">
                      <p className="capitalize">{item.category || 'General Corporate Responsibility'}</p>
                    </div>
                  </div>

                  {/* Goals */}
                  <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5 text-blue-600" />
                      Goals & Objectives
                    </h3>
                    <div className="text-gray-700">
                      <p>This initiative aims to create sustainable positive impact in our communities.</p>
                    </div>
                  </div>

                  {/* Share */}
                  <div className="mt-12 pt-8 border-t">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600">Share this article:</span>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                      <Link href="/maatschappelijke">
                        <Button variant="ghost">
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to Overview
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Article Info */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    About This Initiative
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Category</h4>
                      <Badge variant="secondary">CSR Initiative</Badge>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Status</h4>
                      <Badge variant={item.isActive ? "default" : "secondary"}>
                        {item.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Location</h4>
                      <p className="text-gray-600">Netherlands</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Published</h4>
                      <p className="text-gray-600">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('nl-NL', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Related Content */}
              {relatedContent.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Related Initiatives</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {relatedContent.map((relatedItem) => (
                      <Link key={relatedItem.id} href={`/maatschappelijke/${relatedItem.id}`}>
                        <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                            {relatedItem.titleNl}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {relatedItem.descriptionNl}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {relatedItem.createdAt ? new Date(relatedItem.createdAt).toLocaleDateString('nl-NL') : 'Unknown'}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}