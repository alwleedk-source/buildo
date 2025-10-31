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
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BarChart3, Plus, Edit, Trash2, Save, X } from "lucide-react";
import { insertMaatschappelijkeStatisticSchema, MaatschappelijkeStatistic } from '@/lib/db/schema';
import { apiRequest, queryClient } from "@/lib/queryClient";

const formSchema = insertMaatschappelijkeStatisticSchema.extend({
  order: z.coerce.number().min(0),
});

type FormData = z.infer<typeof formSchema>;

export function MaatschappelijkeStatisticsEditor() {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: statistics = [], isLoading } = useQuery<MaatschappelijkeStatistic[]>({
    queryKey: ['/api/admin/maatschappelijke-statistics'],
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => apiRequest('POST', '/api/admin/maatschappelijke-statistics', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/maatschappelijke-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/maatschappelijke-statistics'] });
      toast({ title: "Statistiek succesvol aangemaakt" });
      setEditingId(null);
    },
    onError: () => {
      toast({ 
        title: "Fout bij aanmaken statistiek", 
        variant: "destructive" 
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => 
      apiRequest('PUT', `/api/admin/maatschappelijke-statistics/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/maatschappelijke-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/maatschappelijke-statistics'] });
      toast({ title: "Statistiek succesvol bijgewerkt" });
      setEditingId(null);
    },
    onError: () => {
      toast({ 
        title: "Fout bij bijwerken statistiek", 
        variant: "destructive" 
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/admin/maatschappelijke-statistics/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/maatschappelijke-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/maatschappelijke-statistics'] });
      toast({ title: "Statistiek succesvol verwijderd" });
    },
    onError: () => {
      toast({ 
        title: "Fout bij verwijderen statistiek", 
        variant: "destructive" 
      });
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      labelNl: "",
      labelEn: "",
      value: "",
      description: "",
      icon: "",
      order: 0,
      isActive: true,
    },
  });

  const onSubmit = (data: FormData) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (statistic: MaatschappelijkeStatistic) => {
    setEditingId(statistic.id);
    form.reset({
      labelNl: statistic.labelNl,
      labelEn: statistic.labelEn ?? "",
      value: statistic.value,
      description: statistic.description ?? "",
      icon: statistic.icon ?? "",
      order: statistic.order,
      isActive: statistic.isActive ?? true,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    form.reset({
      labelNl: "",
      labelEn: "",
      value: "",
      description: "",
      icon: "",
      order: 0,
      isActive: true,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Weet je zeker dat je deze statistiek wilt verwijderen?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Statistieken laden...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Statistieken Beheer - Maatschappelijke Initiatieven
          </CardTitle>
          <CardDescription>
            Beheer de statistieken die worden weergegeven op de Maatschappelijke Initiatieven pagina
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Form for Creating/Editing */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="labelNl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label (NL) *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="bijv. Projecten Voltooid"
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
                      <FormLabel>Label (EN)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          placeholder="e.g. Projects Completed"
                          data-testid="input-label-en"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Waarde *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="bijv. 250+"
                          data-testid="input-value"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icoon</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          placeholder="bijv. Target, Users, Award"
                          data-testid="input-icon"
                        />
                      </FormControl>
                      <FormDescription>
                        Lucide icoon naam (optioneel)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beschrijving</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Extra uitleg over de statistiek (optioneel)"
                        rows={3}
                        data-testid="textarea-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Volgorde</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="0"
                          data-testid="input-order"
                        />
                      </FormControl>
                      <FormDescription>
                        Lagere nummers worden eerst getoond
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Actief</FormLabel>
                        <FormDescription>
                          Statistiek zichtbaar op website
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
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? "Bijwerken" : "Aanmaken"}
                </Button>

                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    data-testid="button-cancel"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Annuleren
                  </Button>
                )}
              </div>
            </form>
          </Form>

          <Separator />

          {/* List of Existing Statistics */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Bestaande Statistieken</h3>
            
            {statistics.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Nog geen statistieken toegevoegd. Maak de eerste aan met het formulier hierboven.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {statistics.map((statistic) => (
                  <Card key={statistic.id} className={editingId === statistic.id ? "border-primary" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={statistic.isActive ? "default" : "secondary"}>
                              {statistic.isActive ? "Actief" : "Inactief"}
                            </Badge>
                            <Badge variant="outline">Volgorde: {statistic.order}</Badge>
                          </div>
                          
                          <h4 className="font-medium text-lg">
                            {statistic.labelNl}
                            {statistic.labelEn && (
                              <span className="text-muted-foreground ml-2">
                                ({statistic.labelEn})
                              </span>
                            )}
                          </h4>
                          
                          <p className="text-2xl font-bold text-primary mt-1">
                            {statistic.value}
                          </p>
                          
                          {statistic.description && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {statistic.description}
                            </p>
                          )}
                          
                          {statistic.icon && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Icoon: {statistic.icon}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(statistic)}
                            data-testid={`button-edit-${statistic.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(statistic.id)}
                            disabled={deleteMutation.isPending}
                            data-testid={`button-delete-${statistic.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}