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
import { BarChart3, Palette, Play, Settings } from "lucide-react";
import { insertStatisticsSettingSchema, StatisticsSetting } from '@/lib/db/schema';
import { apiRequest, queryClient } from "@/lib/queryClient";

const formSchema = insertStatisticsSettingSchema;

interface StatisticsSettingsFormData {
  displayStyle?: string;
  animationStyle?: string;
  cardStyle?: string;
  colorScheme?: string;
  showIcons?: boolean;
  showBackground?: boolean;
  enableHover?: boolean;
  enableAnimation?: boolean;
  animationDuration?: number;
  sectionTitleNl?: string;
  sectionTitleEn?: string;
  sectionSubtitleNl?: string;
  sectionSubtitleEn?: string;
  customColors?: any;
  isActive?: boolean;
}

export function StatisticsSettingsEditor() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch statistics settings from admin API
  const { data: statisticsSettings, isLoading } = useQuery<StatisticsSetting | null>({
    queryKey: ['/api/admin/statistics-settings'],
  });

  const form = useForm<StatisticsSettingsFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayStyle: "simple",
      animationStyle: "none",
      cardStyle: "flat",
      colorScheme: "default",
      showIcons: false,
      showBackground: false,
      enableHover: false,
      enableAnimation: false,
      animationDuration: 2000,
      sectionTitleNl: "Onze Prestaties",
      sectionTitleEn: "Our Achievements",
      sectionSubtitleNl: "",
      sectionSubtitleEn: "",
      customColors: null,
      isActive: true,
    },
  });

  // Update form when data is loaded
  useEffect(() => {
    if (statisticsSettings) {
      form.reset({
        displayStyle: statisticsSettings.displayStyle || "simple",
        animationStyle: statisticsSettings.animationStyle || "none",
        cardStyle: statisticsSettings.cardStyle || "flat",
        colorScheme: statisticsSettings.colorScheme || "default",
        showIcons: statisticsSettings.showIcons || false,
        showBackground: statisticsSettings.showBackground || false,
        enableHover: statisticsSettings.enableHover || false,
        enableAnimation: statisticsSettings.enableAnimation || false,
        animationDuration: statisticsSettings.animationDuration || 2000,
        sectionTitleNl: statisticsSettings.sectionTitleNl || "Onze Prestaties",
        sectionTitleEn: statisticsSettings.sectionTitleEn || "Our Achievements",
        sectionSubtitleNl: statisticsSettings.sectionSubtitleNl || "",
        sectionSubtitleEn: statisticsSettings.sectionSubtitleEn || "",
        customColors: statisticsSettings.customColors || null,
        isActive: statisticsSettings.isActive !== false,
      });
    }
  }, [statisticsSettings, form]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: StatisticsSettingsFormData) => {
      return await apiRequest('/api/admin/statistics-settings', 'PUT', data);
    },
    onSuccess: () => {
      toast({
        title: "Instellingen opgeslagen",
        description: "Statistiek sectie instellingen succesvol opgeslagen",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/statistics-settings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/statistics-settings'] });
    },
    onError: (error) => {
      toast({
        title: "Fout bij opslaan",
        description: "Er is een fout opgetreden bij het opslaan van de instellingen",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: StatisticsSettingsFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return <div data-testid="loading">Aan het laden...</div>;
  }

  return (
    <div className="space-y-6" data-testid="statistics-settings-editor">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Statistiek Sectie Instellingen
              </CardTitle>
              <CardDescription>
                Beheer de weergave en animaties van de statistiek sectie
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {!isEditing && (
                <Button 
                  onClick={() => setIsEditing(true)}
                  data-testid="button-edit-statistics-settings"
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
                  {statisticsSettings?.displayStyle === "simple" ? "Eenvoudig" :
                   statisticsSettings?.displayStyle === "modern" ? "Modern" : "Geavanceerd"}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Animatie Stijl</h4>
                <Badge variant="secondary" data-testid="text-animation-style">
                  {statisticsSettings?.animationStyle === "none" ? "Geen animatie" :
                   statisticsSettings?.animationStyle === "simple" ? "Eenvoudige animatie" : "Geavanceerde animatie"}
                </Badge>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Kaart Stijl</h4>
                <Badge variant="secondary" data-testid="text-card-style">
                  {statisticsSettings?.cardStyle === "flat" ? "Plat" :
                   statisticsSettings?.cardStyle === "cards" ? "Kaarten" : "Verloop"}
                </Badge>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Kleurenschema</h4>
                <Badge variant="secondary" data-testid="text-color-scheme">
                  {statisticsSettings?.colorScheme === "default" ? "Standaard" :
                   statisticsSettings?.colorScheme === "brand" ? "Merk kleuren" : "Aangepast"}
                </Badge>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Pictogrammen</h4>
                <Badge variant={statisticsSettings?.showIcons ? "default" : "secondary"}>
                  {statisticsSettings?.showIcons ? "Ingeschakeld" : "Uitgeschakeld"}
                </Badge>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Animaties</h4>
                <Badge variant={statisticsSettings?.enableAnimation ? "default" : "secondary"}>
                  {statisticsSettings?.enableAnimation ? "Ingeschakeld" : "Uitgeschakeld"}
                </Badge>
              </div>
            </div>
          </CardContent>
        ) : (
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="design" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="design">Ontwerp</TabsTrigger>
                    <TabsTrigger value="animation">Animaties</TabsTrigger>
                    <TabsTrigger value="content">Inhoud</TabsTrigger>
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
                                <SelectItem value="simple">Eenvoudig</SelectItem>
                                <SelectItem value="modern">Modern</SelectItem>
                                <SelectItem value="advanced">Geavanceerd</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Kies het algemene ontwerp voor de statistiek sectie
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
                                <SelectItem value="flat">Plat</SelectItem>
                                <SelectItem value="cards">Kaarten</SelectItem>
                                <SelectItem value="gradient">Verloop</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Vorm van individuele statistiek kaarten
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="colorScheme"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kleurenschema</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-color-scheme">
                                  <SelectValue placeholder="Kies kleurenschema" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="default">Standaard</SelectItem>
                                <SelectItem value="brand">Merk kleuren</SelectItem>
                                <SelectItem value="custom">Aangepast</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Sectie kleuren en harmonie met de website
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="showIcons"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Pictogrammen weergeven</FormLabel>
                                <FormDescription>
                                  Voeg pictogrammen toe aan statistieken
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="switch-show-icons"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="showBackground"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Decoratieve achtergrond</FormLabel>
                                <FormDescription>
                                  Voeg decoratieve elementen toe aan de achtergrond
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="switch-show-background"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="enableHover"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Hover effecten</FormLabel>
                                <FormDescription>
                                  Effecten bij muisbeweging
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="switch-enable-hover"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="animation" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <SelectItem value="simple">Eenvoudige animatie</SelectItem>
                                <SelectItem value="advanced">Geavanceerde animatie</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Type animatie bij verschijning van de sectie
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="animationDuration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Animatie duur (in milliseconden)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="500"
                                max="5000"
                                step="100"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                data-testid="input-animation-duration"
                              />
                            </FormControl>
                            <FormDescription>
                              Snelheid van het tellen van cijfers (standaard: 2000)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="enableAnimation"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Animaties inschakelen</FormLabel>
                              <FormDescription>
                                Cijfer animatie bij verschijning van de sectie
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="switch-enable-animation"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="content" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="sectionTitleNl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sectie titel (Nederlands)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                data-testid="input-section-title-nl"
                              />
                            </FormControl>
                            <FormDescription>
                              Hoofdtitel voor de statistiek sectie in het Nederlands
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sectionTitleEn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sectie titel (Engels)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                data-testid="input-section-title-en"
                              />
                            </FormControl>
                            <FormDescription>
                              Hoofdtitel voor de statistiek sectie in het Engels
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sectionSubtitleNl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ondertitel (Nederlands)</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={3}
                                data-testid="textarea-section-subtitle-nl"
                              />
                            </FormControl>
                            <FormDescription>
                              Korte beschrijving van de sectie in het Nederlands
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sectionSubtitleEn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ondertitel (Engels)</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={3}
                                data-testid="textarea-section-subtitle-en"
                              />
                            </FormControl>
                            <FormDescription>
                              Korte beschrijving van de sectie in het Engels
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Sectie inschakelen</FormLabel>
                            <FormDescription>
                              Toon de statistiek sectie op de website
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-is-active"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      form.reset();
                    }}
                    data-testid="button-cancel-statistics-settings"
                  >
                    Annuleren
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending}
                    data-testid="button-save-statistics-settings"
                  >
                    <Palette className="h-4 w-4 mr-2" />
                    {updateMutation.isPending ? "Bezig met opslaan..." : "Instellingen opslaan"}
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