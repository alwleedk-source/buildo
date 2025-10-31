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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Save, Upload, Trash2, Plus, Eye } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { AboutContent, InsertAboutContent } from '@/lib/db/schema';
import { insertAboutContentSchema } from '@/lib/db/schema';

interface Feature {
  title: string;
  description: string;
}

interface AboutFormData {
  titleNl: string;
  titleEn: string;
  descriptionNl: string;
  descriptionEn: string;
  image: string;
  featuresNl: Feature[];
  featuresEn: Feature[];
  isActive: boolean;
}

export function AboutContentEditor() {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const { data: aboutContent, isLoading } = useQuery<AboutContent>({
    queryKey: ['/api/about'],
  });

  const form = useForm<AboutFormData>({
    resolver: zodResolver(insertAboutContentSchema.extend({
      featuresNl: insertAboutContentSchema.shape.featuresNl.optional(),
      featuresEn: insertAboutContentSchema.shape.featuresEn.optional(),
    })),
    defaultValues: {
      titleNl: "",
      titleEn: "",
      descriptionNl: "",
      descriptionEn: "",
      image: "",
      featuresNl: [],
      featuresEn: [],
      isActive: true,
    },
  });

  // Update form when data loads
  useEffect(() => {
    if (aboutContent) {
      const featuresNl = Array.isArray(aboutContent.featuresNl) ? aboutContent.featuresNl as Feature[] : [];
      const featuresEn = Array.isArray(aboutContent.featuresEn) ? aboutContent.featuresEn as Feature[] : [];
      
      form.reset({
        titleNl: aboutContent.titleNl,
        titleEn: aboutContent.titleEn,
        descriptionNl: aboutContent.descriptionNl,
        descriptionEn: aboutContent.descriptionEn,
        image: aboutContent.image || "",
        featuresNl,
        featuresEn,
        isActive: aboutContent.isActive ?? true,
      });
      
      if (aboutContent.image) {
        setImagePreview(aboutContent.image);
      }
    }
  }, [aboutContent, form]);

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return apiRequest('/api/admin/media/upload', 'POST', formData);
    },
    onSuccess: (data) => {
      form.setValue('image', data.url);
      setImagePreview(data.url);
      toast({
        title: "Gelukt",
        description: "Afbeelding succesvol geüpload",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Fout",
        description: error.message || "Kon afbeelding niet uploaden",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: AboutFormData) => {
      const payload: InsertAboutContent = {
        titleNl: data.titleNl,
        titleEn: data.titleEn,
        descriptionNl: data.descriptionNl,
        descriptionEn: data.descriptionEn,
        image: data.image || null,
        featuresNl: data.featuresNl,
        featuresEn: data.featuresEn,
        isActive: data.isActive,
      };
      
      return apiRequest('/api/admin/about', 'PUT', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/about'] });
      toast({
        title: "Gelukt",
        description: "Over Ons inhoud succesvol bijgewerkt",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Fout",
        description: error.message || "Kon Over Ons inhoud niet bijwerken",
        variant: "destructive",
      });
    },
  });

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      uploadImageMutation.mutate(file);
    }
  };

  const removeImage = () => {
    form.setValue('image', '');
    setImagePreview('');
    setSelectedImage(null);
  };

  const addFeature = (language: 'nl' | 'en') => {
    const fieldName = language === 'nl' ? 'featuresNl' : 'featuresEn';
    const currentFeatures = form.getValues(fieldName);
    form.setValue(fieldName, [...currentFeatures, { title: '', description: '' }]);
  };

  const removeFeature = (language: 'nl' | 'en', index: number) => {
    const fieldName = language === 'nl' ? 'featuresNl' : 'featuresEn';
    const currentFeatures = form.getValues(fieldName);
    form.setValue(fieldName, currentFeatures.filter((_, i) => i !== index));
  };

  const updateFeature = (language: 'nl' | 'en', index: number, field: 'title' | 'description', value: string) => {
    const fieldName = language === 'nl' ? 'featuresNl' : 'featuresEn';
    const currentFeatures = form.getValues(fieldName);
    const updatedFeatures = [...currentFeatures];
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
    form.setValue(fieldName, updatedFeatures);
  };

  const onSubmit = (data: AboutFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded animate-pulse" />
            <div className="h-32 bg-muted rounded animate-pulse" />
            <div className="h-8 bg-muted rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="about-content-editor">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Over Ons Sectie Editor
          <Badge variant={form.watch('isActive') ? 'default' : 'secondary'}>
            {form.watch('isActive') ? 'Actief' : 'Inactief'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="content" className="w-full">
            <TabsList>
              <TabsTrigger value="content">Inhoud</TabsTrigger>
              <TabsTrigger value="image">Afbeelding</TabsTrigger>
              <TabsTrigger value="features">Kenmerken</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Nederlands</h3>
                  <div>
                    <Label htmlFor="titleNl">Titel</Label>
                    <Input
                      id="titleNl"
                      {...form.register('titleNl')}
                      placeholder="Bijv. Over BuildCorp Amsterdam"
                      data-testid="input-title-nl"
                    />
                    {form.formState.errors.titleNl && (
                      <p className="text-sm text-destructive">{form.formState.errors.titleNl.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="descriptionNl">Beschrijving</Label>
                    <Textarea
                      id="descriptionNl"
                      {...form.register('descriptionNl')}
                      placeholder="Beschrijf uw bedrijf..."
                      rows={6}
                      data-testid="input-description-nl"
                    />
                    {form.formState.errors.descriptionNl && (
                      <p className="text-sm text-destructive">{form.formState.errors.descriptionNl.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">English</h3>
                  <div>
                    <Label htmlFor="titleEn">Title</Label>
                    <Input
                      id="titleEn"
                      {...form.register('titleEn')}
                      placeholder="e.g. About BuildCorp Amsterdam"
                      data-testid="input-title-en"
                    />
                    {form.formState.errors.titleEn && (
                      <p className="text-sm text-destructive">{form.formState.errors.titleEn.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="descriptionEn">Description</Label>
                    <Textarea
                      id="descriptionEn"
                      {...form.register('descriptionEn')}
                      placeholder="Describe your company..."
                      rows={6}
                      data-testid="input-description-en"
                    />
                    {form.formState.errors.descriptionEn && (
                      <p className="text-sm text-destructive">{form.formState.errors.descriptionEn.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="image" className="space-y-6">
              <div>
                <Label>Hoofd Afbeelding</Label>
                <div className="mt-2 space-y-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full max-w-md rounded-lg shadow-md"
                        data-testid="img-preview"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                        data-testid="button-remove-image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">Geen afbeelding geselecteerd</p>
                    </div>
                  )}

                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="image-upload"
                      data-testid="input-image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      disabled={uploadImageMutation.isPending}
                      data-testid="button-upload-image"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploadImageMutation.isPending ? 'Uploaden...' : 'Afbeelding Selecteren'}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Dutch Features */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Nederlandse Kenmerken</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addFeature('nl')}
                      data-testid="button-add-feature-nl"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Toevoegen
                    </Button>
                  </div>
                  {form.watch('featuresNl').map((feature, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Kenmerk {index + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFeature('nl', index)}
                            data-testid={`button-remove-feature-nl-${index}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <Input
                          placeholder="Titel"
                          value={feature.title}
                          onChange={(e) => updateFeature('nl', index, 'title', e.target.value)}
                          data-testid={`input-feature-title-nl-${index}`}
                        />
                        <Textarea
                          placeholder="Beschrijving"
                          value={feature.description}
                          onChange={(e) => updateFeature('nl', index, 'description', e.target.value)}
                          rows={2}
                          data-testid={`input-feature-description-nl-${index}`}
                        />
                      </div>
                    </Card>
                  ))}
                </div>

                {/* English Features */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">English Features</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addFeature('en')}
                      data-testid="button-add-feature-en"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  {form.watch('featuresEn').map((feature, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Feature {index + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFeature('en', index)}
                            data-testid={`button-remove-feature-en-${index}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <Input
                          placeholder="Title"
                          value={feature.title}
                          onChange={(e) => updateFeature('en', index, 'title', e.target.value)}
                          data-testid={`input-feature-title-en-${index}`}
                        />
                        <Textarea
                          placeholder="Description"
                          value={feature.description}
                          onChange={(e) => updateFeature('en', index, 'description', e.target.value)}
                          rows={2}
                          data-testid={`input-feature-description-en-${index}`}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                {...form.register('isActive')}
                className="w-4 h-4"
                data-testid="checkbox-is-active"
              />
              <Label htmlFor="isActive">Sectie actief</Label>
            </div>

            <Button
              type="submit"
              disabled={updateMutation.isPending}
              data-testid="button-save-about-content"
            >
              <Save className="w-4 h-4 mr-2" />
              {updateMutation.isPending ? "Opslaan..." : "Wijzigingen Opslaan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}