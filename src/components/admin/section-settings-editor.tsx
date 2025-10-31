'use client';

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { SectionSetting, InsertSectionSetting } from '@/lib/db/schema';

export function SectionSettingsEditor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSectionKey, setSelectedSectionKey] = useState<string>("");
  
  const { data: settings = [], isLoading } = useQuery<SectionSetting[]>({
    queryKey: ["/api/admin/section-settings"],
  });

  // Available sections for dropdown
  const availableSections = [
    { key: "hero", nameNl: "Hero Sectie", nameEn: "Hero Section" },
    { key: "statistics", nameNl: "Statistieken", nameEn: "Statistics" },
    { key: "about", nameNl: "Over Ons", nameEn: "About Us" },
    { key: "services", nameNl: "Diensten", nameEn: "Services" },
    { key: "projects", nameNl: "Projecten", nameEn: "Projects" },
    { key: "blog", nameNl: "Blog", nameEn: "Blog" },
    { key: "partners", nameNl: "Partners", nameEn: "Partners" },
    { key: "contact", nameNl: "Contact", nameEn: "Contact" },
    { key: "maatschappelijke", nameNl: "Maatschappelijke Verantwoordelijkheid", nameEn: "Corporate Responsibility" },
  ];

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertSectionSetting> }) => {
      return await apiRequest(`/api/admin/section-settings/${id}`, "PUT", data);
    },
    onSuccess: () => {
      // Force refresh all section-related queries
      queryClient.invalidateQueries({ queryKey: ["/api/section-settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/section-settings"] });
      
      // Force refetch immediately
      queryClient.refetchQueries({ queryKey: ["/api/section-settings"] });
      
      // Clear all cached data to ensure fresh fetch
      queryClient.removeQueries({ queryKey: ["/api/section-settings"] });
      
      toast({ title: "Succes", description: "Sectie-instelling succesvol bijgewerkt" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      } else {
        toast({ title: "Fout", description: "Kon sectie-instelling niet bijwerken", variant: "destructive" });
      }
    },
  });

  const selectedSection = settings.find(s => s.sectionKey === selectedSectionKey);

  const handleVisibilityChange = (isVisible: boolean) => {
    if (selectedSection) {
      updateMutation.mutate({ 
        id: selectedSection.id, 
        data: { isVisible } 
      });
    }
  };

  const handleOrderChange = (order: number) => {
    if (selectedSection) {
      updateMutation.mutate({ 
        id: selectedSection.id, 
        data: { order } 
      });
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Sectie-instellingen laden...</div>;
  }

  return (
    <div className="space-y-6" data-testid="section-settings-editor">
      <div>
        <h3 className="text-lg font-semibold mb-4">Sectie Zichtbaarheid & Volgorde</h3>
        <p className="text-sm text-muted-foreground mb-6">Kies een sectie om de zichtbaarheid en volgorde aan te passen.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="section-select">Kies Sectie</Label>
              <Select value={selectedSectionKey} onValueChange={setSelectedSectionKey}>
                <SelectTrigger className="w-full" data-testid="select-section">
                  <SelectValue placeholder="Selecteer een sectie..." />
                </SelectTrigger>
                <SelectContent>
                  {availableSections.map((section) => (
                    <SelectItem key={section.key} value={section.key}>
                      {section.nameNl}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSection && (
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="visibility"
                      checked={selectedSection.isVisible}
                      onCheckedChange={handleVisibilityChange}
                      disabled={updateMutation.isPending}
                      data-testid="switch-visible"
                    />
                    <Label htmlFor="visibility">
                      {selectedSection.isVisible ? "Zichtbaar" : "Verborgen"}
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="order">Volgorde:</Label>
                    <Input
                      id="order"
                      type="number"
                      value={selectedSection.order}
                      onChange={(e) => handleOrderChange(parseInt(e.target.value) || 0)}
                      disabled={updateMutation.isPending}
                      className="w-20"
                      data-testid="input-order"
                    />
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p><strong>Sectie:</strong> {selectedSection.titleNl} ({selectedSection.titleEn})</p>
                  <p><strong>Status:</strong> {selectedSection.isVisible ? "Wordt getoond op de website" : "Verborgen van de website"}</p>
                  <p><strong>Positie:</strong> {selectedSection.order}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h4 className="font-medium">Huidige Sectie Instellingen:</h4>
        <div className="grid gap-2">
          {settings
            .sort((a, b) => a.order - b.order)
            .map((setting) => (
              <div 
                key={setting.id} 
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  setting.isVisible ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                }`}
                data-testid={`section-status-${setting.sectionKey}`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-sm w-8 text-center">{setting.order}</span>
                  <span className={setting.isVisible ? 'text-green-800' : 'text-gray-500'}>
                    {setting.titleNl}
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  setting.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {setting.isVisible ? 'Zichtbaar' : 'Verborgen'}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}