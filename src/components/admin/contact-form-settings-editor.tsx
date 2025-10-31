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
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Loader2,
  GripVertical,
  Eye,
  EyeOff,
  Type,
  Mail,
  Phone,
  MessageSquare,
  Building,
  User,
  Users,
  FileText,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { insertContactFormSettingSchema, ContactFormSetting } from '@/lib/db/schema';
import { apiRequest, queryClient } from "@/lib/queryClient";

const formSchema = insertContactFormSettingSchema;
type FormData = z.infer<typeof formSchema>;

// Predefined field types and their configurations
const FIELD_TYPES = [
  { value: "text", label: "Tekst", icon: Type },
  { value: "email", label: "E-mail", icon: Mail },
  { value: "tel", label: "Telefoon", icon: Phone },
  { value: "textarea", label: "Lange tekst", icon: MessageSquare },
  { value: "select", label: "Keuzemenu", icon: FileText },
];

// Predefined contact form fields based on the image
const DEFAULT_FIELDS = [
  {
    fieldKey: "firstName",
    labelNl: "Voornaam",
    labelEn: "First Name",
    placeholder: "Voer uw voornaam in",
    fieldType: "text",
    isRequired: true,
    isVisible: true,
    order: 1,
  },
  {
    fieldKey: "lastName",
    labelNl: "Achternaam",
    labelEn: "Last Name", 
    placeholder: "Voer uw achternaam in",
    fieldType: "text",
    isRequired: true,
    isVisible: true,
    order: 2,
  },
  {
    fieldKey: "email",
    labelNl: "E-mailadres",
    labelEn: "Email Address",
    placeholder: "Voer uw e-mailadres in",
    fieldType: "email",
    isRequired: true,
    isVisible: true,
    order: 3,
  },
  {
    fieldKey: "phone",
    labelNl: "Telefoonnummer",
    labelEn: "Phone Number",
    placeholder: "Voer uw telefoonnummer in",
    fieldType: "tel",
    isRequired: true,
    isVisible: true,
    order: 4,
  },
  {
    fieldKey: "company",
    labelNl: "Bedrijf",
    labelEn: "Company",
    placeholder: "Voer uw bedrijfsnaam in",
    fieldType: "text",
    isRequired: true,
    isVisible: true,
    order: 5,
  },
  {
    fieldKey: "projectType",
    labelNl: "Projecttype",
    labelEn: "Project Type",
    placeholder: "Selecteer een type",
    fieldType: "select",
    isRequired: true,
    isVisible: true,
    order: 6,
    options: [
      "Woningbouw",
      "Commerciële bouw", 
      "Renovatie",
      "Interieurdesign",
      "Advies",
      "Overig"
    ],
  },
  {
    fieldKey: "message",
    labelNl: "Projectbeschrijving",
    labelEn: "Project Description",
    placeholder: "Beschrijf uw project...",
    fieldType: "textarea",
    isRequired: true,
    isVisible: true,
    order: 7,
  }
];

