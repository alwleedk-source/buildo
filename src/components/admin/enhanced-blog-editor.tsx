'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Plus, Save, X, Edit, Trash2, Eye, Globe, Star, Hash, Image, Link2, FileText, Calendar, User, TrendingUp } from 'lucide-react';
import type { BlogArticle, InsertBlogArticle } from '@/lib/db/schema';
import VisualHtmlEditor from './visual-html-editor';
import { ImageUploadField } from './image-upload-field';

interface EnhancedFormData {
  titleNl: string;
  titleEn: string;
  excerptNl: string;
  excerptEn: string;
  contentNl: string;
  contentEn: string;
  categoryNl: string;
  categoryEn: string;
  metaDescriptionNl: string;
  metaDescriptionEn: string;
  keywordsNl: string;
  keywordsEn: string;
  image: string;
  imageAlt: string;
  ogImage: string;
  slugNl: string;
  slugEn: string;
  canonicalUrl: string;
  tagsNl: string[];
  tagsEn: string[];
  isFeatured: boolean;
  isPublished: boolean;
  twitterCard: string;
  ogType: string;
}

export function EnhancedBlogEditor() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<'nl' | 'en'>('nl');
  const [newTagInput, setNewTagInput] = useState({ nl: '', en: '' });
  
  const [formData, setFormData] = useState<EnhancedFormData>({
    titleNl: '',
    titleEn: '',
    excerptNl: '',
    excerptEn: '',
    contentNl: '',
    contentEn: '',
    categoryNl: '',
    categoryEn: '',
    metaDescriptionNl: '',
    metaDescriptionEn: '',
    keywordsNl: '',
    keywordsEn: '',
    image: '',
    imageAlt: '',
    ogImage: '',
    slugNl: '',
    slugEn: '',
    canonicalUrl: '',
    tagsNl: [],
    tagsEn: [],
    isFeatured: false,
    isPublished: false,
    twitterCard: 'summary_large_image',
    ogType: 'article'
  });

  const { data: articles = [] } = useQuery<BlogArticle[]>({
    queryKey: ['/api/admin/blog'],
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\u00C0-\u017Fa-z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const generateCanonicalUrl = (slug: string) => {
    return `${window.location.origin}/blog/${slug}`;
  };

  const calculateReadingTime = (content: string): number => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / (activeLanguage === 'nl' ? 200 : 250));
  };

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        ...data,
        readingTime: calculateReadingTime(data.contentNl),
        publishedAt: data.isPublished ? new Date().toISOString() : null
      };
      console.log('Sending blog create payload:', payload);
      return await apiRequest('/api/admin/blog', 'POST', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog'] });
      resetForm();
      setIsCreating(false);
      toast({ title: 'Succes', description: 'Blog artikel succesvol aangemaakt' });
    },
    onError: (error) => {
      console.error('Blog creation error:', error);
      toast({ title: 'Fout', description: 'Kon blog artikel niet aanmaken', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const payload = {
        ...data,
        readingTime: calculateReadingTime(data.contentNl),
        publishedAt: data.isPublished && !articles.find(a => a.id === id)?.publishedAt 
          ? new Date().toISOString() 
          : articles.find(a => a.id === id)?.publishedAt
      };
      console.log('Sending blog update payload:', payload);
      return await apiRequest('/api/admin/blog/' + id, 'PUT', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog'] });
      setEditingId(null);
      toast({ title: 'Succes', description: 'Blog artikel succesvol bijgewerkt' });
    },
    onError: (error) => {
      console.error('Blog update error:', error);
      toast({ title: 'Fout', description: 'Kon blog artikel niet bijwerken', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/admin/blog/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog'] });
      toast({ title: 'Succes', description: 'Blog artikel succesvol verwijderd' });
    },
    onError: () => {
      toast({ title: 'Fout', description: 'Kon blog artikel niet verwijderen', variant: 'destructive' });
    },
  });

  const resetForm = () => {
    setFormData({
      titleNl: '',
      titleEn: '',
      excerptNl: '',
      excerptEn: '',
      contentNl: '',
      contentEn: '',
      categoryNl: '',
      categoryEn: '',
      metaDescriptionNl: '',
      metaDescriptionEn: '',
      keywordsNl: '',
      keywordsEn: '',
      image: '',
      imageAlt: '',
      ogImage: '',
      slugNl: '',
      slugEn: '',
      canonicalUrl: '',
      tagsNl: [],
      tagsEn: [],
      isFeatured: false,
      isPublished: false,
      twitterCard: 'summary_large_image',
      ogType: 'article'
    });
  };

  const addTag = (language: 'nl' | 'en') => {
    const tagValue = newTagInput[language].trim();
    if (tagValue && !(formData[`tags${language.charAt(0).toUpperCase() + language.slice(1)}` as keyof EnhancedFormData] as string[]).includes(tagValue)) {
      setFormData(prev => ({
        ...prev,
        [`tags${language.charAt(0).toUpperCase() + language.slice(1)}`]: [
          ...prev[`tags${language.charAt(0).toUpperCase() + language.slice(1)}` as keyof EnhancedFormData] as string[],
          tagValue
        ]
      }));
      setNewTagInput(prev => ({ ...prev, [language]: '' }));
    }
  };

  const removeTag = (language: 'nl' | 'en', index: number) => {
    setFormData(prev => ({
      ...prev,
      [`tags${language.charAt(0).toUpperCase() + language.slice(1)}`]: (prev[`tags${language.charAt(0).toUpperCase() + language.slice(1)}` as keyof EnhancedFormData] as string[]).filter((_, i) => i !== index)
    }));
  };

  const populateEditForm = (article: BlogArticle) => {
    setFormData({
      titleNl: article.titleNl || '',
      titleEn: article.titleEn || '',
      excerptNl: article.excerptNl || '',
      excerptEn: article.excerptEn || '',
      contentNl: article.contentNl || '',
      contentEn: article.contentEn || '',
      categoryNl: article.categoryNl || '',
      categoryEn: article.categoryEn || '',
      metaDescriptionNl: article.metaDescriptionNl || '',
      metaDescriptionEn: article.metaDescriptionEn || '',
      keywordsNl: article.keywordsNl || '',
      keywordsEn: article.keywordsEn || '',
      image: article.image || '',
      imageAlt: article.imageAlt || '',
      ogImage: article.ogImage || '',
      slugNl: article.slugNl || '',
      slugEn: article.slugEn || '',
      canonicalUrl: article.canonicalUrl || '',
      tagsNl: article.tagsNl || [],
      tagsEn: article.tagsEn || [],
      isFeatured: article.isFeatured || false,
      isPublished: article.isPublished || false,
      twitterCard: article.twitterCard || 'summary_large_image',
      ogType: article.ogType || 'article'
    });
    setEditingId(article.id);
  };

  // Auto-generate slugs when titles change
  useEffect(() => {
    if (formData.titleNl && !editingId) {
      const newSlugNl = generateSlug(formData.titleNl);
      setFormData(prev => ({
        ...prev,
        slugNl: newSlugNl,
        canonicalUrl: generateCanonicalUrl(newSlugNl)
      }));
    }
  }, [formData.titleNl, editingId]);

  useEffect(() => {
    if (formData.titleEn && !editingId) {
      const newSlugEn = generateSlug(formData.titleEn);
      setFormData(prev => ({
        ...prev,
        slugEn: newSlugEn
      }));
    }
  }, [formData.titleEn, editingId]);

  // Auto-generate meta descriptions from excerpts if empty
  useEffect(() => {
    if (formData.excerptNl && !formData.metaDescriptionNl) {
      setFormData(prev => ({
        ...prev,
        metaDescriptionNl: formData.excerptNl.substring(0, 160)
      }));
    }
  }, [formData.excerptNl]);

  useEffect(() => {
    if (formData.excerptEn && !formData.metaDescriptionEn) {
      setFormData(prev => ({
        ...prev,
        metaDescriptionEn: formData.excerptEn.substring(0, 160)
      }));
    }
  }, [formData.excerptEn]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6" data-testid="enhanced-blog-editor">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Geavanceerd Blog Beheer</h3>
        <Button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2"
          data-testid="button-add-blog"
        >
          <Plus className="w-4 h-4" />
          Nieuw Artikel
        </Button>
      </div>

      {(isCreating || editingId) && (
        <Card data-testid="blog-form">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {editingId ? 'Artikel Bewerken' : 'Nieuw Artikel Maken'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Language Toggle */}
              <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                <Label className="text-sm font-medium">Taal:</Label>
                <Tabs value={activeLanguage} onValueChange={(value) => setActiveLanguage(value as 'nl' | 'en')}>
                  <TabsList>
                    <TabsTrigger value="nl" data-testid="lang-nl">🇳🇱 Nederlands</TabsTrigger>
                    <TabsTrigger value="en" data-testid="lang-en">🇬🇧 Engels</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Content Fields based on language */}
              <Tabs value={activeLanguage} className="w-full">
                <TabsContent value="nl" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="titleNl">Titel (Nederlands)</Label>
                      <Input
                        id="titleNl"
                        value={formData.titleNl}
                        onChange={(e) => setFormData(prev => ({ ...prev, titleNl: e.target.value }))}
                        placeholder="Artikel titel in het Nederlands"
                        data-testid="input-title-nl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="slugNl">URL Slug (Nederlands)</Label>
                      <Input
                        id="slugNl"
                        value={formData.slugNl}
                        onChange={(e) => setFormData(prev => ({ ...prev, slugNl: e.target.value }))}
                        placeholder="url-vriendelijke-slug"
                        data-testid="input-slug-nl"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="excerptNl">Samenvatting (Nederlands)</Label>
                    <Textarea
                      id="excerptNl"
                      value={formData.excerptNl}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerptNl: e.target.value }))}
                      placeholder="Korte samenvatting in het Nederlands"
                      rows={3}
                      data-testid="textarea-excerpt-nl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contentNl">Inhoud (Nederlands)</Label>
                    <VisualHtmlEditor
                      value={formData.contentNl}
                      onChange={(value) => setFormData(prev => ({ ...prev, contentNl: value }))}
                      placeholder="Volledige inhoud in het Nederlands..."
                      language="nl"
                      height={500}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="categoryNl">Categorie (Nederlands)</Label>
                      <Input
                        id="categoryNl"
                        value={formData.categoryNl}
                        onChange={(e) => setFormData(prev => ({ ...prev, categoryNl: e.target.value }))}
                        placeholder="Categorie in het Nederlands"
                        data-testid="input-category-nl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="metaDescriptionNl">Meta Beschrijving (Nederlands)</Label>
                      <Textarea
                        id="metaDescriptionNl"
                        value={formData.metaDescriptionNl}
                        onChange={(e) => setFormData(prev => ({ ...prev, metaDescriptionNl: e.target.value }))}
                        placeholder="SEO meta beschrijving (max 160 karakters)"
                        rows={2}
                        maxLength={160}
                        data-testid="textarea-meta-description-nl"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {formData.metaDescriptionNl.length}/160 karakters
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="keywordsNl">SEO Keywords (Nederlands)</Label>
                    <Input
                      id="keywordsNl"
                      value={formData.keywordsNl}
                      onChange={(e) => setFormData(prev => ({ ...prev, keywordsNl: e.target.value }))}
                      placeholder="zoekwoord1, zoekwoord2, zoekwoord3"
                      data-testid="input-keywords-nl"
                    />
                  </div>

                  <div>
                    <Label>Tags (Nederlands)</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newTagInput.nl}
                        onChange={(e) => setNewTagInput(prev => ({ ...prev, nl: e.target.value }))}
                        placeholder="Nieuwe tag toevoegen..."
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('nl'))}
                        data-testid="input-new-tag-nl"
                      />
                      <Button type="button" onClick={() => addTag('nl')} data-testid="button-add-tag-nl">
                        <Hash className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tagsNl.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="h-auto p-0 w-4"
                            onClick={() => removeTag('nl', index)}
                            data-testid={`button-remove-tag-nl-${index}`}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="en" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="titleEn">Title (English)</Label>
                      <Input
                        id="titleEn"
                        value={formData.titleEn}
                        onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                        placeholder="Article title in English"
                        data-testid="input-title-en"
                      />
                    </div>
                    <div>
                      <Label htmlFor="slugEn">URL Slug (English)</Label>
                      <Input
                        id="slugEn"
                        value={formData.slugEn}
                        onChange={(e) => setFormData(prev => ({ ...prev, slugEn: e.target.value }))}
                        placeholder="url-friendly-slug"
                        data-testid="input-slug-en"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="excerptEn">Excerpt (English)</Label>
                    <Textarea
                      id="excerptEn"
                      value={formData.excerptEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerptEn: e.target.value }))}
                      placeholder="Short excerpt in English"
                      rows={3}
                      data-testid="textarea-excerpt-en"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contentEn">Content (English)</Label>
                    <VisualHtmlEditor
                      value={formData.contentEn}
                      onChange={(value) => setFormData(prev => ({ ...prev, contentEn: value }))}
                      placeholder="Full content in English..."
                      language="en"
                      height={500}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="categoryEn">Category (English)</Label>
                      <Input
                        id="categoryEn"
                        value={formData.categoryEn}
                        onChange={(e) => setFormData(prev => ({ ...prev, categoryEn: e.target.value }))}
                        placeholder="Category in English"
                        data-testid="input-category-en"
                      />
                    </div>
                    <div>
                      <Label htmlFor="metaDescriptionEn">Meta Description (English)</Label>
                      <Textarea
                        id="metaDescriptionEn"
                        value={formData.metaDescriptionEn}
                        onChange={(e) => setFormData(prev => ({ ...prev, metaDescriptionEn: e.target.value }))}
                        placeholder="SEO meta description (max 160 characters)"
                        rows={2}
                        maxLength={160}
                        data-testid="textarea-meta-description-en"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {formData.metaDescriptionEn.length}/160 characters
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="keywordsEn">SEO Keywords (English)</Label>
                    <Input
                      id="keywordsEn"
                      value={formData.keywordsEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, keywordsEn: e.target.value }))}
                      placeholder="keyword1, keyword2, keyword3"
                      data-testid="input-keywords-en"
                    />
                  </div>

                  <div>
                    <Label>Tags (English)</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newTagInput.en}
                        onChange={(e) => setNewTagInput(prev => ({ ...prev, en: e.target.value }))}
                        placeholder="Add new tag..."
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('en'))}
                        data-testid="input-new-tag-en"
                      />
                      <Button type="button" onClick={() => addTag('en')} data-testid="button-add-tag-en">
                        <Hash className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tagsEn.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="h-auto p-0 w-4"
                            onClick={() => removeTag('en', index)}
                            data-testid={`button-remove-tag-en-${index}`}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Media and SEO Settings */}
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Media & SEO Instellingen
                </h4>
                
                <div className="grid grid-cols-1 gap-6">
                  <ImageUploadField
                    label="Hoofdafbeelding"
                    value={formData.image}
                    onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                    data-testid="input-image"
                    altLabel="Alt tekst hoofdafbeelding"
                    altValue={formData.imageAlt}
                    onAltChange={(alt) => setFormData(prev => ({ ...prev, imageAlt: alt }))}
                    data-testid-alt="input-image-alt"
                    showUrlInput={true}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <ImageUploadField
                    label="Open Graph afbeelding (Social Media)"
                    value={formData.ogImage}
                    onChange={(url) => setFormData(prev => ({ ...prev, ogImage: url }))}
                    placeholder="Specifieke afbeelding voor social media"
                    data-testid="input-og-image"
                    showUrlInput={true}
                  />
                  <div>
                    <Label htmlFor="canonicalUrl">Canonical URL</Label>
                    <Input
                      id="canonicalUrl"
                      value={formData.canonicalUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, canonicalUrl: e.target.value }))}
                      placeholder="Wordt automatisch gegenereerd"
                      data-testid="input-canonical-url"
                    />
                  </div>
                </div>
              </div>

              {/* Publication Settings */}
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Publicatie Instellingen
                </h4>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isPublished"
                      checked={formData.isPublished}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublished: checked }))}
                      data-testid="switch-published"
                    />
                    <Label htmlFor="isPublished">Gepubliceerd</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
                      data-testid="switch-featured"
                    />
                    <Label htmlFor="isFeatured" className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Uitgelicht
                    </Label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save-blog"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {createMutation.isPending || updateMutation.isPending ? 'Opslaan...' : 'Opslaan'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  data-testid="button-cancel-blog"
                >
                  <X className="w-4 h-4 mr-2" />
                  Annuleren
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Articles List */}
      <div className="space-y-4">
        <h4 className="font-semibold">Bestaande Artikelen</h4>
        {articles.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Nog geen artikelen gevonden. Maak je eerste artikel aan!
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {articles.map((article) => (
              <Card key={article.id} data-testid={`article-item-${article.id}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{article.titleNl}</h4>
                        {article.isFeatured && (
                          <Badge variant="default" className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Uitgelicht
                          </Badge>
                        )}
                        <Badge variant={article.isPublished ? 'default' : 'secondary'}>
                          {article.isPublished ? 'Gepubliceerd' : 'Concept'}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">{article.excerptNl}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {article.categoryNl && (
                          <span className="flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            {article.categoryNl}
                          </span>
                        )}
                        {article.readingTime && (
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {article.readingTime} min
                          </span>
                        )}
                        {article.viewCount !== undefined && (
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {article.viewCount} views
                          </span>
                        )}
                        {article.publishedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(article.publishedAt).toLocaleDateString('nl-NL')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => populateEditForm(article)}
                        data-testid={`button-edit-article-${article.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(article.id)}
                        data-testid={`button-delete-article-${article.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EnhancedBlogEditor;