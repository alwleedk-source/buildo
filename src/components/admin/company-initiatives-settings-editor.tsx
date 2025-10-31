'use client';

import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Settings, Save, Loader2 } from "lucide-react";
import { insertCompanyInitiativesSettingsSchema, CompanyInitiativesSettings } from '@/lib/db/schema';
import { apiRequest, queryClient } from "@/lib/queryClient";

const formSchema = insertCompanyInitiativesSettingsSchema;
type FormData = z.infer<typeof formSchema>;

export function CompanyInitiativesSettingsEditor() {
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery<CompanyInitiativesSettings>({
    queryKey: ["/api/company-initiatives-settings"],
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("/api/admin/company-initiatives-settings", "PUT", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/company-initiatives-settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/company-initiatives-settings"] });
      toast({ title: "Instellingen succesvol bijgewerkt" });
    },
    onError: (error) => {
      console.error('Company initiatives settings error:', error);
      toast({
        title: "Fout bij het bijwerken van instellingen",
        variant: "destructive",
      });
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titleNl: "",
      descriptionNl: "",
      heroButtonTextNl: "",
      heroButtonUrlNl: "",
      statsTitleNl: "",
      statsDescriptionNl: "",
      maxStatsItems: 4,
      showStatistics: true,
      initiativesTitleNl: "",
      initiativesDescriptionNl: "",
      maxInitiativesItems: 3,
      showInitiatives: true,
      ctaTitleNl: "",
      ctaDescriptionNl: "",
      ctaButtonTextNl: "",
      ctaButtonUrlNl: "",
      learnMoreTextNl: "",
      learnMoreUrlNl: "",
      showCallToAction: true,
    },
  });

  // Update form when data loads
  useEffect(() => {
    if (settings) {
      form.reset({
        titleNl: settings.titleNl || "",
        descriptionNl: settings.descriptionNl || "",
        heroButtonTextNl: settings.heroButtonTextNl || "",
        heroButtonUrlNl: settings.heroButtonUrlNl || "",
        statsTitleNl: settings.statsTitleNl || "",
        statsDescriptionNl: settings.statsDescriptionNl || "",
        maxStatsItems: settings.maxStatsItems || 4,
        showStatistics: settings.showStatistics !== false,
        initiativesTitleNl: settings.initiativesTitleNl || "",
        initiativesDescriptionNl: settings.initiativesDescriptionNl || "",
        maxInitiativesItems: settings.maxInitiativesItems || 3,
        showInitiatives: settings.showInitiatives !== false,
        ctaTitleNl: settings.ctaTitleNl || "",
        ctaDescriptionNl: settings.ctaDescriptionNl || "",
        ctaButtonTextNl: settings.ctaButtonTextNl || "",
        ctaButtonUrlNl: settings.ctaButtonUrlNl || "",
        learnMoreTextNl: settings.learnMoreTextNl || "",
        learnMoreUrlNl: settings.learnMoreUrlNl || "",
        showCallToAction: settings.showCallToAction !== false,
      });
    }
  }, [settings]);

  const onSubmit = (data: FormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5" />
        <h1 className="text-2xl font-bold">Maatschappelijke Pagina Instellingen</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Hero Section */}
          <Card data-testid="hero-settings-card">
            <CardHeader>
              <CardTitle>Hero Sectie</CardTitle>
              <CardDescription>
                Configureer de hoofdtitel en beschrijving van de maatschappelijke pagina
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="titleNl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titel (Nederlands)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Maatschappelijke Verantwoordelijkheid" 
                        {...field} 
                        data-testid="input-title-nl"
                      />
                    </FormControl>
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
                      <Textarea 
                        placeholder="Samen kunnen we een duurzamere en verantwoordelijke toekomst bouwen..."
                        rows={3}
                        {...field} 
                        data-testid="textarea-description-nl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="heroButtonTextNl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button Tekst</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Meer Weten" 
                          {...field}
                          value={field.value || ""} 
                          data-testid="input-hero-button-text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="heroButtonUrlNl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="/contact" 
                          {...field}
                          value={field.value || ""} 
                          data-testid="input-hero-button-url"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Statistics Section */}
          <Card data-testid="statistics-settings-card">
            <CardHeader>
              <CardTitle>Statistieken Sectie</CardTitle>
              <CardDescription>
                Configureer de weergave van statistieken op de pagina
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="showStatistics"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Statistieken Tonen</FormLabel>
                      <FormDescription>
                        Schakel de statistieken sectie in of uit
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value ?? true}
                        onCheckedChange={field.onChange}
                        data-testid="switch-show-statistics"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="statsTitleNl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statistieken Titel</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Onze Impact in Cijfers" 
                        {...field}
                        value={field.value || ""}
                        data-testid="input-stats-title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="statsDescriptionNl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statistieken Beschrijving</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Bekijk hoe we het verschil maken in gemeenschappen door heel Nederland"
                        rows={2}
                        {...field}
                        value={field.value || ""}
                        data-testid="textarea-stats-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxStatsItems"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Aantal Statistieken</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="8" 
                        {...field}
                        value={field.value ?? 4}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 4)}
                        data-testid="input-max-stats"
                      />
                    </FormControl>
                    <FormDescription>
                      Aantal statistieken dat wordt weergegeven (1-8)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Initiatives Section */}
          <Card data-testid="initiatives-settings-card">
            <CardHeader>
              <CardTitle>Initiatieven Sectie</CardTitle>
              <CardDescription>
                Configureer de weergave van bedrijfsinitiatieven
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="showInitiatives"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Initiatieven Tonen</FormLabel>
                      <FormDescription>
                        Schakel de initiatieven sectie in of uit
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value ?? true}
                        onCheckedChange={field.onChange}
                        data-testid="switch-show-initiatives"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="initiativesTitleNl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initiatieven Titel</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Onze Bedrijfsinitiatieven" 
                        {...field}
                        value={field.value || ""} 
                        data-testid="input-initiatives-title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="initiativesDescriptionNl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initiatieven Beschrijving</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Ontdek onze projecten die gericht zijn op het verbeteren van de gemeenschap en het milieu."
                        rows={2}
                        {...field}
                        value={field.value || ""} 
                        data-testid="textarea-initiatives-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxInitiativesItems"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Aantal Initiatieven</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="6" 
                        {...field}
                        value={field.value ?? 3} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 3)}
                        data-testid="input-max-initiatives"
                      />
                    </FormControl>
                    <FormDescription>
                      Aantal initiatieven dat wordt weergegeven op de hoofdpagina (1-6)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Call to Action Section */}
          <Card data-testid="cta-settings-card">
            <CardHeader>
              <CardTitle>Call to Action Sectie</CardTitle>
              <CardDescription>
                Configureer de oproep tot actie aan het einde van de pagina
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="showCallToAction"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Call to Action Tonen</FormLabel>
                      <FormDescription>
                        Schakel de call to action sectie in of uit
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value ?? true}
                        onCheckedChange={field.onChange}
                        data-testid="switch-show-cta"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ctaTitleNl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CTA Titel</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Klaar om het Verschil te Maken?" 
                        {...field}
                        value={field.value || ""} 
                        data-testid="input-cta-title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ctaDescriptionNl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CTA Beschrijving</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Sluit je aan bij onze missie om duurzame gemeenschappen te bouwen en blijvende positieve impact te creëren."
                        rows={2}
                        {...field}
                        value={field.value || ""} 
                        data-testid="textarea-cta-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ctaButtonTextNl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primaire Button Tekst</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Doe Mee" 
                          {...field}
                          value={field.value || ""} 
                          data-testid="input-cta-button-text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ctaButtonUrlNl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primaire Button URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="/contact" 
                          {...field}
                          value={field.value || ""} 
                          data-testid="input-cta-button-url"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="learnMoreTextNl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secundaire Button Tekst</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Meer Informatie" 
                          {...field}
                          value={field.value || ""} 
                          data-testid="input-learn-more-text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="learnMoreUrlNl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secundaire Button URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="/about" 
                          {...field}
                          value={field.value || ""} 
                          data-testid="input-learn-more-url"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Separator />

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={updateMutation.isPending}
              data-testid="button-save-settings"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Opslaan...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Instellingen Opslaan
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}