interface ContactFormFieldEditorProps {
  field: ContactFormSetting | null;
  onSave: (data: FormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

function ContactFormFieldEditor({ field, onSave, onCancel, isLoading }: ContactFormFieldEditorProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fieldKey: "",
      labelNl: "",
      labelEn: "",
      placeholder: "",
      fieldType: "text",
      isRequired: true,
      isVisible: true,
      order: 0,
      options: [],
      validationRules: {},
    },
  });

  useEffect(() => {
    if (field) {
      form.reset({
        fieldKey: field.fieldKey || "",
        labelNl: field.labelNl || "",
        labelEn: field.labelEn || "",
        placeholder: field.placeholder || "",
        fieldType: field.fieldType || "text",
        isRequired: field.isRequired !== false,
        isVisible: field.isVisible !== false,
        order: field.order || 0,
        options: Array.isArray(field.options) ? field.options : [],
        validationRules: field.validationRules || {},
      });
    }
  }, [field, form]);

  const watchFieldType = form.watch("fieldType");
  const [optionsText, setOptionsText] = useState("");

  useEffect(() => {
    if (field?.options && Array.isArray(field.options)) {
      setOptionsText(field.options.join("\n"));
    }
  }, [field]);

  const onSubmit = (data: FormData) => {
    // Process options for select fields
    if (data.fieldType === "select" && optionsText.trim()) {
      data.options = optionsText.split("\n").map(opt => opt.trim()).filter(Boolean);
    } else {
      data.options = [];
    }
    onSave(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{field ? "Formulierveld bewerken" : "Nieuw veld toevoegen"}</CardTitle>
        <CardDescription>
          Configureer de instellingen van het contactformulier veld
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fieldKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Veldsleutel *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="firstName, lastName, email..."
                        {...field}
                        data-testid="input-field-key"
                      />
                    </FormControl>
                    <FormDescription>
                      Unieke identificatie voor het veld (Engels, zonder spaties)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fieldType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Veldtype *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || "text"}
                      data-testid="select-field-type"
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Kies een veldtype" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FIELD_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="w-4 h-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="labelNl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Veldlabel (Nederlands) *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Voornaam, Achternaam..."
                        {...field}
                        data-testid="input-label-nl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="labelEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Veldlabel (Engels) *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="First Name, Last Name..."
                        {...field}
                        data-testid="input-label-en"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="placeholder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plaatshouder tekst</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Voer uw voornaam in..."
                      {...field}
                      value={field.value || ""}
                      data-testid="input-placeholder"
                    />
                  </FormControl>
                  <FormDescription>
                    De tekst die in het veld verschijnt als gids voor de gebruiker
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchFieldType === "select" && (
              <div>
                <FormLabel>Dropdown opties</FormLabel>
                <Textarea
                  placeholder="Voer elke optie op een aparte regel in&#10;Voorbeeld:&#10;Woningbouw&#10;Commerciële bouw&#10;Renovatie"
                  value={optionsText}
                  onChange={(e) => setOptionsText(e.target.value)}
                  rows={6}
                  className="mt-2"
                  data-testid="textarea-options"
                />
                <FormDescription className="mt-2">
                  Voer elke optie op een aparte regel in
                </FormDescription>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Veldvolgorde</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="0"
                        {...field}
                        value={field.value ?? 0}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        data-testid="input-order"
                      />
                    </FormControl>
                    <FormDescription>
                      Volgorde waarin het veld in het formulier verschijnt
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isRequired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Verplicht veld</FormLabel>
                      <FormDescription>
                        Moet dit veld ingevuld worden?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value ?? true}
                        onCheckedChange={field.onChange}
                        data-testid="switch-required"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isVisible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Zichtbaar veld</FormLabel>
                      <FormDescription>
                        Wordt dit veld getoond in het formulier?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value ?? true}
                        onCheckedChange={field.onChange}
                        data-testid="switch-visible"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                data-testid="button-save-field"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                <Save className="w-4 h-4 mr-2" />
                Veld opslaan
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                data-testid="button-cancel-field"
              >
                Annuleren
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export function ContactFormSettingsEditor() {
  const { toast } = useToast();
  const [editingField, setEditingField] = useState<ContactFormSetting | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data: formSettings = [], isLoading } = useQuery<ContactFormSetting[]>({
    queryKey: ['/api/admin/contact-form-settings'],
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await apiRequest('/api/admin/contact-form-settings', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contact-form-settings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/contact-form-settings'] });
      toast({ title: "Veld succesvol aangemaakt" });
      setIsCreating(false);
    },
    onError: (error) => {
      console.error('Create field error:', error);
      toast({
        title: "Veld aanmaken mislukt",
        variant: "destructive",
      });
    },
  });

  // Update mutation with enhanced error handling
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<FormData> }) => {
      console.log('Updating field:', { id, data }); // Debug logging
      return await apiRequest(`/api/admin/contact-form-settings/${id}`, 'PUT', data);
    },
    onSuccess: (result, variables) => {
      console.log('Update successful:', { result, variables }); // Debug logging
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contact-form-settings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/contact-form-settings'] });
      toast({ title: "Veld succesvol bijgewerkt" });
      setEditingField(null);
    },
    onError: (error: any, variables) => {
      console.error('Update field error:', { error, variables, details: error.response?.data }); // Enhanced logging
      
      let errorMessage = "Er is een onbekende fout opgetreden";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Veld bijwerken mislukt",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/admin/contact-form-settings/${id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contact-form-settings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/contact-form-settings'] });
      toast({ title: "Veld succesvol verwijderd" });
    },
    onError: (error) => {
      console.error('Delete field error:', error);
      toast({
        title: "Veld verwijderen mislukt",
        variant: "destructive",
      });
    },
  });

  // Initialize default fields using robust API endpoint
  const initializeMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/admin/contact-form-settings/initialize', 'POST');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contact-form-settings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/contact-form-settings'] });
      toast({ 
        title: "Standaard formulier geïnitialiseerd", 
        description: `${data.createdFields} van ${data.totalFields} velden succesvol aangemaakt`
      });
    },
    onError: (error: any) => {
      console.error('Initialize default fields error:', error);
      
      // Handle specific error cases
      if (error.response?.status === 409) {
        toast({
          title: "Formulier al geïnitialiseerd",
          description: "Het contactformulier bevat al configuratie-instellingen",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Standaard formulier initialiseren mislukt",
          description: error.response?.data?.message || "Er is een onbekende fout opgetreden",
          variant: "destructive",
        });
      }
    },
  });

  const initializeDefaultFields = () => {
    initializeMutation.mutate();
  };

  const handleSaveField = (data: FormData) => {
    if (editingField) {
      updateMutation.mutate({ id: editingField.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Movement mutation for reordering fields
  const moveMutation = useMutation({
    mutationFn: async ({ updates }: { updates: Array<{ id: string; order: number }> }) => {
      console.log('Starting move mutation with updates:', updates);
      
      // Sequential updates instead of parallel to avoid conflicts
      const results = [];
      for (const update of updates) {
        console.log('Updating field:', update);
        try {
          const result = await apiRequest(`/api/admin/contact-form-settings/${update.id}`, 'PUT', { order: update.order });
          console.log('Update successful for field:', update.id, result);
          results.push(result);
        } catch (error) {
          console.error('Failed to update field:', update.id, error);
          throw new Error(`Failed to update field ${update.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
      
      console.log('All updates completed successfully:', results);
      return results;
    },
    onSuccess: (data) => {
      console.log('Move mutation completed successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contact-form-settings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/contact-form-settings'] });
      toast({ title: "Volgorde succesvol bijgewerkt" });
    },
    onError: (error) => {
      console.error('Move field error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Er ging iets mis bij het wijzigen van de volgorde';
      toast({
        title: "Volgorde bijwerken mislukt",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleMoveField = (fieldId: string, direction: 'up' | 'down') => {
    if (moveMutation.isPending) return; // Prevent multiple moves at once
    
    const field = formSettings.find(f => f.id === fieldId);
    if (!field) return;

    const sortedFields = [...formSettings].sort((a, b) => (a.order || 0) - (b.order || 0));
    const currentIndex = sortedFields.findIndex(f => f.id === fieldId);
    
    if (direction === 'up' && currentIndex > 0) {
      const targetField = sortedFields[currentIndex - 1];
      // Swap orders in a single transaction
      moveMutation.mutate({
        updates: [
          { id: fieldId, order: targetField.order || 0 },
          { id: targetField.id, order: field.order || 0 }
        ]
      });
    } else if (direction === 'down' && currentIndex < sortedFields.length - 1) {
      const targetField = sortedFields[currentIndex + 1];
      // Swap orders in a single transaction
      moveMutation.mutate({
        updates: [
          { id: fieldId, order: targetField.order || 0 },
          { id: targetField.id, order: field.order || 0 }
        ]
      });
    }
  };

  const sortedFields = [...formSettings].sort((a, b) => (a.order || 0) - (b.order || 0));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card data-testid="contact-form-settings-overview">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Contactformulier instellingen
              </CardTitle>
              <CardDescription>
                Uitgebreid beheer van contactformulier velden en instellingen
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {formSettings.length === 0 && (
                <Button
                  onClick={initializeDefaultFields}
                  variant="outline"
                  disabled={initializeMutation.isPending}
                  data-testid="button-init-default"
                >
                  {initializeMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Standaard formulier initialiseren
                </Button>
              )}
              <Button
                onClick={() => setIsCreating(true)}
                data-testid="button-add-field"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nieuw veld toevoegen
              </Button>
            </div>
          </div>
        </CardHeader>

        {formSettings.length > 0 && (
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4">
                {sortedFields.map((field, index) => (
                  <Card key={field.id} className="relative" data-testid={`field-card-${field.fieldKey}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveField(field.id, 'up')}
                              disabled={index === 0 || moveMutation.isPending}
                              data-testid={`button-move-up-${field.fieldKey}`}
                            >
                              <ChevronUp className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveField(field.id, 'down')}
                              disabled={index === sortedFields.length - 1 || moveMutation.isPending}
                              data-testid={`button-move-down-${field.fieldKey}`}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <GripVertical className="w-4 h-4 text-gray-400" />
                            <Badge variant="outline" data-testid={`badge-order-${field.fieldKey}`}>
                              #{field.order}
                            </Badge>
                          </div>

                          <div className="flex-1">
                            <h3 className="font-semibold flex items-center gap-2">
                              {field.labelNl || field.fieldKey}
                              {field.isRequired && (
                                <Badge variant="destructive" className="text-xs">
                                  Verplicht
                                </Badge>
                              )}
                              {!field.isVisible && (
                                <Badge variant="secondary" className="text-xs">
                                  Verborgen
                                </Badge>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {field.fieldType} • {field.fieldKey}
                            </p>
                            {field.placeholder && (
                              <p className="text-xs text-gray-500 mt-1">
                                "{field.placeholder}"
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingField(field)}
                            data-testid={`button-edit-${field.fieldKey}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMutation.mutate(field.id)}
                            disabled={deleteMutation.isPending}
                            data-testid={`button-delete-${field.fieldKey}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Field Editor */}
      {(isCreating || editingField) && (
        <ContactFormFieldEditor
          field={editingField}
          onSave={handleSaveField}
          onCancel={() => {
            setIsCreating(false);
            setEditingField(null);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
}