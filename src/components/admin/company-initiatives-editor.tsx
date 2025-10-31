'use client';

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, Plus, Edit, Trash2, Save, X } from "lucide-react";
import { insertCompanyInitiativeSchema, CompanyInitiative } from '@/lib/db/schema';
import { apiRequest, queryClient } from "@/lib/queryClient";

const formSchema = insertCompanyInitiativeSchema.extend({
  order: z.coerce.number().min(0),
});

type FormData = z.infer<typeof formSchema>;

export function CompanyInitiativesEditor() {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: initiatives = [], isLoading } = useQuery<CompanyInitiative[]>({
    queryKey: ['/api/admin/company-initiatives'],
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => apiRequest('/api/admin/company-initiatives', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/company-initiatives'] });
      queryClient.invalidateQueries({ queryKey: ['/api/company-initiatives'] });
      toast({ title: "Initiative created successfully" });
      setEditingId(null);
    },
    onError: () => {
      toast({ 
        title: "Error creating initiative", 
        variant: "destructive" 
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => 
      apiRequest(`/api/admin/company-initiatives/${id}`, 'PUT', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/company-initiatives'] });
      queryClient.invalidateQueries({ queryKey: ['/api/company-initiatives'] });
      toast({ title: "Initiative updated successfully" });
      setEditingId(null);
    },
    onError: () => {
      toast({ 
        title: "Error updating initiative", 
        variant: "destructive" 
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/admin/company-initiatives/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/company-initiatives'] });
      queryClient.invalidateQueries({ queryKey: ['/api/company-initiatives'] });
      toast({ title: "Initiative deleted successfully" });
    },
    onError: () => {
      toast({ 
        title: "Error deleting initiative", 
        variant: "destructive" 
      });
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titleNl: "",
      titleEn: "",
      descriptionNl: "",
      descriptionEn: "",
      icon: "",
      image: "",
      category: "community",
      isActive: true,
      order: 0,
    },
  });

  const onSubmit = (data: FormData) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (initiative: CompanyInitiative) => {
    form.reset({
      titleNl: initiative.titleNl || "",
      titleEn: initiative.titleEn || "",
      descriptionNl: initiative.descriptionNl || "",
      descriptionEn: initiative.descriptionEn || "",
      icon: initiative.icon || "",
      image: initiative.image || "",
      category: initiative.category || "community",
      isActive: initiative.isActive !== false,
      order: Number(initiative.order) || 0,
    });
    setEditingId(initiative.id);
  };

  const handleCancel = () => {
    form.reset();
    setEditingId(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading Company Initiatives...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight" data-testid="text-initiatives-title">Company Initiatives</h2>
          <p className="text-muted-foreground">
            Manage your company's community and sustainability initiatives
          </p>
        </div>
        <Button 
          onClick={() => setEditingId('new')} 
          disabled={editingId !== null}
          data-testid="button-add-initiative"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Initiative
        </Button>
      </div>

      {/* Form */}
      {editingId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{editingId === 'new' ? 'Create' : 'Edit'} Initiative</span>
              <Button variant="ghost" size="sm" onClick={handleCancel} data-testid="button-cancel">
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="titleNl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (Dutch) *</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} data-testid="input-title-nl" />
                        </FormControl>
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
                          <Input {...field} value={field.value || ""} data-testid="input-title-en" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="descriptionNl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Dutch) *</FormLabel>
                        <FormControl>
                          <Textarea {...field} value={field.value || ""} rows={4} data-testid="input-description-nl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="descriptionEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (English)</FormLabel>
                        <FormControl>
                          <Textarea {...field} value={field.value || ""} rows={4} data-testid="input-description-en" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || "community"}>
                          <FormControl>
                            <SelectTrigger data-testid="select-category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="community">Community</SelectItem>
                            <SelectItem value="environment">Environment</SelectItem>
                            <SelectItem value="sustainability">Sustainability</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="health">Health</SelectItem>
                            <SelectItem value="innovation">Innovation</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon (Lucide name)</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} placeholder="heart, leaf, users..." data-testid="input-icon" />
                        </FormControl>
                        <FormDescription>
                          Enter a Lucide icon name
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Order</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? 0} type="number" min="0" data-testid="input-order" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="https://..." data-testid="input-image" />
                      </FormControl>
                      <FormDescription>
                        Optional image URL for the initiative
                      </FormDescription>
                      <FormMessage />
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
                          Whether this initiative is visible on the website
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value ?? true}
                          onCheckedChange={field.onChange}
                          data-testid="switch-active"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-save"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {editingId === 'new' ? 'Create' : 'Update'} Initiative
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel} data-testid="button-cancel-form">
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Initiatives List */}
      <div className="grid gap-4">
        {initiatives.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Heart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No initiatives yet</h3>
              <p className="text-muted-foreground text-center">
                Create your first company initiative to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          initiatives.map((initiative) => (
            <Card key={initiative.id} className="relative">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold" data-testid={`text-initiative-title-${initiative.id}`}>
                        {initiative.titleNl}
                      </h3>
                      <Badge variant={initiative.category === 'community' ? 'default' : 'secondary'}>
                        {initiative.category}
                      </Badge>
                      {!initiative.isActive && (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </div>
                    {initiative.titleEn && (
                      <p className="text-sm text-muted-foreground mb-2">
                        EN: {initiative.titleEn}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground mb-4">
                      {initiative.descriptionNl}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {initiative.icon && <span>Icon: {initiative.icon}</span>}
                      <span>Order: {initiative.order}</span>
                      {initiative.image && <span>Has image</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(initiative)}
                      disabled={editingId !== null}
                      data-testid={`button-edit-${initiative.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMutation.mutate(initiative.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-${initiative.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}