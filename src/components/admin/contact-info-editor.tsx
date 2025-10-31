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
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Plus, 
  Edit, 
  Trash2,
  Building
} from "lucide-react";
import { insertContactInfoSchema, ContactInfo } from '@/lib/db/schema';
import { apiRequest, queryClient } from "@/lib/queryClient";

const formSchema = insertContactInfoSchema;

interface ContactInfoFormData {
  type: string;
  labelNl: string;
  labelEn: string;
  value: string;
  icon?: string;
  isActive?: boolean;
  order?: number;
}

export function ContactInfoEditor() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch contact info from admin API
  const { data: contactInfo = [], isLoading } = useQuery<ContactInfo[]>({
    queryKey: ['/api/admin/contact-info'],
  });

  const form = useForm<ContactInfoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      labelNl: "",
      labelEn: "",
      value: "",
      icon: "",
      isActive: true,
      order: 0,
    },
  });

  // Create contact info mutation
  const createMutation = useMutation({
    mutationFn: async (data: ContactInfoFormData) => {
      return await apiRequest('/api/admin/contact-info', 'POST', data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Contact information created successfully!",
      });
      setIsCreating(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contact-info'] });
      queryClient.invalidateQueries({ queryKey: ['/api/contact-info'] });
    },
    onError: (error) => {
      console.error('Contact info creation error:', error);
      toast({
        title: "Error",
        description: "Failed to create contact information. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update contact info mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ContactInfoFormData }) => {
      return await apiRequest(`/api/admin/contact-info/${id}`, 'PUT', data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Contact information updated successfully!",
      });
      setIsEditing(null);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contact-info'] });
      queryClient.invalidateQueries({ queryKey: ['/api/contact-info'] });
    },
    onError: (error) => {
      console.error('Contact info update error:', error);
      toast({
        title: "Error",
        description: "Failed to update contact information. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete contact info mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/admin/contact-info/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Contact information deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contact-info'] });
      queryClient.invalidateQueries({ queryKey: ['/api/contact-info'] });
    },
    onError: (error) => {
      console.error('Contact info deletion error:', error);
      toast({
        title: "Error",
        description: "Failed to delete contact information. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (data: ContactInfoFormData) => {
    if (isEditing) {
      updateMutation.mutate({ id: isEditing, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const startEditing = (info: ContactInfo) => {
    setIsEditing(info.id);
    setIsCreating(false);
    form.reset({
      type: info.type,
      labelNl: info.labelNl,
      labelEn: info.labelEn,
      value: info.value,
      icon: info.icon || "",
      isActive: info.isActive ?? true,
      order: info.order || 0,
    });
  };

  const startCreating = () => {
    setIsCreating(true);
    setIsEditing(null);
    form.reset({
      type: "",
      labelNl: "",
      labelEn: "",
      value: "",
      icon: "",
      isActive: true,
      order: contactInfo.length,
    });
  };

  const cancelEditing = () => {
    setIsEditing(null);
    setIsCreating(false);
    form.reset();
  };

  const getIconByType = (type: string) => {
    switch (type) {
      case 'phone': return <Phone className="w-5 h-5" />;
      case 'email': return <Mail className="w-5 h-5" />;
      case 'address': return <MapPin className="w-5 h-5" />;
      case 'hours': return <Clock className="w-5 h-5" />;
      default: return <Building className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'phone': return 'bg-blue-500';
      case 'email': return 'bg-green-500';
      case 'address': return 'bg-orange-500';
      case 'hours': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
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
          <h2 className="text-2xl font-bold" data-testid="heading-contact-info">Contact Information</h2>
          <p className="text-muted-foreground">
            Manage contact details displayed on your website
          </p>
        </div>
        <Button 
          onClick={startCreating}
          data-testid="button-add-contact-info"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Contact Info
        </Button>
      </div>

      {/* Contact Info List */}
      <div className="grid gap-4">
        {contactInfo.map((info) => (
          <Card key={info.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${getTypeColor(info.type)} rounded-lg flex items-center justify-center text-white`}>
                    {getIconByType(info.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold" data-testid={`text-contact-label-${info.id}`}>
                      {info.labelNl} / {info.labelEn}
                    </h4>
                    <p className="text-sm text-muted-foreground" data-testid={`text-contact-value-${info.id}`}>
                      {info.value}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" data-testid={`badge-contact-type-${info.id}`}>
                        {info.type}
                      </Badge>
                      <Badge variant={info.isActive ? "default" : "secondary"} data-testid={`badge-contact-status-${info.id}`}>
                        {info.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEditing(info)}
                    data-testid={`button-edit-contact-${info.id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate(info.id)}
                    data-testid={`button-delete-contact-${info.id}`}
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
            <CardTitle data-testid="title-contact-form">
              {isEditing ? "Edit Contact Information" : "Add Contact Information"}
            </CardTitle>
            <CardDescription>
              Configure contact details for your website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Type</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger data-testid="select-contact-type">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="phone">Phone</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="address">Address</SelectItem>
                              <SelectItem value="hours">Business Hours</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          Type of contact information
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
                          <Input 
                            type="number" 
                            {...field}
                            value={field.value || 0}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            data-testid="input-contact-order"
                          />
                        </FormControl>
                        <FormDescription>
                          Order of appearance (0 = first)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="labelNl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Label (Dutch)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Telefoon, E-mail, Adres..." 
                            {...field}
                            data-testid="input-contact-label-nl"
                          />
                        </FormControl>
                        <FormDescription>
                          Label to display in Dutch
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="labelEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Label (English)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Phone, Email, Address..." 
                            {...field}
                            data-testid="input-contact-label-en"
                          />
                        </FormControl>
                        <FormDescription>
                          Label to display in English
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Value</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter contact information..." 
                          {...field}
                          data-testid="textarea-contact-value"
                        />
                      </FormControl>
                      <FormDescription>
                        The actual contact information (phone number, email, address, etc.)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon Name (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="phone, mail, map-pin..." 
                          {...field}
                          data-testid="input-contact-icon"
                        />
                      </FormControl>
                      <FormDescription>
                        Lucide icon name (optional)
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
                          Display this contact information on the website
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-contact-active"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelEditing}
                    data-testid="button-cancel-contact"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-save-contact-info"
                  >
                    {createMutation.isPending || updateMutation.isPending 
                      ? "Saving..." 
                      : isEditing ? "Update" : "Create"}
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