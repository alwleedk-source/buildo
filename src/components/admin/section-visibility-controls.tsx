'use client';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Menu, MenuSquare, ArrowUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { SectionSetting, InsertSectionSetting } from '@/lib/db/schema';

interface SectionVisibilityControlsProps {
  sectionKey: string;
  sectionTitleNl: string;
  sectionTitleEn: string;
}

export function SectionVisibilityControls({ 
  sectionKey, 
  sectionTitleNl, 
  sectionTitleEn 
}: SectionVisibilityControlsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: settings = [], isLoading } = useQuery<SectionSetting[]>({
    queryKey: ["/api/admin/section-settings"],
  });

  const currentSection = settings.find(s => s.sectionKey === sectionKey);

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
      
      toast({ 
        title: "Succes", 
        description: "Sectie-instellingen succesvol bijgewerkt" 
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "U bent uitgelogd. Opnieuw inloggen...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      } else {
        toast({ 
          title: "Fout", 
          description: "Kon sectie-instellingen niet bijwerken", 
          variant: "destructive" 
        });
      }
    },
  });

  const handleVisibilityChange = (isVisible: boolean) => {
    if (currentSection) {
      updateMutation.mutate({ 
        id: currentSection.id, 
        data: { isVisible } 
      });
    }
  };

  const handleHeaderVisibilityChange = (showInHeader: boolean) => {
    if (currentSection) {
      updateMutation.mutate({ 
        id: currentSection.id, 
        data: { showInHeader } 
      });
    }
  };

  const handleOrderChange = (order: number) => {
    if (currentSection) {
      updateMutation.mutate({ 
        id: currentSection.id, 
        data: { order } 
      });
    }
  };

  if (isLoading || !currentSection) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Sectie Zichtbaarheid
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4 text-muted-foreground">
            Sectie-instellingen laden...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6" data-testid={`section-controls-${sectionKey}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          {currentSection.isVisible ? (
            <Eye className="h-5 w-5 text-green-600" />
          ) : (
            <EyeOff className="h-5 w-5 text-gray-400" />
          )}
          Sectie Zichtbaarheid
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Section Title Display */}
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {sectionTitleNl}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {sectionTitleEn}
          </Badge>
        </div>

        {/* Section Visibility Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Website Visibility */}
          <div className="flex items-center justify-between space-x-4 p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              {currentSection.isVisible ? (
                <Eye className="h-4 w-4 text-green-600" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-400" />
              )}
              <div>
                <Label className="text-sm font-medium">
                  Zichtbaar op Website
                </Label>
                <p className="text-xs text-muted-foreground">
                  Toon deze sectie op de openbare website
                </p>
              </div>
            </div>
            <Switch
              checked={currentSection.isVisible ?? false}
              onCheckedChange={handleVisibilityChange}
              disabled={updateMutation.isPending}
              data-testid={`switch-visible-${sectionKey}`}
            />
          </div>

          {/* Header Visibility */}
          <div className="flex items-center justify-between space-x-4 p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              {currentSection.showInHeader ? (
                <Menu className="h-4 w-4 text-blue-600" />
              ) : (
                <MenuSquare className="h-4 w-4 text-gray-400" />
              )}
              <div>
                <Label className="text-sm font-medium">
                  Toon in Header Menu
                </Label>
                <p className="text-xs text-muted-foreground">
                  Voeg link toe aan de hoofdnavigatie
                </p>
              </div>
            </div>
            <Switch
              checked={currentSection.showInHeader ?? false}
              onCheckedChange={handleHeaderVisibilityChange}
              disabled={updateMutation.isPending || !currentSection.isVisible}
              data-testid={`switch-header-${sectionKey}`}
            />
          </div>

          {/* Order/Position Control */}
          <div className="flex items-center justify-between space-x-4 p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <ArrowUpDown className="h-4 w-4 text-purple-600" />
              <div>
                <Label className="text-sm font-medium">
                  Volgorde Positie
                </Label>
                <p className="text-xs text-muted-foreground">
                  Numerieke volgorde op de website
                </p>
              </div>
            </div>
            <Input
              type="number"
              value={currentSection.order}
              onChange={(e) => handleOrderChange(parseInt(e.target.value) || 0)}
              disabled={updateMutation.isPending}
              className="w-20 text-center"
              min="0"
              max="100"
              data-testid={`input-order-${sectionKey}`}
            />
          </div>
        </div>

        {/* Status Information */}
        <div className="pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={currentSection.isVisible ? "default" : "secondary"}
              className="text-xs"
            >
              {currentSection.isVisible ? "Zichtbaar" : "Verborgen"}
            </Badge>
            {currentSection.isVisible && (
              <Badge 
                variant={currentSection.showInHeader ? "default" : "outline"}
                className="text-xs"
              >
                {currentSection.showInHeader ? "In Header" : "Niet in Header"}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              Volgorde: {currentSection.order}
            </Badge>
          </div>
          
          {!currentSection.isVisible && (
            <p className="text-xs text-amber-600 mt-2">
              ⚠️ Deze sectie is momenteel verborgen voor websitebezoekers
            </p>
          )}
          
          {currentSection.isVisible && !currentSection.showInHeader && (
            <p className="text-xs text-blue-600 mt-2">
              ℹ️ Sectie is zichtbaar maar heeft geen navigatielink in de header
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}