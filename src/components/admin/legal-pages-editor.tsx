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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2,
  Eye,
  ShieldCheck,
  BookOpen,
  Cookie
} from "lucide-react";
import { insertLegalPageSchema, LegalPage } from '@/lib/db/schema';
import { apiRequest, queryClient } from "@/lib/queryClient";

const formSchema = insertLegalPageSchema;

interface LegalPageFormData {
  titleNl: string;
  titleEn: string;
  contentNl: string;
  contentEn: string;
  slugNl: string;
  slugEn: string;
  pageType: string;
  showInFooter?: boolean;
  order?: number;
  isActive?: boolean;
}

export function LegalPagesEditor() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch legal pages from admin API
  const { data: legalPages = [], isLoading } = useQuery<LegalPage[]>({
    queryKey: ['/api/admin/legal-pages'],
  });

  const form = useForm<LegalPageFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titleNl: "",
      titleEn: "",
      contentNl: "",
      contentEn: "",
      slugNl: "",
      slugEn: "",
      pageType: "",
      showInFooter: true,
      order: 0,
      isActive: true,
    },
  });

  // Create legal page mutation
  const createMutation = useMutation({
    mutationFn: async (data: LegalPageFormData) => {
      return await apiRequest('POST', '/api/admin/legal-pages', data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Legal page created successfully!",
      });
      setIsCreating(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/admin/legal-pages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/legal-pages'] });
    },
    onError: (error) => {
      console.error('Legal page creation error:', error);
      toast({
        title: "Error",
        description: "Failed to create legal page. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update legal page mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: LegalPageFormData }) => {
      return await apiRequest('PUT', `/api/admin/legal-pages/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Legal page updated successfully!",
      });
      setIsEditing(null);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/admin/legal-pages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/legal-pages'] });
    },
    onError: (error) => {
      console.error('Legal page update error:', error);
      toast({
        title: "Error",
        description: "Failed to update legal page. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete legal page mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/admin/legal-pages/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Legal page deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/legal-pages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/legal-pages'] });
    },
    onError: (error) => {
      console.error('Legal page deletion error:', error);
      toast({
        title: "Error",
        description: "Failed to delete legal page. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (data: LegalPageFormData) => {
    if (isEditing) {
      updateMutation.mutate({ id: isEditing, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const startEditing = (page: LegalPage) => {
    setIsEditing(page.id);
    setIsCreating(false);
    form.reset({
      titleNl: page.titleNl,
      titleEn: page.titleEn,
      contentNl: page.contentNl,
      contentEn: page.contentEn,
      slugNl: page.slugNl,
      slugEn: page.slugEn,
      pageType: page.pageType,
      showInFooter: page.showInFooter ?? true,
      order: page.order || 0,
      isActive: page.isActive ?? true,
    });
  };

  const startCreating = () => {
    setIsCreating(true);
    setIsEditing(null);
    form.reset({
      titleNl: "",
      titleEn: "",
      contentNl: "",
      contentEn: "",
      slugNl: "",
      slugEn: "",
      pageType: "",
      showInFooter: true,
      order: legalPages.length,
      isActive: true,
    });
  };

  const cancelEditing = () => {
    setIsEditing(null);
    setIsCreating(false);
    form.reset();
  };

  const getIconByType = (type: string) => {
    switch (type) {
      case 'privacy': return <ShieldCheck className="w-5 h-5" />;
      case 'terms': return <BookOpen className="w-5 h-5" />;
      case 'cookies': return <Cookie className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'privacy': return 'bg-blue-500';
      case 'terms': return 'bg-green-500';
      case 'cookies': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
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
          <h2 className="text-2xl font-bold" data-testid="heading-legal-pages">Legal Pages</h2>
          <p className="text-muted-foreground">
            Manage privacy policy, terms & conditions, and other legal content
          </p>
        </div>
        <Button 
          onClick={startCreating}
          data-testid="button-add-legal-page"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Legal Page
        </Button>
      </div>

      {/* Legal Pages List */}
      <div className="grid gap-4">
        {legalPages.map((page) => (
          <Card key={page.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${getTypeColor(page.pageType)} rounded-lg flex items-center justify-center text-white`}>
                    {getIconByType(page.pageType)}
                  </div>
                  <div>
                    <h4 className="font-semibold" data-testid={`text-legal-title-${page.id}`}>
                      {page.titleNl} / {page.titleEn}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" data-testid={`badge-legal-type-${page.id}`}>
                        {page.pageType}
                      </Badge>
                      <Badge variant={page.isActive ? "default" : "secondary"} data-testid={`badge-legal-status-${page.id}`}>
                        {page.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {page.showInFooter && (
                        <Badge variant="outline" data-testid={`badge-footer-${page.id}`}>
                          In Footer
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1" data-testid={`text-legal-slugs-${page.id}`}>
                      Slugs: /{page.slugNl} | /{page.slugEn}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/legal/${page.slugNl}`, '_blank')}
                    data-testid={`button-preview-${page.id}`}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEditing(page)}
                    data-testid={`button-edit-legal-${page.id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate(page.id)}
                    data-testid={`button-delete-legal-${page.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Form */}
      {(isCreating || isEditing) && (
        <Card>
          <CardHeader>
            <CardTitle data-testid="title-legal-form">
              {isEditing ? "Edit Legal Page" : "Add Legal Page"}
            </CardTitle>
            <CardDescription>
              Create or edit legal content with bilingual support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <Tabs defaultValue="content" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="titleNl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title (Dutch)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Privacy Beleid, Algemene Voorwaarden..." 
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  if (!form.getValues('slugNl')) {
                                    form.setValue('slugNl', generateSlug(e.target.value));
                                  }
                                }}
                                data-testid="input-title-nl"
                              />
                            </FormControl>
                            <FormDescription>
                              Page title in Dutch
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
                            <FormLabel>Title (English)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Privacy Policy, Terms & Conditions..." 
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  if (!form.getValues('slugEn')) {
                                    form.setValue('slugEn', generateSlug(e.target.value));
                                  }
                                }}
                                data-testid="input-title-en"
                              />
                            </FormControl>
                            <FormDescription>
                              Page title in English
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="contentNl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content (Dutch)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter Dutch content (HTML supported)..." 
                              rows={10}
                              {...field}
                              data-testid="textarea-content-nl"
                            />
                          </FormControl>
                          <FormDescription>
                            Legal content in Dutch (HTML formatting supported)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contentEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content (English)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter English content (HTML supported)..." 
                              rows={10}
                              {...field}
                              data-testid="textarea-content-en"
                            />
                          </FormControl>
                          <FormDescription>
                            Legal content in English (HTML formatting supported)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="pageType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Page Type</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger data-testid="select-page-type">
                                <SelectValue placeholder="Select page type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="privacy">Privacy Policy</SelectItem>
                                <SelectItem value="terms">Terms & Conditions</SelectItem>
                                <SelectItem value="cookies">Cookie Policy</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription>
                            Category of legal page
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="slugNl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL Slug (Dutch)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="privacy-beleid, algemene-voorwaarden..." 
                                {...field}
                                data-testid="input-slug-nl"
                              />
                            </FormControl>
                            <FormDescription>
                              URL path for Dutch version
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="slugEn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL Slug (English)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="privacy-policy, terms-conditions..." 
                                {...field}
                                data-testid="input-slug-en"
                              />
                            </FormControl>
                            <FormDescription>
                              URL path for English version
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="order"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Order</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field}
                                value={field.value || 0}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                data-testid="input-legal-order"
                              />
                            </FormControl>
                            <FormDescription>
                              Order in footer (0 = first)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="showInFooter"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Show in Footer</FormLabel>
                            <FormDescription>
                              Display link to this page in the website footer
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-show-footer"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Active</FormLabel>
                            <FormDescription>
                              Make this page publicly accessible
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-legal-active"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="preview" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Dutch Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <h3 className="font-semibold mb-2">{form.watch('titleNl')}</h3>
                          <div 
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ 
                              __html: form.watch('contentNl') || '<p>No content yet...</p>' 
                            }}
                          />
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">English Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <h3 className="font-semibold mb-2">{form.watch('titleEn')}</h3>
                          <div 
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ 
                              __html: form.watch('contentEn') || '<p>No content yet...</p>' 
                            }}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelEditing}
                    data-testid="button-cancel-legal"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-save-legal-page"
                  >
                    {createMutation.isPending || updateMutation.isPending 
                      ? "Saving..." 
                      : isEditing ? "Update Page" : "Create Page"}
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