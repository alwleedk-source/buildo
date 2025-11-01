'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tantml:parameter name="@tanstack/react-query">';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { ImageUpload } from '@/components/admin/image-upload';
import { ArrowLeft, Save, Eye, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BlogEditorProps {
  articleId: string | null;
  onClose: () => void;
}

export function BlogEditor({ articleId, onClose }: BlogEditorProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('content');
  
  // Form state
  const [formData, setFormData] = useState({
    titleNl: '',
    titleEn: '',
    slugNl: '',
    slugEn: '',
    excerptNl: '',
    excerptEn: '',
    contentNl: '',
    contentEn: '',
    categoryNl: '',
    categoryEn: '',
    tagsNl: [] as string[],
    tagsEn: [] as string[],
    image: '',
    imageAlt: '',
    author: '',
    readingTime: 5,
    metaDescriptionNl: '',
    metaDescriptionEn: '',
    keywordsNl: '',
    keywordsEn: '',
    isPublished: false,
    isFeatured: false,
  });

  // Fetch existing article if editing
  const { data: article, isLoading } = useQuery({
    queryKey: [`/api/admin/blog/${articleId}`],
    queryFn: async () => {
      if (!articleId) return null;
      const res = await fetch(`/api/admin/blog/${articleId}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      return json.data;
    },
    enabled: !!articleId,
  });

  // Populate form when article is loaded
  useEffect(() => {
    if (article) {
      setFormData({
        titleNl: article.titleNl || '',
        titleEn: article.titleEn || '',
        slugNl: article.slugNl || '',
        slugEn: article.slugEn || '',
        excerptNl: article.excerptNl || '',
        excerptEn: article.excerptEn || '',
        contentNl: article.contentNl || '',
        contentEn: article.contentEn || '',
        categoryNl: article.categoryNl || '',
        categoryEn: article.categoryEn || '',
        tagsNl: article.tagsNl || [],
        tagsEn: article.tagsEn || [],
        image: article.image || '',
        imageAlt: article.imageAlt || '',
        author: article.author || '',
        readingTime: article.readingTime || 5,
        metaDescriptionNl: article.metaDescriptionNl || '',
        metaDescriptionEn: article.metaDescriptionEn || '',
        keywordsNl: article.keywordsNl || '',
        keywordsEn: article.keywordsEn || '',
        isPublished: article.isPublished || false,
        isFeatured: article.isFeatured || false,
      });
    }
  }, [article]);

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const url = articleId
        ? `/api/admin/blog/${articleId}`
        : '/api/admin/blog';
      
      const res = await fetch(url, {
        method: articleId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) throw new Error('Failed to save');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog'] });
      onClose();
    },
  });

  const handleSave = (publish: boolean = false) => {
    saveMutation.mutate({
      ...formData,
      isPublished: publish,
    });
  };

  const handleTitleChange = (field: 'titleNl' | 'titleEn', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Auto-generate slug if not manually edited
      [field === 'titleNl' ? 'slugNl' : 'slugEn']: generateSlug(value),
    }));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onClose}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {articleId ? 'Edit Article' : 'New Article'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {formData.isPublished ? (
                <Badge variant="default">Published</Badge>
              ) : (
                <Badge variant="secondary">Draft</Badge>
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSave(false)}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={() => handleSave(true)}>
            <Send className="h-4 w-4 mr-2" />
            {formData.isPublished ? 'Update' : 'Publish'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dutch (NL)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="titleNl">Title *</Label>
                <Input
                  id="titleNl"
                  value={formData.titleNl}
                  onChange={(e) => handleTitleChange('titleNl', e.target.value)}
                  placeholder="Enter article title in Dutch"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="slugNl">URL Slug *</Label>
                <Input
                  id="slugNl"
                  value={formData.slugNl}
                  onChange={(e) => setFormData(prev => ({ ...prev, slugNl: e.target.value }))}
                  placeholder="article-url-slug"
                  required
                />
              </div>

              <div>
                <Label htmlFor="excerptNl">Excerpt *</Label>
                <Textarea
                  id="excerptNl"
                  value={formData.excerptNl}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerptNl: e.target.value }))}
                  placeholder="Short description (160 characters max)"
                  rows={3}
                  maxLength={160}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.excerptNl.length}/160 characters
                </p>
              </div>

              <div>
                <Label htmlFor="contentNl">Content *</Label>
                <RichTextEditor
                  content={formData.contentNl}
                  onChange={(content) => setFormData(prev => ({ ...prev, contentNl: content }))}
                  placeholder="Write your article content in Dutch..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>English (EN)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="titleEn">Title *</Label>
                <Input
                  id="titleEn"
                  value={formData.titleEn}
                  onChange={(e) => handleTitleChange('titleEn', e.target.value)}
                  placeholder="Enter article title in English"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="slugEn">URL Slug *</Label>
                <Input
                  id="slugEn"
                  value={formData.slugEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, slugEn: e.target.value }))}
                  placeholder="article-url-slug"
                  required
                />
              </div>

              <div>
                <Label htmlFor="excerptEn">Excerpt *</Label>
                <Textarea
                  id="excerptEn"
                  value={formData.excerptEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerptEn: e.target.value }))}
                  placeholder="Short description (160 characters max)"
                  rows={3}
                  maxLength={160}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.excerptEn.length}/160 characters
                </p>
              </div>

              <div>
                <Label htmlFor="contentEn">Content *</Label>
                <RichTextEditor
                  content={formData.contentEn}
                  onChange={(content) => setFormData(prev => ({ ...prev, contentEn: content }))}
                  placeholder="Write your article content in English..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
              <CardDescription>
                Upload or enter URL for the article's featured image
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                label="Featured Image"
                aspectRatio="16/9"
              />
              
              <div>
                <Label htmlFor="imageAlt">Image Alt Text</Label>
                <Input
                  id="imageAlt"
                  value={formData.imageAlt}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageAlt: e.target.value }))}
                  placeholder="Describe the image for accessibility"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings - Dutch</CardTitle>
              <CardDescription>
                Optimize your article for search engines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaDescriptionNl">Meta Description</Label>
                <Textarea
                  id="metaDescriptionNl"
                  value={formData.metaDescriptionNl}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescriptionNl: e.target.value }))}
                  placeholder="SEO description (155 characters max)"
                  rows={3}
                  maxLength={155}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.metaDescriptionNl.length}/155 characters
                </p>
              </div>

              <div>
                <Label htmlFor="keywordsNl">Keywords</Label>
                <Input
                  id="keywordsNl"
                  value={formData.keywordsNl}
                  onChange={(e) => setFormData(prev => ({ ...prev, keywordsNl: e.target.value }))}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Settings - English</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaDescriptionEn">Meta Description</Label>
                <Textarea
                  id="metaDescriptionEn"
                  value={formData.metaDescriptionEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescriptionEn: e.target.value }))}
                  placeholder="SEO description (155 characters max)"
                  rows={3}
                  maxLength={155}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.metaDescriptionEn.length}/155 characters
                </p>
              </div>

              <div>
                <Label htmlFor="keywordsEn">Keywords</Label>
                <Input
                  id="keywordsEn"
                  value={formData.keywordsEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, keywordsEn: e.target.value }))}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Article Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="categoryNl">Category (NL)</Label>
                  <Input
                    id="categoryNl"
                    value={formData.categoryNl}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoryNl: e.target.value }))}
                    placeholder="Duurzaam Bouwen"
                  />
                </div>
                <div>
                  <Label htmlFor="categoryEn">Category (EN)</Label>
                  <Input
                    id="categoryEn"
                    value={formData.categoryEn}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoryEn: e.target.value }))}
                    placeholder="Sustainable Building"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Author name"
                />
              </div>

              <div>
                <Label htmlFor="readingTime">Reading Time (minutes)</Label>
                <Input
                  id="readingTime"
                  type="number"
                  min="1"
                  value={formData.readingTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, readingTime: parseInt(e.target.value) || 5 }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isFeatured">Featured Article</Label>
                  <p className="text-sm text-muted-foreground">
                    Show this article prominently
                  </p>
                </div>
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
