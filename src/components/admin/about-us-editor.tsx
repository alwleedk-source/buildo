'use client';

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Eye, Save, Upload, Trash2, Plus } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { AboutUsPage, InsertAboutUsPage } from '@/lib/db/schema';
import { insertAboutUsPageSchema } from '@/lib/db/schema';

interface HTMLEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function HTMLEditor({ value, onChange, placeholder }: HTMLEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={isPreview ? "outline" : "default"}
          size="sm"
          onClick={() => setIsPreview(false)}
        >
          Edit HTML
        </Button>
        <Button
          type="button"
          variant={isPreview ? "default" : "outline"}
          size="sm"
          onClick={() => setIsPreview(true)}
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
      </div>

      {isPreview ? (
        <div 
          className="min-h-64 p-4 border border-border rounded-md prose prose-sm dark:prose-invert max-w-none bg-background"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-64 font-mono text-sm"
          rows={12}
        />
      )}
    </div>
  );
}

export function AboutUsEditor() {
  const { toast } = useToast();
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const { data: aboutUsContent, isLoading } = useQuery<AboutUsPage>({
    queryKey: ['/api/about-us'],
  });

  const form = useForm<InsertAboutUsPage>({
    resolver: zodResolver(insertAboutUsPageSchema),
    defaultValues: {
      titleNl: "",
      titleEn: "",
      subtitleNl: "",
      subtitleEn: "",
      contentNl: "",
      contentEn: "",
      heroImage: "",
      gallery: [],
      metaTitleNl: "",
      metaTitleEn: "",
      metaDescriptionNl: "",
      metaDescriptionEn: "",
      isActive: true,
    },
  });

  // Update form when data loads
  useEffect(() => {
    if (aboutUsContent) {
      form.reset({
        titleNl: aboutUsContent.titleNl,
        titleEn: aboutUsContent.titleEn,
        subtitleNl: aboutUsContent.subtitleNl || "",
        subtitleEn: aboutUsContent.subtitleEn || "",
        contentNl: aboutUsContent.contentNl,
        contentEn: aboutUsContent.contentEn,
        heroImage: aboutUsContent.heroImage || "",
        gallery: aboutUsContent.gallery || [],
        metaTitleNl: aboutUsContent.metaTitleNl || "",
        metaTitleEn: aboutUsContent.metaTitleEn || "",
        metaDescriptionNl: aboutUsContent.metaDescriptionNl || "",
        metaDescriptionEn: aboutUsContent.metaDescriptionEn || "",
        isActive: aboutUsContent.isActive,
      });
      setGalleryImages(Array.isArray(aboutUsContent.gallery) ? aboutUsContent.gallery : []);
    }
  }, [aboutUsContent, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: InsertAboutUsPage) => {
      const response = await fetch('/api/admin/about-us', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, gallery: galleryImages }),
      });
      if (!response.ok) {
        throw new Error('Failed to update about us page');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/about-us'] });
      toast({
        title: "Success",
        description: "About Us page updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update About Us page",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertAboutUsPage) => {
    updateMutation.mutate({ ...data, gallery: galleryImages });
  };

  const addGalleryImage = () => {
    const url = prompt("Enter image URL:");
    if (url && url.trim()) {
      setGalleryImages([...galleryImages, url.trim()]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>About Us Page Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full" data-testid="about-us-editor">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          About Us Page Management
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Create rich content for your detailed About Us page with HTML editor and image gallery.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="content">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              {/* Titles */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titleNl">Title (Dutch)</Label>
                  <Input
                    id="titleNl"
                    {...form.register("titleNl")}
                    placeholder="Over Ons Bedrijf"
                    data-testid="input-title-nl"
                  />
                  {form.formState.errors.titleNl && (
                    <p className="text-sm text-destructive">{form.formState.errors.titleNl.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="titleEn">Title (English)</Label>
                  <Input
                    id="titleEn"
                    {...form.register("titleEn")}
                    placeholder="About Our Company"
                    data-testid="input-title-en"
                  />
                  {form.formState.errors.titleEn && (
                    <p className="text-sm text-destructive">{form.formState.errors.titleEn.message}</p>
                  )}
                </div>
              </div>

              {/* Subtitles */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subtitleNl">Subtitle (Dutch)</Label>
                  <Input
                    id="subtitleNl"
                    {...form.register("subtitleNl")}
                    placeholder="Vakmanschap en excellentie..."
                    data-testid="input-subtitle-nl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitleEn">Subtitle (English)</Label>
                  <Input
                    id="subtitleEn"
                    {...form.register("subtitleEn")}
                    placeholder="Craftsmanship and excellence..."
                    data-testid="input-subtitle-en"
                  />
                </div>
              </div>

              {/* Hero Image */}
              <div className="space-y-2">
                <Label htmlFor="heroImage">Hero Background Image URL</Label>
                <Input
                  id="heroImage"
                  {...form.register("heroImage")}
                  placeholder="https://example.com/hero-image.jpg"
                  data-testid="input-hero-image"
                />
              </div>

              <Separator />

              {/* Content Editors */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Content (Dutch) - HTML Editor</Label>
                  <HTMLEditor
                    value={form.watch("contentNl") || ""}
                    onChange={(value) => form.setValue("contentNl", value)}
                    placeholder="Enter your Dutch content here. You can use HTML tags for formatting..."
                  />
                  {form.formState.errors.contentNl && (
                    <p className="text-sm text-destructive">{form.formState.errors.contentNl.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Content (English) - HTML Editor</Label>
                  <HTMLEditor
                    value={form.watch("contentEn") || ""}
                    onChange={(value) => form.setValue("contentEn", value)}
                    placeholder="Enter your English content here. You can use HTML tags for formatting..."
                  />
                  {form.formState.errors.contentEn && (
                    <p className="text-sm text-destructive">{form.formState.errors.contentEn.message}</p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Image Gallery</Label>
                <Button type="button" onClick={addGalleryImage} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Image
                </Button>
              </div>
              
              {galleryImages.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No images in gallery. Click "Add Image" to start.
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryImages.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-32 object-cover rounded border border-border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycm9yPC90ZXh0Pjwvc3ZnPg==";
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeGalleryImage(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="seo" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitleNl">Meta Title (Dutch)</Label>
                  <Input
                    id="metaTitleNl"
                    {...form.register("metaTitleNl")}
                    placeholder="Over Ons - Company Name"
                    data-testid="input-meta-title-nl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaTitleEn">Meta Title (English)</Label>
                  <Input
                    id="metaTitleEn"
                    {...form.register("metaTitleEn")}
                    placeholder="About Us - Company Name"
                    data-testid="input-meta-title-en"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="metaDescriptionNl">Meta Description (Dutch)</Label>
                  <Textarea
                    id="metaDescriptionNl"
                    {...form.register("metaDescriptionNl")}
                    placeholder="Leer meer over ons bedrijf, onze geschiedenis en waarden..."
                    rows={4}
                    data-testid="textarea-meta-description-nl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescriptionEn">Meta Description (English)</Label>
                  <Textarea
                    id="metaDescriptionEn"
                    {...form.register("metaDescriptionEn")}
                    placeholder="Learn more about our company, history and values..."
                    rows={4}
                    data-testid="textarea-meta-description-en"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  {...form.register("isActive")}
                  className="rounded border border-input"
                />
                <Label htmlFor="isActive">Page is active and visible</Label>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              data-testid="button-save-about-us"
            >
              <Save className="w-4 h-4 mr-2" />
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}