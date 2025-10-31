'use client';

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertTestimonialSchema, type Testimonial } from '@/lib/db/schema';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Edit, Star } from "lucide-react";
import { ImageUploadField } from "./image-upload-field";

// Form schema with Dutch to English fallback requirements
const testimonialFormSchema = insertTestimonialSchema.extend({
  testimonialNl: z.string().min(1, "Nederlandse testimonial is verplicht"),
  testimonialEn: z.string().optional(),
  customerName: z.string().min(1, "Klantnaam is verplicht"),
  customerTitle: z.string().optional(),
  projectType: z.string().optional(),
  location: z.string().optional(),
  rating: z.number().min(1).max(5),
  customerImage: z.string().optional(),
  isActive: z.boolean().optional(),
  featured: z.boolean().optional()
});

type TestimonialFormData = z.infer<typeof testimonialFormSchema>;

export default function TestimonialsEditor() {
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  // Fetch testimonials
  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ['/api/admin/testimonials'],
  });

  // Form setup
  const form = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      customerName: "",
      customerTitle: "",
      projectType: "",
      location: "",
      testimonialNl: "",
      testimonialEn: "",
      rating: 5,
      customerImage: "",
      isActive: true,
      featured: false
    }
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: TestimonialFormData) => {
      // Apply fallback logic for English fields
      const testimonialData = {
        ...data,
        testimonialEn: data.testimonialEn || data.testimonialNl
      };
      return apiRequest('/api/admin/testimonials', 'POST', testimonialData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials'] });
      setShowForm(false);
      form.reset();
      toast({
        title: "Testimonial aangemaakt",
        description: "De testimonial is succesvol aangemaakt."
      });
    },
    onError: () => {
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het aanmaken van de testimonial.",
        variant: "destructive"
      });
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TestimonialFormData> }) => {
      // Apply fallback logic for English fields
      const testimonialData = {
        ...data,
        testimonialEn: data.testimonialEn || data.testimonialNl
      };
      return apiRequest(`/api/admin/testimonials/${id}`, 'PATCH', testimonialData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials'] });
      setEditingTestimonial(null);
      setShowForm(false);
      form.reset();
      toast({
        title: "Testimonial bijgewerkt",
        description: "De testimonial is succesvol bijgewerkt."
      });
    },
    onError: () => {
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het bijwerken van de testimonial.",
        variant: "destructive"
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/admin/testimonials/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials'] });
      toast({
        title: "Testimonial verwijderd",
        description: "De testimonial is succesvol verwijderd."
      });
    },
    onError: () => {
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het verwijderen van de testimonial.",
        variant: "destructive"
      });
    }
  });

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setShowForm(true);
    form.reset({
      customerName: testimonial.customerName,
      customerTitle: testimonial.customerTitle || "",
      projectType: testimonial.projectType || "",
      location: testimonial.location || "",
      testimonialNl: testimonial.testimonialNl,
      testimonialEn: testimonial.testimonialEn,
      rating: testimonial.rating,
      customerImage: testimonial.customerImage || "",
      isActive: testimonial.isActive ?? true,
      featured: testimonial.featured ?? false
    });
  };

  const handleSubmit = (data: TestimonialFormData) => {
    if (editingTestimonial) {
      updateMutation.mutate({ id: editingTestimonial.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTestimonial(null);
    form.reset();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (isLoading) {
    return <div className="text-center py-8">Testimonials laden...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Klantbeoordelingen Beheer
        </h1>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
          data-testid="button-add-testimonial"
        >
          <Plus className="w-4 h-4" />
          Testimonial Toevoegen
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingTestimonial ? "Testimonial Bewerken" : "Nieuwe Testimonial"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Client Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Klantinformatie</h3>
                    
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Klantnaam *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-customer-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customerTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Klant Titel/Positie</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-customer-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="projectType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Type</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-project-type" placeholder="bv. Nieuwbouw, Renovatie" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Locatie</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-location" placeholder="bv. Amsterdam, Nederland" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Beoordeling</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value?.toString()}
                              onValueChange={(value) => field.onChange(parseInt(value))}
                            >
                              <SelectTrigger data-testid="select-rating">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <SelectItem key={rating} value={rating.toString()}>
                                    <div className="flex items-center gap-2">
                                      <span>{rating}</span>
                                      <div className="flex">
                                        {renderStars(rating)}
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Testimonial Content */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Testimonial Inhoud</h3>
                    
                    <FormField
                      control={form.control}
                      name="testimonialNl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Testimonial (Nederlands) *</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              rows={4}
                              data-testid="textarea-testimonial-nl"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="testimonialEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Testimonial (Engels)</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              rows={4}
                              data-testid="textarea-testimonial-en"
                              placeholder="Valt terug op Nederlandse testimonial"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <FormField
                  control={form.control}
                  name="customerImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Klantfoto</FormLabel>
                      <FormControl>
                        <ImageUploadField
                          label="Klantfoto"
                          value={field.value || ""}
                          onChange={field.onChange}
                          data-testid="upload-customer-image"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="switch-is-active"
                          />
                        </FormControl>
                        <FormLabel>Actief</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="switch-featured"
                          />
                        </FormControl>
                        <FormLabel>Uitgelicht</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    data-testid="button-cancel"
                  >
                    Annuleren
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-save"
                  >
                    {editingTestimonial ? "Bijwerken" : "Aanmaken"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">Testimonial van {testimonial.customerName}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">{renderStars(testimonial.rating)}</div>
                    <span className="text-sm text-gray-600">{testimonial.rating}/5</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(testimonial)}
                    data-testid={`button-edit-${testimonial.id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(testimonial.id)}
                    data-testid={`button-delete-${testimonial.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                "{testimonial.testimonialNl}"
              </p>
              
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">{testimonial.customerName}</span>
                  {testimonial.customerTitle && (
                    <>
                      <br />
                      <span className="text-gray-600">{testimonial.customerTitle}</span>
                    </>
                  )}
                  {testimonial.projectType && (
                    <>
                      <br />
                      <span className="text-gray-600">Project: {testimonial.projectType}</span>
                    </>
                  )}
                  {testimonial.location && (
                    <>
                      <br />
                      <span className="text-gray-600">{testimonial.location}</span>
                    </>
                  )}
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  {testimonial.isActive ? (
                    <Badge variant="default" data-testid={`badge-active-${testimonial.id}`}>Actief</Badge>
                  ) : (
                    <Badge variant="secondary" data-testid={`badge-inactive-${testimonial.id}`}>Inactief</Badge>
                  )}
                  {testimonial.featured && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800" data-testid={`badge-featured-${testimonial.id}`}>
                      Uitgelicht
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {testimonials.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600 mb-4">Nog geen testimonials aangemaakt.</p>
            <Button onClick={() => setShowForm(true)} data-testid="button-add-first-testimonial">
              <Plus className="w-4 h-4 mr-2" />
              Eerste Testimonial Toevoegen
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}