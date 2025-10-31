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
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Building, Settings, Mail, Globe, Facebook, Twitter, Linkedin, Instagram, Youtube, MessageCircle } from "lucide-react";
import { insertFooterSettingSchema, FooterSetting } from '@/lib/db/schema';
import { apiRequest, queryClient } from "@/lib/queryClient";

const formSchema = insertFooterSettingSchema;

interface FooterSettingsFormData {
  companyDescriptionNl?: string;
  companyDescriptionEn?: string;
  copyrightText?: string;
  showSocialMedia?: boolean;
  showNewsletter?: boolean;
  showServices?: boolean;
  newsletterTitleNl?: string;
  newsletterTitleEn?: string;
  newsletterDescriptionNl?: string;
  newsletterDescriptionEn?: string;
  // Social Media Links
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  whatsappUrl?: string;
}

export function FooterEditor() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch footer settings from admin API
  const { data: footerSettings, isLoading } = useQuery<FooterSetting | null>({
    queryKey: ['/api/admin/footer-settings'],
  });

  const form = useForm<FooterSettingsFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyDescriptionNl: "",
      companyDescriptionEn: "",
      copyrightText: `© ${new Date().getFullYear()} BuildIt Professional. All rights reserved.`,
      showSocialMedia: true,
      showNewsletter: true,
      showServices: true,
      newsletterTitleNl: "",
      newsletterTitleEn: "",
      newsletterDescriptionNl: "",
      newsletterDescriptionEn: "",
      // Social Media Links
      facebookUrl: "",
      twitterUrl: "",
      linkedinUrl: "",
      instagramUrl: "",
      youtubeUrl: "",
      whatsappUrl: "",
    },
  });

  // Update form when data is loaded
  useEffect(() => {
    if (footerSettings) {
      form.reset({
        companyDescriptionNl: footerSettings.companyDescriptionNl || "",
        companyDescriptionEn: footerSettings.companyDescriptionEn || "",
        copyrightText: footerSettings.copyrightText || "",
        showSocialMedia: footerSettings.showSocialMedia ?? true,
        showNewsletter: footerSettings.showNewsletter ?? true,
        showServices: footerSettings.showServices ?? true,
        newsletterTitleNl: footerSettings.newsletterTitleNl || "",
        newsletterTitleEn: footerSettings.newsletterTitleEn || "",
        newsletterDescriptionNl: footerSettings.newsletterDescriptionNl || "",
        newsletterDescriptionEn: footerSettings.newsletterDescriptionEn || "",
        // Social Media Links
        facebookUrl: footerSettings.facebookUrl || "",
        twitterUrl: footerSettings.twitterUrl || "",
        linkedinUrl: footerSettings.linkedinUrl || "",
        instagramUrl: footerSettings.instagramUrl || "",
        youtubeUrl: footerSettings.youtubeUrl || "",
        whatsappUrl: footerSettings.whatsappUrl || "",
      });
    }
  }, [footerSettings, form]);

  // Update footer settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (data: FooterSettingsFormData) => {
      return await apiRequest('/api/admin/footer-settings', 'PUT', data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Footer settings saved successfully!",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/footer-settings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/footer-settings'] });
    },
    onError: (error) => {
      console.error('Footer settings error:', error);
      toast({
        title: "Error",
        description: "Failed to save footer settings. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (data: FooterSettingsFormData) => {
    saveSettingsMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold" data-testid="heading-footer-settings">Footer Settings</h2>
          <p className="text-muted-foreground">
            Manage footer content, company description, newsletter, and copyright information
          </p>
        </div>
        {!isEditing && (
          <Button 
            onClick={() => setIsEditing(true)}
            data-testid="button-edit-footer-settings"
          >
            Edit Settings
          </Button>
        )}
      </div>

      {!isEditing && footerSettings ? (
        <Tabs defaultValue="content" className="space-y-4">
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Company Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Dutch Description</label>
                    <p className="text-muted-foreground" data-testid="text-company-description-nl">
                      {footerSettings.companyDescriptionNl || "Not set"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">English Description</label>
                    <p className="text-muted-foreground" data-testid="text-company-description-en">
                      {footerSettings.companyDescriptionEn || "Not set"}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Copyright Text</label>
                  <p className="text-muted-foreground" data-testid="text-copyright">
                    {footerSettings.copyrightText || "Not set"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="newsletter">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Newsletter Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Dutch Title</label>
                    <p className="text-muted-foreground" data-testid="text-newsletter-title-nl">
                      {footerSettings.newsletterTitleNl || "Not set"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">English Title</label>
                    <p className="text-muted-foreground" data-testid="text-newsletter-title-en">
                      {footerSettings.newsletterTitleEn || "Not set"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Dutch Description</label>
                    <p className="text-muted-foreground" data-testid="text-newsletter-description-nl">
                      {footerSettings.newsletterDescriptionNl || "Not set"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">English Description</label>
                    <p className="text-muted-foreground" data-testid="text-newsletter-description-en">
                      {footerSettings.newsletterDescriptionEn || "Not set"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Social Media Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Facebook className="w-5 h-5 text-blue-600" />
                    <div>
                      <label className="text-sm font-medium">Facebook</label>
                      <p className="text-muted-foreground text-sm" data-testid="text-facebook-url">
                        {footerSettings.facebookUrl || "Not set"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Twitter className="w-5 h-5 text-blue-400" />
                    <div>
                      <label className="text-sm font-medium">Twitter</label>
                      <p className="text-muted-foreground text-sm" data-testid="text-twitter-url">
                        {footerSettings.twitterUrl || "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Linkedin className="w-5 h-5 text-blue-700" />
                    <div>
                      <label className="text-sm font-medium">LinkedIn</label>
                      <p className="text-muted-foreground text-sm" data-testid="text-linkedin-url">
                        {footerSettings.linkedinUrl || "Not set"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Instagram className="w-5 h-5 text-pink-500" />
                    <div>
                      <label className="text-sm font-medium">Instagram</label>
                      <p className="text-muted-foreground text-sm" data-testid="text-instagram-url">
                        {footerSettings.instagramUrl || "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Youtube className="w-5 h-5 text-red-600" />
                    <div>
                      <label className="text-sm font-medium">YouTube</label>
                      <p className="text-muted-foreground text-sm" data-testid="text-youtube-url">
                        {footerSettings.youtubeUrl || "Not set"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <label className="text-sm font-medium">WhatsApp</label>
                      <p className="text-muted-foreground text-sm" data-testid="text-whatsapp-url">
                        {footerSettings.whatsappUrl || "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="display">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Display Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Show Social Media</label>
                    <p className="text-sm text-muted-foreground">Display social media links in footer</p>
                  </div>
                  <Badge variant={footerSettings.showSocialMedia ? "default" : "secondary"} data-testid="badge-social-media">
                    {footerSettings.showSocialMedia ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Show Newsletter</label>
                    <p className="text-sm text-muted-foreground">Display newsletter subscription in footer</p>
                  </div>
                  <Badge variant={footerSettings.showNewsletter ? "default" : "secondary"} data-testid="badge-newsletter">
                    {footerSettings.showNewsletter ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Show Services</label>
                    <p className="text-sm text-muted-foreground">Display services section in footer</p>
                  </div>
                  <Badge variant={footerSettings.showServices ? "default" : "secondary"} data-testid="badge-services">
                    {footerSettings.showServices ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle data-testid="title-edit-footer-settings">
              {footerSettings ? "Edit Footer Settings" : "Create Footer Settings"}
            </CardTitle>
            <CardDescription>
              Configure footer content and display options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <Tabs defaultValue="content" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
                    <TabsTrigger value="social">Social</TabsTrigger>
                    <TabsTrigger value="display">Display</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="companyDescriptionNl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Description (Dutch)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter company description in Dutch..." 
                              {...field}
                              data-testid="input-company-description-nl"
                            />
                          </FormControl>
                          <FormDescription>
                            Brief description of your company for the footer (Dutch version)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="companyDescriptionEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Description (English)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter company description in English..." 
                              {...field}
                              data-testid="input-company-description-en"
                            />
                          </FormControl>
                          <FormDescription>
                            Brief description of your company for the footer (English version)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="copyrightText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Copyright Text</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="© 2024 BuildIt Professional. All rights reserved." 
                              {...field}
                              data-testid="input-copyright-text"
                            />
                          </FormControl>
                          <FormDescription>
                            Copyright notice to display at the bottom of the footer
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="newsletter" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="newsletterTitleNl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Newsletter Title (Dutch)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Stay Updated / Blijf op de hoogte" 
                              {...field}
                              data-testid="input-newsletter-title-nl"
                            />
                          </FormControl>
                          <FormDescription>
                            Newsletter section title in Dutch
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="newsletterTitleEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Newsletter Title (English)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Stay Updated" 
                              {...field}
                              data-testid="input-newsletter-title-en"
                            />
                          </FormControl>
                          <FormDescription>
                            Newsletter section title in English
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="newsletterDescriptionNl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Newsletter Description (Dutch)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Subscribe to our newsletter for updates..." 
                              {...field}
                              data-testid="input-newsletter-description-nl"
                            />
                          </FormControl>
                          <FormDescription>
                            Newsletter subscription description in Dutch
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="newsletterDescriptionEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Newsletter Description (English)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Subscribe to our newsletter for updates..." 
                              {...field}
                              data-testid="input-newsletter-description-en"
                            />
                          </FormControl>
                          <FormDescription>
                            Newsletter subscription description in English
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="social" className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="facebookUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Facebook className="w-4 h-4 text-blue-600" />
                              Facebook URL
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://facebook.com/yourcompany" 
                                {...field}
                                data-testid="input-facebook-url"
                              />
                            </FormControl>
                            <FormDescription>
                              Enter your Facebook page URL
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="twitterUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Twitter className="w-4 h-4 text-blue-400" />
                              Twitter URL
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://twitter.com/yourcompany" 
                                {...field}
                                data-testid="input-twitter-url"
                              />
                            </FormControl>
                            <FormDescription>
                              Enter your Twitter profile URL
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="linkedinUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Linkedin className="w-4 h-4 text-blue-700" />
                              LinkedIn URL
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://linkedin.com/company/yourcompany" 
                                {...field}
                                data-testid="input-linkedin-url"
                              />
                            </FormControl>
                            <FormDescription>
                              Enter your LinkedIn company page URL
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="instagramUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Instagram className="w-4 h-4 text-pink-500" />
                              Instagram URL
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://instagram.com/yourcompany" 
                                {...field}
                                data-testid="input-instagram-url"
                              />
                            </FormControl>
                            <FormDescription>
                              Enter your Instagram profile URL
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="youtubeUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Youtube className="w-4 h-4 text-red-600" />
                              YouTube URL
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://youtube.com/@yourcompany" 
                                {...field}
                                data-testid="input-youtube-url"
                              />
                            </FormControl>
                            <FormDescription>
                              Enter your YouTube channel URL
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="whatsappUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <MessageCircle className="w-4 h-4 text-green-500" />
                              WhatsApp URL
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://wa.me/31612345678" 
                                {...field}
                                data-testid="input-whatsapp-url"
                              />
                            </FormControl>
                            <FormDescription>
                              Enter your WhatsApp contact URL (wa.me format)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="display" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="showSocialMedia"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Show Social Media Links</FormLabel>
                            <FormDescription>
                              Display social media icons and links in the footer
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-show-social-media"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="showNewsletter"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Show Newsletter Subscription</FormLabel>
                            <FormDescription>
                              Display newsletter subscription form in the footer
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-show-newsletter"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="showServices"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Show Services Section</FormLabel>
                            <FormDescription>
                              Display services list in the footer
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-show-services"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      form.reset();
                    }}
                    data-testid="button-cancel-footer"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={saveSettingsMutation.isPending}
                    data-testid="button-save-footer-settings"
                  >
                    {saveSettingsMutation.isPending ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}