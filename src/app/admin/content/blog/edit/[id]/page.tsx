'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BlogArticle {
  id: string;
  titleNl: string;
  titleEn: string;
  slugNl: string;
  slugEn: string;
  excerptNl: string;
  excerptEn: string;
  contentNl: string;
  contentEn: string;
  categoryNl: string;
  categoryEn: string;
  tagsNl: string;
  tagsEn: string;
  image: string;
  imageAlt: string;
  isPublished: boolean;
  isFeatured: boolean;
}

export default function EditBlogPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [article, setArticle] = useState<BlogArticle | null>(null);

  useEffect(() => {
    fetchArticle();
  }, [params.id]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/admin/blog/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch article');
      const data = await response.json();
      setArticle(data.article);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load article',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!article) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/admin/blog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article)
      });

      if (!response.ok) throw new Error('Failed to save');

      toast({
        title: 'Success',
        description: 'Article saved successfully'
      });

      router.push('/admin/content/blog');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save article',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof BlogArticle, value: any) => {
    if (!article) return;
    setArticle({ ...article, [field]: value });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!article) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Article not found</h2>
            <Button onClick={() => router.push('/admin/content/blog')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/admin/content/blog')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Edit Article</h1>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Published</Label>
                  <p className="text-sm text-muted-foreground">
                    Make this article visible to the public
                  </p>
                </div>
                <Switch
                  checked={article.isPublished}
                  onCheckedChange={(checked) => updateField('isPublished', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Featured</Label>
                  <p className="text-sm text-muted-foreground">
                    Show this article in featured section
                  </p>
                </div>
                <Switch
                  checked={article.isFeatured}
                  onCheckedChange={(checked) => updateField('isFeatured', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="nl">
                <TabsList className="mb-4">
                  <TabsTrigger value="nl">Nederlands</TabsTrigger>
                  <TabsTrigger value="en">English</TabsTrigger>
                </TabsList>

                <TabsContent value="nl" className="space-y-4">
                  <div>
                    <Label>Title (NL)</Label>
                    <Input
                      value={article.titleNl}
                      onChange={(e) => updateField('titleNl', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Slug (NL)</Label>
                    <Input
                      value={article.slugNl}
                      onChange={(e) => updateField('slugNl', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Excerpt (NL)</Label>
                    <Textarea
                      value={article.excerptNl}
                      onChange={(e) => updateField('excerptNl', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Content (NL)</Label>
                    <Textarea
                      value={article.contentNl}
                      onChange={(e) => updateField('contentNl', e.target.value)}
                      rows={15}
                      className="font-mono text-sm"
                    />
                  </div>
                  <div>
                    <Label>Category (NL)</Label>
                    <Input
                      value={article.categoryNl}
                      onChange={(e) => updateField('categoryNl', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Tags (NL) - comma separated</Label>
                    <Input
                      value={article.tagsNl}
                      onChange={(e) => updateField('tagsNl', e.target.value)}
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="en" className="space-y-4">
                  <div>
                    <Label>Title (EN)</Label>
                    <Input
                      value={article.titleEn}
                      onChange={(e) => updateField('titleEn', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Slug (EN)</Label>
                    <Input
                      value={article.slugEn}
                      onChange={(e) => updateField('slugEn', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Excerpt (EN)</Label>
                    <Textarea
                      value={article.excerptEn}
                      onChange={(e) => updateField('excerptEn', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Content (EN)</Label>
                    <Textarea
                      value={article.contentEn}
                      onChange={(e) => updateField('contentEn', e.target.value)}
                      rows={15}
                      className="font-mono text-sm"
                    />
                  </div>
                  <div>
                    <Label>Category (EN)</Label>
                    <Input
                      value={article.categoryEn}
                      onChange={(e) => updateField('categoryEn', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Tags (EN) - comma separated</Label>
                    <Input
                      value={article.tagsEn}
                      onChange={(e) => updateField('tagsEn', e.target.value)}
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Image URL</Label>
                <Input
                  value={article.image}
                  onChange={(e) => updateField('image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label>Image Alt Text</Label>
                <Input
                  value={article.imageAlt}
                  onChange={(e) => updateField('imageAlt', e.target.value)}
                />
              </div>
              {article.image && (
                <div>
                  <Label>Preview</Label>
                  <img
                    src={article.image}
                    alt={article.imageAlt}
                    className="mt-2 max-w-md rounded-lg border"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
