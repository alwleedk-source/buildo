'use client';

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Palette, Eye, Settings } from "lucide-react";
import { insertTestimonialsSettingsSchema, TestimonialsSettings } from '@/lib/db/schema';
import { apiRequest, queryClient } from "@/lib/queryClient";

const formSchema = insertTestimonialsSettingsSchema;

interface TestimonialsSettingsFormData {
  titleNl?: string;
  titleEn?: string;
  descriptionNl?: string;
  descriptionEn?: string;
  ctaTitleNl?: string;
  ctaTitleEn?: string;
  ctaDescriptionNl?: string;
  ctaDescriptionEn?: string;
  ctaButtonTextNl?: string;
  ctaButtonTextEn?: string;
  displayStyle?: string;
  itemsPerRow?: number;
  showRatings?: boolean;
  showCustomerImages?: boolean;
  showProjectType?: boolean;
  showLocation?: boolean;
  showFeaturedOnly?: boolean;
  showCta?: boolean;
  backgroundStyle?: string;
  cardStyle?: string;
  animationStyle?: string;
  ratingStyle?: string;
  starColor?: string;
  metaTitleNl?: string;
  metaTitleEn?: string;
  metaDescriptionNl?: string;
  metaDescriptionEn?: string;
}

export function TestimonialsSettingsEditor() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch testimonials settings from admin API
  const { data: testimonialsSettings, isLoading } = useQuery<TestimonialsSettings | null>({
    queryKey: ['/api/admin/testimonials-settings'],
  });

  const form = useForm<TestimonialsSettingsFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titleNl: "Wat Onze Klanten Zeggen",
      titleEn: "What Our Clients Say",
      descriptionNl: "Ontdek wat onze tevreden klanten zeggen over onze services en kwaliteit. Hun ervaringen spreken voor zich.",
      descriptionEn: "Discover what our satisfied clients say about our services and quality. Their experiences speak for themselves.",
      ctaTitleNl: "Tevreden over ons werk?",
      ctaTitleEn: "Satisfied with our work?",
      ctaDescriptionNl: "Deel uw ervaring met ons en help andere klanten de juiste keuze te maken.",
      ctaDescriptionEn: "Share your experience with us and help other clients make the right choice.",
      ctaButtonTextNl: "Deel Uw Ervaring",
      ctaButtonTextEn: "Share Your Experience",
      displayStyle: "grid",
      itemsPerRow: 3,
      showRatings: true,
      showCustomerImages: true,
      showProjectType: true,
      showLocation: true,
      showFeaturedOnly: false,
      showCta: true,
      backgroundStyle: "muted",
      cardStyle: "default",
      animationStyle: "none",
      ratingStyle: "stars",
      starColor: "yellow",
      metaTitleNl: "Klantbeoordelingen | BuildIt Professional",
      metaTitleEn: "Customer Reviews | BuildIt Professional",
      metaDescriptionNl: "Lees de beoordelingen van onze tevreden klanten over onze bouwservices en projecten.",
      metaDescriptionEn: "Read reviews from our satisfied customers about our construction services and projects.",
    },
  });

  // Reset form when settings change
  useEffect(() => {
    if (testimonialsSettings) {
      form.reset({
        titleNl: testimonialsSettings.titleNl || "Wat Onze Klanten Zeggen",
        titleEn: testimonialsSettings.titleEn || "What Our Clients Say",
        descriptionNl: testimonialsSettings.descriptionNl || "Ontdek wat onze tevreden klanten zeggen over onze services en kwaliteit. Hun ervaringen spreken voor zich.",
        descriptionEn: testimonialsSettings.descriptionEn || "Discover what our satisfied clients say about our services and quality. Their experiences speak for themselves.",
        ctaTitleNl: testimonialsSettings.ctaTitleNl || "Tevreden over ons werk?",
        ctaTitleEn: testimonialsSettings.ctaTitleEn || "Satisfied with our work?",
        ctaDescriptionNl: testimonialsSettings.ctaDescriptionNl || "Deel uw ervaring met ons en help andere klanten de juiste keuze te maken.",
        ctaDescriptionEn: testimonialsSettings.ctaDescriptionEn || "Share your experience with us and help other clients make the right choice.",
        ctaButtonTextNl: testimonialsSettings.ctaButtonTextNl || "Deel Uw Ervaring",
        ctaButtonTextEn: testimonialsSettings.ctaButtonTextEn || "Share Your Experience",
        displayStyle: testimonialsSettings.displayStyle || "grid",
        itemsPerRow: testimonialsSettings.itemsPerRow || 3,
        showRatings: testimonialsSettings.showRatings ?? true,
        showCustomerImages: testimonialsSettings.showCustomerImages ?? true,
        showProjectType: testimonialsSettings.showProjectType ?? true,
        showLocation: testimonialsSettings.showLocation ?? true,
        showFeaturedOnly: testimonialsSettings.showFeaturedOnly ?? false,
        showCta: testimonialsSettings.showCta ?? true,
        backgroundStyle: testimonialsSettings.backgroundStyle || "muted",
        cardStyle: testimonialsSettings.cardStyle || "default",
        animationStyle: testimonialsSettings.animationStyle || "none",
        ratingStyle: testimonialsSettings.ratingStyle || "stars",
        starColor: testimonialsSettings.starColor || "yellow",
        metaTitleNl: testimonialsSettings.metaTitleNl || "Klantbeoordelingen | BuildIt Professional",
        metaTitleEn: testimonialsSettings.metaTitleEn || "Customer Reviews | BuildIt Professional",
        metaDescriptionNl: testimonialsSettings.metaDescriptionNl || "Lees de beoordelingen van onze tevreden klanten over onze bouwservices en projecten.",
        metaDescriptionEn: testimonialsSettings.metaDescriptionEn || "Read reviews from our satisfied customers about our construction services and projects.",
      });
    }
  }, [testimonialsSettings, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: TestimonialsSettingsFormData) => {
      return await apiRequest('/api/admin/testimonials-settings', 'PUT', data);
    },
    onSuccess: () => {
      toast({
        title: "Instellingen opgeslagen",
        description: "Testimonials sectie instellingen succesvol opgeslagen",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials-settings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/testimonials-settings'] });
    },
    onError: (error) => {
      toast({
        title: "Fout bij opslaan",
        description: "Er is een fout opgetreden bij het opslaan van de instellingen",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: TestimonialsSettingsFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return <div data-testid="loading">Aan het laden...</div>;
  }

  return (
    <div className="space-y-6" data-testid="testimonials-settings-editor">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Testimonials Sectie Instellingen
              </CardTitle>
              <CardDescription>
                Beheer de weergave en inhoud van de klantbeoordelingen sectie
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {!isEditing && (
                <Button 
                  onClick={() => setIsEditing(true)}
                  data-testid="button-edit-testimonials-settings"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Instellingen bewerken
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {!isEditing ? (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium">Weergave Stijl</h4>
                <Badge variant="secondary" data-testid="text-display-style">
                  {testimonialsSettings?.displayStyle === "grid" ? "Raster" :
                   testimonialsSettings?.displayStyle === "list" ? "Lijst" : 
                   testimonialsSettings?.displayStyle === "carousel" ? "Carrousel" : "Masonry"}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Items per Rij</h4>
                <Badge variant="secondary" data-testid="text-items-per-row">
                  {testimonialsSettings?.itemsPerRow || 3}
                </Badge>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Kaart Stijl</h4>
                <Badge variant="secondary" data-testid="text-card-style">
                  {testimonialsSettings?.cardStyle === "default" ? "Standaard" :
                   testimonialsSettings?.cardStyle === "minimal" ? "Minimaal" :
                   testimonialsSettings?.cardStyle === "elevated" ? "Verhoogd" :
                   testimonialsSettings?.cardStyle === "bordered" ? "Met rand" : "Modern"}
                </Badge>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Achtergrond Stijl</h4>
                <Badge variant="secondary" data-testid="text-background-style">
                  {testimonialsSettings?.backgroundStyle === "muted" ? "Gedempt" :
                   testimonialsSettings?.backgroundStyle === "white" ? "Wit" :
                   testimonialsSettings?.backgroundStyle === "primary" ? "Primair" : "Verloop"}
                </Badge>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Beoordelingen</h4>
                <Badge variant={testimonialsSettings?.showRatings ? "default" : "secondary"}>
                  {testimonialsSettings?.showRatings ? "Zichtbaar" : "Verborgen"}
                </Badge>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Klantfoto's</h4>
                <Badge variant={testimonialsSettings?.showCustomerImages ? "default" : "secondary"}>
                  {testimonialsSettings?.showCustomerImages ? "Zichtbaar" : "Verborgen"}
                </Badge>
              </div>
            </div>
          </CardContent>
        ) : (
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="design" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="design">Ontwerp</TabsTrigger>
                    <TabsTrigger value="content">Inhoud</TabsTrigger>
                    <TabsTrigger value="display">Weergave</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                  </TabsList>

                  <TabsContent value="design" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="displayStyle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weergave Stijl</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-display-style">
                                  <SelectValue placeholder="Kies weergave stijl" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="grid">Raster</SelectItem>
                                <SelectItem value="list">Lijst</SelectItem>
                                <SelectItem value="carousel">Carrousel</SelectItem>
                                <SelectItem value="masonry">Masonry</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Kies hoe de testimonials worden weergegeven
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="itemsPerRow"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Items per Rij</FormLabel>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                              <FormControl>
                                <SelectTrigger data-testid="select-items-per-row">
                                  <SelectValue placeholder="Kies aantal per rij" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                                <SelectItem value="5">5</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Aantal testimonials per rij
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cardStyle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kaart Stijl</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-card-style">
                                  <SelectValue placeholder="Kies kaart stijl" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="default">Standaard</SelectItem>
                                <SelectItem value="minimal">Minimaal</SelectItem>
                                <SelectItem value="elevated">Verhoogd</SelectItem>
                                <SelectItem value="bordered">Met rand</SelectItem>
                                <SelectItem value="modern">Modern</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Uiterlijk van individuele testimonial kaarten
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="backgroundStyle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Achtergrond Stijl</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-background-style">
                                  <SelectValue placeholder="Kies achtergrond stijl" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="muted">Gedempt</SelectItem>
                                <SelectItem value="white">Wit</SelectItem>
                                <SelectItem value="primary">Primair</SelectItem>
                                <SelectItem value="gradient">Verloop</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Achtergrond van de testimonials sectie
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="animationStyle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Animatie Stijl</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-animation-style">
                                  <SelectValue placeholder="Kies animatie stijl" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="none">Geen animatie</SelectItem>
                                <SelectItem value="fade">Vervagen</SelectItem>
                                <SelectItem value="slide">Schuiven</SelectItem>
                                <SelectItem value="scale">Schalen</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Animatie-effect voor testimonials
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="ratingStyle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Beoordeling Stijl</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-rating-style">
                                  <SelectValue placeholder="Kies beoordeling stijl" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="stars">Sterren</SelectItem>
                                <SelectItem value="numbers">Nummers</SelectItem>
                                <SelectItem value="both">Beide</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Hoe beoordelingen worden weergegeven
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="content" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="titleNl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Titel (Nederlands)</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-title-nl" />
                            </FormControl>
                            <FormDescription>
                              Hoofdtitel van de testimonials sectie
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="titleEn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Titel (Engels)</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-title-en" />
                            </FormControl>
                            <FormDescription>
                              Hoofdtitel van de testimonials sectie
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="descriptionNl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Beschrijving (Nederlands)</FormLabel>
                            <FormControl>
                              <Textarea {...field} data-testid="textarea-description-nl" />
                            </FormControl>
                            <FormDescription>
                              Korte beschrijving onder de titel
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="descriptionEn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Beschrijving (Engels)</FormLabel>
                            <FormControl>
                              <Textarea {...field} data-testid="textarea-description-en" />
                            </FormControl>
                            <FormDescription>
                              Korte beschrijving onder de titel
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="display" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Zichtbaarheid Elementen</h3>
                        
                        <FormField
                          control={form.control}
                          name="showRatings"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Beoordelingen tonen</FormLabel>
                                <FormDescription>
                                  Toon sterrenbeoordelingen bij testimonials
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="switch-show-ratings"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="showCustomerImages"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Klantfoto's tonen</FormLabel>
                                <FormDescription>
                                  Toon profielfoto's van klanten
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="switch-show-customer-images"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="showProjectType"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Projecttype tonen</FormLabel>
                                <FormDescription>
                                  Toon het type project van de klant
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="switch-show-project-type"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="showLocation"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Locatie tonen</FormLabel>
                                <FormDescription>
                                  Toon de locatie van de klant
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="switch-show-location"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Filter Opties</h3>
                        
                        <FormField
                          control={form.control}
                          name="showFeaturedOnly"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Alleen uitgelichte</FormLabel>
                                <FormDescription>
                                  Toon alleen uitgelichte testimonials
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="switch-show-featured-only"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="showCta"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Call-to-Action tonen</FormLabel>
                                <FormDescription>
                                  Toon de oproep tot actie aan het einde
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="switch-show-cta"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="seo" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="metaTitleNl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Titel (Nederlands)</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-meta-title-nl" />
                            </FormControl>
                            <FormDescription>
                              SEO titel voor zoekmachines
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="metaTitleEn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Titel (Engels)</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-meta-title-en" />
                            </FormControl>
                            <FormDescription>
                              SEO titel voor zoekmachines
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="metaDescriptionNl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Beschrijving (Nederlands)</FormLabel>
                            <FormControl>
                              <Textarea {...field} data-testid="textarea-meta-description-nl" />
                            </FormControl>
                            <FormDescription>
                              SEO beschrijving voor zoekmachines
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="metaDescriptionEn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Beschrijving (Engels)</FormLabel>
                            <FormControl>
                              <Textarea {...field} data-testid="textarea-meta-description-en" />
                            </FormControl>
                            <FormDescription>
                              SEO beschrijving voor zoekmachines
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-2">
                  <Button type="submit" disabled={updateMutation.isPending} data-testid="button-save-testimonials-settings">
                    {updateMutation.isPending ? "Opslaan..." : "Instellingen opslaan"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    data-testid="button-cancel-testimonials-settings"
                  >
                    Annuleren
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        )}
      </Card>
    </div>
  );
}