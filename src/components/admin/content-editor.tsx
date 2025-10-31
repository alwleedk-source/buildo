'use client';

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Plus, Edit, Trash2, Save, X, Upload, Star, StarOff, Image as ImageIcon } from "lucide-react";
import type {
  HeroContent,
  Statistic,
  AboutContent,
  Service,
  Project,
  BlogArticle,
  Partner,
  ContactInquiry,
  InsertHeroContent,
  InsertStatistic,
  InsertAboutContent,
  InsertService,
  InsertProject,
  InsertBlogArticle,
  InsertPartner,
  CompanyInitiative,
  InsertCompanyInitiative,
  SectionSetting,
  InsertSectionSetting,
} from '@/lib/db/schema';
import EnhancedBlogEditor from "./enhanced-blog-editor";

type ContentType = "hero" | "statistics" | "about" | "services" | "projects" | "blog" | "partners" | "maatschappelijke" | "section-settings" | "inquiries";

interface ContentEditorProps {
  contentType: ContentType;
}

export function ContentEditor({ contentType }: ContentEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleUnauthorizedError = (error: Error) => {
    if (isUnauthorizedError(error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return true;
    }
    return false;
  };

  // Hero Content Editor
  const HeroEditor = () => {
    const [formData, setFormData] = useState<InsertHeroContent>({
      titleNl: "",
      titleEn: "",
      subtitleNl: "",
      subtitleEn: "",
      primaryCtaNl: "",
      primaryCtaEn: "",
      secondaryCtaNl: "",
      secondaryCtaEn: "",
      backgroundImage: "",
      videoUrl: "",
      videoType: "link",
      mediaType: "image",
      overlayOpacity: 50,
      textAlign: "center",
      displayStyle: "overlay",
      headerOverlay: true,
    });

    const { data: heroContent } = useQuery<HeroContent>({
      queryKey: ["/api/hero"],
    });

    const heroMutation = useMutation({
      mutationFn: async (data: InsertHeroContent) => {
        return await apiRequest("/api/admin/hero", "PUT", data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/hero"] });
        toast({ title: "Succes", description: "Hero inhoud succesvol bijgewerkt" });
      },
      onError: (error) => {
        if (!handleUnauthorizedError(error)) {
          toast({ title: "Error", description: "Failed to update hero content", variant: "destructive" });
        }
      },
    });

    useEffect(() => {
      if (heroContent) {
        setFormData({
          titleNl: heroContent.titleNl,
          titleEn: heroContent.titleEn,
          subtitleNl: heroContent.subtitleNl,
          subtitleEn: heroContent.subtitleEn,
          primaryCtaNl: heroContent.primaryCtaNl,
          primaryCtaEn: heroContent.primaryCtaEn,
          secondaryCtaNl: heroContent.secondaryCtaNl,
          secondaryCtaEn: heroContent.secondaryCtaEn,
          backgroundImage: heroContent.backgroundImage || "",
          videoUrl: heroContent.videoUrl || "",
          videoType: heroContent.videoType || "link",
          mediaType: heroContent.mediaType || "image",
          overlayOpacity: heroContent.overlayOpacity || 50,
          textAlign: heroContent.textAlign || "center",
          displayStyle: heroContent.displayStyle || "overlay",
          headerOverlay: heroContent.headerOverlay !== undefined ? heroContent.headerOverlay : true,
        });
      }
    }, [heroContent]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      heroMutation.mutate(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4" data-testid="hero-editor-form">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="titleNl">Title (Nederlands)</Label>
            <Input
              id="titleNl"
              value={formData.titleNl}
              onChange={(e) => setFormData({ ...formData, titleNl: e.target.value })}
              placeholder="e.g., Welkom bij BuildCraft"
              data-testid="input-hero-title-nl"
            />
          </div>
          <div>
            <Label htmlFor="titleEn">Title (English)</Label>
            <Input
              id="titleEn"
              value={formData.titleEn}
              onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
              placeholder="e.g., Welcome to BuildCraft"
              data-testid="input-hero-title-en"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="subtitleNl">Subtitle (Nederlands)</Label>
            <Textarea
              id="subtitleNl"
              value={formData.subtitleNl}
              onChange={(e) => setFormData({ ...formData, subtitleNl: e.target.value })}
              rows={3}
              placeholder="Professionele bouwdiensten..."
              data-testid="textarea-hero-subtitle-nl"
            />
          </div>
          <div>
            <Label htmlFor="subtitleEn">Subtitle (English)</Label>
            <Textarea
              id="subtitleEn"
              value={formData.subtitleEn}
              onChange={(e) => setFormData({ ...formData, subtitleEn: e.target.value })}
              rows={3}
              placeholder="Professional construction services..."
              data-testid="textarea-hero-subtitle-en"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="primaryCtaNl">Primary CTA (Nederlands)</Label>
            <Input
              id="primaryCtaNl"
              value={formData.primaryCtaNl}
              onChange={(e) => setFormData({ ...formData, primaryCtaNl: e.target.value })}
              placeholder="e.g., Offerte aanvragen"
              data-testid="input-hero-primary-cta-nl"
            />
          </div>
          <div>
            <Label htmlFor="primaryCtaEn">Primary CTA (English)</Label>
            <Input
              id="primaryCtaEn"
              value={formData.primaryCtaEn}
              onChange={(e) => setFormData({ ...formData, primaryCtaEn: e.target.value })}
              placeholder="e.g., Request Quote"
              data-testid="input-hero-primary-cta-en"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="secondaryCtaNl">Secondary CTA (Nederlands)</Label>
            <Input
              id="secondaryCtaNl"
              value={formData.secondaryCtaNl}
              onChange={(e) => setFormData({ ...formData, secondaryCtaNl: e.target.value })}
              placeholder="e.g., Meer info"
              data-testid="input-hero-secondary-cta-nl"
            />
          </div>
          <div>
            <Label htmlFor="secondaryCtaEn">Secondary CTA (English)</Label>
            <Input
              id="secondaryCtaEn"
              value={formData.secondaryCtaEn}
              onChange={(e) => setFormData({ ...formData, secondaryCtaEn: e.target.value })}
              placeholder="e.g., Learn more"
              data-testid="input-hero-secondary-cta-en"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="backgroundImage">Background Image URL</Label>
          <Input
            id="backgroundImage"
            value={formData.backgroundImage || ""}
            onChange={(e) => setFormData({ ...formData, backgroundImage: e.target.value })}
            data-testid="input-hero-background-image"
          />
        </div>
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-lg font-semibold">Video Settings</h3>
          <div>
            <Label htmlFor="videoType">Video Type</Label>
            <Select
              value={formData.videoType || "link"}
              onValueChange={(value) => setFormData({ ...formData, videoType: value })}
            >
              <SelectTrigger data-testid="select-video-type">
                <SelectValue placeholder="Select video type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="link">External Link</SelectItem>
                <SelectItem value="upload">Upload File</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="videoUrl">Video URL {formData.videoType === "upload" ? "(or file path)" : ""}</Label>
            <Input
              id="videoUrl"
              value={formData.videoUrl || ""}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              placeholder={formData.videoType === "link" ? "https://youtube.com/watch?v=..." : "/uploads/video.mp4"}
              data-testid="input-hero-video-url"
            />
          </div>
        </div>
        
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-lg font-semibold">Hero Layout & Style</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="mediaType">Media Type</Label>
              <Select value={formData.mediaType} onValueChange={(value: "image" | "video") => setFormData({ ...formData, mediaType: value })}>
                <SelectTrigger data-testid="select-media-type">
                  <SelectValue placeholder="Choose media type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="displayStyle">Display Style</Label>
              <Select value={formData.displayStyle} onValueChange={(value: "overlay" | "split" | "fullscreen" | "minimal") => setFormData({ ...formData, displayStyle: value })}>
                <SelectTrigger data-testid="select-display-style">
                  <SelectValue placeholder="Choose layout style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overlay">Overlay (Header over content)</SelectItem>
                  <SelectItem value="fullscreen">Fullscreen</SelectItem>
                  <SelectItem value="split">Split Screen</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="textAlign">Text Alignment</Label>
              <Select value={formData.textAlign} onValueChange={(value: "left" | "center" | "right") => setFormData({ ...formData, textAlign: value })}>
                <SelectTrigger data-testid="select-text-align">
                  <SelectValue placeholder="Text alignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="overlayOpacity">Overlay Opacity: {formData.overlayOpacity}%</Label>
              <input
                type="range"
                id="overlayOpacity"
                min="0"
                max="100"
                value={formData.overlayOpacity}
                onChange={(e) => setFormData({ ...formData, overlayOpacity: Number(e.target.value) })}
                className="w-full"
                data-testid="range-overlay-opacity"
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="headerOverlay"
                checked={formData.headerOverlay}
                onChange={(e) => setFormData({ ...formData, headerOverlay: e.target.checked })}
                data-testid="checkbox-header-overlay"
              />
              <Label htmlFor="headerOverlay">Header Overlay (Show navigation over hero)</Label>
            </div>
          </div>
        </div>
        
        <Button type="submit" disabled={heroMutation.isPending} data-testid="button-save-hero">
          {heroMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    );
  };

  // Statistics Editor
  const StatisticsEditor = () => {
    const [formData, setFormData] = useState<InsertStatistic>({
      labelNl: "",
      labelEn: "",
      value: "",
      order: 0,
    });

    const { data: statistics = [] } = useQuery<Statistic[]>({
      queryKey: ["/api/admin/statistics"],
    });

    // Populate form data when editing a statistic
    useEffect(() => {
      if (editingId && statistics.length > 0) {
        const statToEdit = statistics.find(s => s.id === editingId);
        if (statToEdit) {
          setFormData({
            labelNl: statToEdit.labelNl,
            labelEn: statToEdit.labelEn,
            value: statToEdit.value,
            order: statToEdit.order,
          });
        }
      }
    }, [editingId, statistics]);

    const createMutation = useMutation({
      mutationFn: async (data: InsertStatistic) => {
        return await apiRequest("/api/admin/statistics", "POST", data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/statistics"] });
        setFormData({ labelNl: "", labelEn: "", value: "", order: 0 });
        setIsCreating(false);
        toast({ title: "Success", description: "Statistic created successfully" });
      },
      onError: (error) => {
        if (!handleUnauthorizedError(error)) {
          toast({ title: "Error", description: "Failed to create statistic", variant: "destructive" });
        }
      },
    });

    const updateMutation = useMutation({
      mutationFn: async ({ id, data }: { id: string; data: Partial<InsertStatistic> }) => {
        return await apiRequest(`/api/admin/statistics/${id}`, "PUT", data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/statistics"] });
        setEditingId(null);
        toast({ title: "Success", description: "Statistic updated successfully" });
      },
      onError: (error) => {
        if (!handleUnauthorizedError(error)) {
          toast({ title: "Error", description: "Failed to update statistic", variant: "destructive" });
        }
      },
    });

    const deleteMutation = useMutation({
      mutationFn: async (id: string) => {
        return await apiRequest(`/api/admin/statistics/${id}`, "DELETE");
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/statistics"] });
        toast({ title: "Success", description: "Statistic deleted successfully" });
      },
      onError: (error) => {
        if (!handleUnauthorizedError(error)) {
          toast({ title: "Error", description: "Failed to delete statistic", variant: "destructive" });
        }
      },
    });

    return (
      <div className="space-y-6" data-testid="statistics-editor">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Statistics Management</h3>
          <Button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2"
            data-testid="button-add-statistic"
          >
            <Plus className="w-4 h-4" />
            Add Statistic
          </Button>
        </div>

        {(isCreating || editingId) && (
          <Card data-testid={editingId ? "edit-statistic-form" : "create-statistic-form"}>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Statistic" : "Create New Statistic"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editingId) {
                    updateMutation.mutate({ id: editingId, data: formData });
                  } else {
                    createMutation.mutate(formData);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="e.g., 500+"
                    data-testid="input-stat-value"
                  />
                </div>
                <div>
                  <Label htmlFor="labelNl">Label (Nederlands)</Label>
                  <Input
                    id="labelNl"
                    value={formData.labelNl}
                    onChange={(e) => setFormData({ ...formData, labelNl: e.target.value })}
                    placeholder="e.g., Projecten Voltooid"
                    data-testid="input-stat-label-nl"
                  />
                </div>
                <div>
                  <Label htmlFor="labelEn">Label (English)</Label>
                  <Input
                    id="labelEn"
                    value={formData.labelEn}
                    onChange={(e) => setFormData({ ...formData, labelEn: e.target.value })}
                    placeholder="e.g., Projects Completed"
                    data-testid="input-stat-label-en"
                  />
                </div>
                <div>
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    data-testid="input-stat-order"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={editingId ? updateMutation.isPending : createMutation.isPending} 
                    data-testid="button-save-stat"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {(editingId ? updateMutation.isPending : createMutation.isPending) ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingId(null);
                      setFormData({ labelNl: "", labelEn: "", value: "", order: 0 });
                    }}
                    data-testid="button-cancel-stat"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {statistics.map((stat) => (
            <Card key={stat.id} data-testid={`stat-item-${stat.id}`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-2xl text-primary">{stat.value}</div>
                    <div className="text-muted-foreground">{stat.labelNl}</div>
                    <div className="text-sm text-muted-foreground">Order: {stat.order}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(stat.id)}
                      data-testid={`button-edit-stat-${stat.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(stat.id)}
                      data-testid={`button-delete-stat-${stat.id}`}
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
    );
  };

  // About Content Editor
  const AboutEditor = () => {
    const [formData, setFormData] = useState<InsertAboutContent>({
      titleNl: "",
      titleEn: "",
      descriptionNl: "",
      descriptionEn: "",
      image: "",
      featuresNl: [],
      featuresEn: [],
    });

    const { data: aboutContent } = useQuery<AboutContent>({
      queryKey: ["/api/about"],
    });

    const aboutMutation = useMutation({
      mutationFn: async (data: InsertAboutContent) => {
        return await apiRequest("/api/admin/about", "PUT", data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/about"] });
        toast({ title: "Success", description: "About content updated successfully" });
      },
      onError: (error) => {
        if (!handleUnauthorizedError(error)) {
          toast({ title: "Error", description: "Failed to update about content", variant: "destructive" });
        }
      },
    });

    useEffect(() => {
      if (aboutContent) {
        setFormData({
          titleNl: aboutContent.titleNl,
          titleEn: aboutContent.titleEn,
          descriptionNl: aboutContent.descriptionNl,
          descriptionEn: aboutContent.descriptionEn,
          image: aboutContent.image || "",
          featuresNl: Array.isArray(aboutContent.featuresNl) ? aboutContent.featuresNl as any[] : [],
          featuresEn: Array.isArray(aboutContent.featuresEn) ? aboutContent.featuresEn as any[] : [],
        });
      }
    }, [aboutContent]);

    const addFeatureNl = () => {
      setFormData({
        ...formData,
        featuresNl: [...(Array.isArray(formData.featuresNl) ? formData.featuresNl : []), { title: "", description: "" }],
      });
    };

    const addFeatureEn = () => {
      setFormData({
        ...formData,
        featuresEn: [...(Array.isArray(formData.featuresEn) ? formData.featuresEn : []), { title: "", description: "" }],
      });
    };

    const updateFeatureNl = (index: number, field: string, value: string) => {
      const features = Array.isArray(formData.featuresNl) ? formData.featuresNl as any[] : [];
      const updatedFeatures = [...features];
      updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
      setFormData({ ...formData, featuresNl: updatedFeatures });
    };

    const updateFeatureEn = (index: number, field: string, value: string) => {
      const features = Array.isArray(formData.featuresEn) ? formData.featuresEn as any[] : [];
      const updatedFeatures = [...features];
      updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
      setFormData({ ...formData, featuresEn: updatedFeatures });
    };

    const removeFeatureNl = (index: number) => {
      const features = Array.isArray(formData.featuresNl) ? formData.featuresNl as any[] : [];
      const updatedFeatures = features.filter((_, i) => i !== index);
      setFormData({ ...formData, featuresNl: updatedFeatures });
    };

    const removeFeatureEn = (index: number) => {
      const features = Array.isArray(formData.featuresEn) ? formData.featuresEn as any[] : [];
      const updatedFeatures = features.filter((_, i) => i !== index);
      setFormData({ ...formData, featuresEn: updatedFeatures });
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      aboutMutation.mutate(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4" data-testid="about-editor-form">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="titleNl">Title (Nederlands)</Label>
            <Input
              id="titleNl"
              value={formData.titleNl}
              onChange={(e) => setFormData({ ...formData, titleNl: e.target.value })}
              placeholder="e.g., Over BuildCraft"
              data-testid="input-about-title-nl"
            />
          </div>
          <div>
            <Label htmlFor="titleEn">Title (English)</Label>
            <Input
              id="titleEn"
              value={formData.titleEn}
              onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
              placeholder="e.g., About BuildCraft"
              data-testid="input-about-title-en"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="descriptionNl">Description (Nederlands)</Label>
            <Textarea
              id="descriptionNl"
              value={formData.descriptionNl}
              onChange={(e) => setFormData({ ...formData, descriptionNl: e.target.value })}
              rows={4}
              placeholder="Onze geschiedenis en missie..."
              data-testid="textarea-about-description-nl"
            />
          </div>
          <div>
            <Label htmlFor="descriptionEn">Description (English)</Label>
            <Textarea
              id="descriptionEn"
              value={formData.descriptionEn}
              onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
              rows={4}
              placeholder="Our history and mission..."
              data-testid="textarea-about-description-en"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            value={formData.image || ""}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            data-testid="input-about-image"
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <Label>Features (Nederlands)</Label>
              <Button type="button" onClick={addFeatureNl} size="sm" data-testid="button-add-feature-nl">
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </div>
            {(Array.isArray(formData.featuresNl) ? formData.featuresNl as any[] : []).map((feature: any, index: number) => (
              <Card key={index} className="mb-4" data-testid={`feature-nl-item-${index}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium">Feature {index + 1}</h4>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFeatureNl(index)}
                      data-testid={`button-remove-feature-nl-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="Functie titel"
                      value={feature.title || ""}
                      onChange={(e) => updateFeatureNl(index, "title", e.target.value)}
                      data-testid={`input-feature-nl-title-${index}`}
                    />
                    <Textarea
                      placeholder="Functie beschrijving"
                      value={feature.description || ""}
                      onChange={(e) => updateFeatureNl(index, "description", e.target.value)}
                      data-testid={`textarea-feature-nl-description-${index}`}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div>
            <div className="flex justify-between items-center mb-4">
              <Label>Features (English)</Label>
              <Button type="button" onClick={addFeatureEn} size="sm" data-testid="button-add-feature-en">
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </div>
            {(Array.isArray(formData.featuresEn) ? formData.featuresEn as any[] : []).map((feature: any, index: number) => (
              <Card key={index} className="mb-4" data-testid={`feature-en-item-${index}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium">Feature {index + 1}</h4>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFeatureEn(index)}
                      data-testid={`button-remove-feature-en-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="Feature title"
                      value={feature.title || ""}
                      onChange={(e) => updateFeatureEn(index, "title", e.target.value)}
                      data-testid={`input-feature-en-title-${index}`}
                    />
                    <Textarea
                      placeholder="Feature description"
                      value={feature.description || ""}
                      onChange={(e) => updateFeatureEn(index, "description", e.target.value)}
                      data-testid={`textarea-feature-en-description-${index}`}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Button type="submit" disabled={aboutMutation.isPending} data-testid="button-save-about">
          {aboutMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    );
  };

  // Services Editor (similar pattern as Statistics)
  const ServicesEditor = () => {
    const [formData, setFormData] = useState<InsertService>({
      titleNl: "",
      titleEn: "",
      descriptionNl: "",
      descriptionEn: "",
      icon: "",
      image: "",
      order: 0,
    });

    const { data: services = [] } = useQuery<Service[]>({
      queryKey: ["/api/admin/services"],
    });

    useEffect(() => {
      if (editingId && services.length > 0) {
        const serviceToEdit = services.find(s => s.id === editingId);
        if (serviceToEdit) {
          setFormData({
            titleNl: serviceToEdit.titleNl,
            titleEn: serviceToEdit.titleEn || "",
            descriptionNl: serviceToEdit.descriptionNl,
            descriptionEn: serviceToEdit.descriptionEn || "",
            icon: serviceToEdit.icon || "",
            image: serviceToEdit.image || "",
            order: serviceToEdit.order,
          });
        }
      }
    }, [editingId, services]);

    const createMutation = useMutation({
      mutationFn: async (data: InsertService) => {
        return await apiRequest("/api/admin/services", "POST", data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/services"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
        setFormData({ titleNl: "", titleEn: "", descriptionNl: "", descriptionEn: "", icon: "", image: "", order: 0 });
        setIsCreating(false);
        toast({ title: "Success", description: "Service created successfully" });
      },
      onError: (error) => {
        if (!handleUnauthorizedError(error)) {
          toast({ title: "Error", description: "Failed to create service", variant: "destructive" });
        }
      },
    });

    const updateMutation = useMutation({
      mutationFn: async ({ id, data }: { id: string; data: Partial<InsertService> }) => {
        return await apiRequest(`/api/admin/services/${id}`, "PUT", data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/services"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
        setEditingId(null);
        toast({ title: "Success", description: "Service updated successfully" });
      },
      onError: (error) => {
        if (!handleUnauthorizedError(error)) {
          toast({ title: "Error", description: "Failed to update service", variant: "destructive" });
        }
      },
    });

    const deleteMutation = useMutation({
      mutationFn: async (id: string) => {
        return await apiRequest(`/api/admin/services/${id}`, "DELETE");
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/services"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
        toast({ title: "Success", description: "Service deleted successfully" });
      },
      onError: (error) => {
        if (!handleUnauthorizedError(error)) {
          toast({ title: "Error", description: "Failed to delete service", variant: "destructive" });
        }
      },
    });

    return (
      <div className="space-y-6" data-testid="services-editor">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Services Management</h3>
          <Button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2"
            data-testid="button-add-service"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </Button>
        </div>

        {(isCreating || editingId) && (
          <Card data-testid={editingId ? "edit-service-form" : "create-service-form"}>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Service" : "Create New Service"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editingId) {
                    updateMutation.mutate({ id: editingId, data: formData });
                  } else {
                    createMutation.mutate(formData);
                  }
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="titleNl">Titel (Nederlands)</Label>
                    <Input
                      id="titleNl"
                      value={formData.titleNl}
                      onChange={(e) => setFormData({ ...formData, titleNl: e.target.value })}
                      data-testid="input-service-title-nl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="titleEn">Title (English)</Label>
                    <Input
                      id="titleEn"
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      data-testid="input-service-title-en"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="descriptionNl">Beschrijving (Nederlands)</Label>
                    <Textarea
                      id="descriptionNl"
                      value={formData.descriptionNl}
                      onChange={(e) => setFormData({ ...formData, descriptionNl: e.target.value })}
                      data-testid="textarea-service-description-nl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="descriptionEn">Description (English)</Label>
                    <Textarea
                      id="descriptionEn"
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                      data-testid="textarea-service-description-en"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="icon">Icon Name</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                    <SelectTrigger data-testid="select-service-icon">
                      <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wrench">Wrench</SelectItem>
                      <SelectItem value="building">Building</SelectItem>
                      <SelectItem value="factory">Factory</SelectItem>
                      <SelectItem value="hammer">Hammer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    data-testid="input-service-order"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={editingId ? updateMutation.isPending : createMutation.isPending} data-testid="button-save-service">
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? (updateMutation.isPending ? "Updating..." : "Update") : (createMutation.isPending ? "Saving..." : "Save")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingId(null);
                      setFormData({ titleNl: "", titleEn: "", descriptionNl: "", descriptionEn: "", icon: "", image: "", order: 0 });
                    }}
                    data-testid="button-cancel-service"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {services.map((service) => (
            <Card key={service.id} data-testid={`service-item-${service.id}`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold">{service.titleNl}</h4>
                    <p className="text-muted-foreground text-sm">{service.descriptionNl}</p>
                    <div className="text-xs text-muted-foreground mt-1">
                      Icon: {service.icon} | Order: {service.order}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(service.id)}
                      data-testid={`button-edit-service-${service.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(service.id)}
                      data-testid={`button-delete-service-${service.id}`}
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
    );
  };

  // Contact Inquiries Viewer
  const InquiriesViewer = () => {
    const { data: inquiries = [] } = useQuery<ContactInquiry[]>({
      queryKey: ["/api/admin/inquiries"],
    });

    const updateStatusMutation = useMutation({
      mutationFn: async ({ id, status }: { id: string; status: string }) => {
        return await apiRequest(`/api/admin/inquiries/${id}`, "PUT", { status });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/inquiries"] });
        toast({ title: "Success", description: "Inquiry status updated" });
      },
      onError: (error) => {
        if (!handleUnauthorizedError(error)) {
          toast({ title: "Error", description: "Failed to update inquiry status", variant: "destructive" });
        }
      },
    });

    return (
      <div className="space-y-4" data-testid="inquiries-viewer">
        <h3 className="text-lg font-semibold">Contact Inquiries</h3>
        {inquiries.length === 0 ? (
          <p className="text-muted-foreground" data-testid="no-inquiries">No inquiries yet.</p>
        ) : (
          <div className="grid gap-4">
            {inquiries.map((inquiry) => (
              <Card key={inquiry.id} data-testid={`inquiry-item-${inquiry.id}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold">
                        {inquiry.firstName} {inquiry.lastName}
                      </h4>
                      <p className="text-sm text-muted-foreground">{inquiry.company}</p>
                      <p className="text-sm text-muted-foreground">{inquiry.email} | {inquiry.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={inquiry.status || "new"}
                        onValueChange={(value) => updateStatusMutation.mutate({ id: inquiry.id, status: value })}
                      >
                        <SelectTrigger className="w-32" data-testid={`select-inquiry-status-${inquiry.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Project Type:</strong> {inquiry.projectType}</p>
                    <p className="text-sm"><strong>Message:</strong></p>
                    <p className="text-sm bg-muted p-3 rounded">{inquiry.message}</p>
                    <p className="text-xs text-muted-foreground">
                      Submitted: {new Date(inquiry.createdAt!).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Projects Editor
  const ProjectsEditor = () => {
    const [formData, setFormData] = useState<InsertProject>({
      titleNl: "",
      titleEn: "",
      descriptionNl: "",
      descriptionEn: "",
      categoryNl: "",
      categoryEn: "",
      location: "",
      year: "",
      image: "",
      status: "completed",
    });
    const [currentProject, setCurrentProject] = useState<Project | null>(null);
    const [isUploadingImages, setIsUploadingImages] = useState(false);

    const { data: projects = [] } = useQuery<Project[]>({
      queryKey: ["/api/admin/projects"],
    });

    useEffect(() => {
      if (editingId && projects.length > 0) {
        const projectToEdit = projects.find(p => p.id === editingId);
        if (projectToEdit) {
          setCurrentProject(projectToEdit);
          setFormData({
            titleNl: projectToEdit.titleNl,
            titleEn: projectToEdit.titleEn,
            descriptionNl: projectToEdit.descriptionNl,
            descriptionEn: projectToEdit.descriptionEn,
            categoryNl: projectToEdit.categoryNl,
            categoryEn: projectToEdit.categoryEn,
            location: projectToEdit.location || "",
            year: projectToEdit.year || "",
            image: projectToEdit.image || "",
            status: projectToEdit.status || "completed",
          });
        }
      } else {
        setCurrentProject(null);
      }
    }, [editingId, projects]);

    const createMutation = useMutation({
      mutationFn: async (data: InsertProject) => {
        return await apiRequest("/api/admin/projects", "POST", data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
        setFormData({ titleNl: "", titleEn: "", descriptionNl: "", descriptionEn: "", categoryNl: "", categoryEn: "", location: "", year: "", image: "", status: "completed" });
        setIsCreating(false);
        toast({ title: "Succes", description: "Project succesvol aangemaakt" });
      },
      onError: (error) => {
        if (!handleUnauthorizedError(error)) {
          toast({ title: "Fout", description: "Kon project niet aanmaken", variant: "destructive" });
        }
      },
    });

    const updateMutation = useMutation({
      mutationFn: async ({ id, data }: { id: string; data: Partial<InsertProject> }) => {
        return await apiRequest(`/api/admin/projects/${id}`, "PUT", data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
        setEditingId(null);
        toast({ title: "Succes", description: "Project succesvol bijgewerkt" });
      },
      onError: (error) => {
        if (!handleUnauthorizedError(error)) {
          toast({ title: "Fout", description: "Kon project niet bijwerken", variant: "destructive" });
        }
      },
    });

    const deleteMutation = useMutation({
      mutationFn: async (id: string) => {
        return await apiRequest(`/api/admin/projects/${id}`, "DELETE");
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
        toast({ title: "Succes", description: "Project succesvol verwijderd" });
      },
      onError: (error) => {
        if (!handleUnauthorizedError(error)) {
          toast({ title: "Fout", description: "Kon project niet verwijderen", variant: "destructive" });
        }
      },
    });

    // Image upload mutation
    const uploadImagesMutation = useMutation({
      mutationFn: async ({ projectId, files }: { projectId: string; files: File[] }) => {
        const formData = new FormData();
        files.forEach(file => formData.append('images', file));
        
        const response = await fetch(`/api/admin/projects/${projectId}/images`, {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Upload failed: ${response.status}`);
        }
        
        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
        setIsUploadingImages(false);
        toast({ title: "Succes", description: "Afbeeldingen succesvol geüpload" });
      },
      onError: (error) => {
        setIsUploadingImages(false);
        if (!handleUnauthorizedError(error)) {
          toast({ title: "Fout", description: "Kon afbeeldingen niet uploaden", variant: "destructive" });
        }
      },
    });

    // Set featured image mutation
    const setFeaturedImageMutation = useMutation({
      mutationFn: async ({ projectId, imageUrl }: { projectId: string; imageUrl: string }) => {
        return await apiRequest(`/api/admin/projects/${projectId}/featured-image`, "PUT", { imageUrl });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
        toast({ title: "Succes", description: "Hoofdafbeelding ingesteld" });
      },
      onError: (error) => {
        if (!handleUnauthorizedError(error)) {
          toast({ title: "Fout", description: "Kon hoofdafbeelding niet instellen", variant: "destructive" });
        }
      },
    });

    // Delete image mutation
    const deleteImageMutation = useMutation({
      mutationFn: async ({ projectId, imageId }: { projectId: string; imageId: string }) => {
        return await apiRequest(`/api/admin/projects/${projectId}/images/${imageId}`, "DELETE");
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
        toast({ title: "Succes", description: "Afbeelding verwijderd" });
      },
      onError: (error) => {
        if (!handleUnauthorizedError(error)) {
          toast({ title: "Fout", description: "Kon afbeelding niet verwijderen", variant: "destructive" });
        }
      },
    });

    // Handle image upload
    const handleImageUpload = (files: FileList | null) => {
      if (!files || !currentProject) return;
      
      const fileArray = Array.from(files);
      const validFiles = fileArray.filter(file => file.type.startsWith('image/'));
      
      if (validFiles.length === 0) {
        toast({ title: "Fout", description: "Alleen afbeeldingsbestanden zijn toegestaan", variant: "destructive" });
        return;
      }

      setIsUploadingImages(true);
      uploadImagesMutation.mutate({ projectId: currentProject.id, files: validFiles });
    };

    return (
      <div className="space-y-6" data-testid="projects-editor">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Projecten Beheer</h3>
          <Button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2"
            data-testid="button-add-project"
          >
            <Plus className="w-4 h-4" />
            Project Toevoegen
          </Button>
        </div>

        {(isCreating || editingId) && (
          <Card data-testid={editingId ? "edit-project-form" : "create-project-form"}>
            <CardHeader>
              <CardTitle>{editingId ? "Project Bewerken" : "Nieuw Project Maken"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editingId) {
                    updateMutation.mutate({ id: editingId, data: formData });
                  } else {
                    createMutation.mutate(formData);
                  }
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="titleNl">Titel (Nederlands)</Label>
                    <Input
                      id="titleNl"
                      value={formData.titleNl}
                      onChange={(e) => setFormData({ ...formData, titleNl: e.target.value })}
                      data-testid="input-project-title-nl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="titleEn">Title (English)</Label>
                    <Input
                      id="titleEn"
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      data-testid="input-project-title-en"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="descriptionNl">Beschrijving (Nederlands)</Label>
                    <Textarea
                      id="descriptionNl"
                      value={formData.descriptionNl}
                      onChange={(e) => setFormData({ ...formData, descriptionNl: e.target.value })}
                      data-testid="textarea-project-description-nl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="descriptionEn">Description (English)</Label>
                    <Textarea
                      id="descriptionEn"
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                      data-testid="textarea-project-description-en"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="categoryNl">Categorie (Nederlands)</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, categoryNl: value })}>
                      <SelectTrigger data-testid="select-project-category-nl">
                        <SelectValue placeholder="Selecteer categorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Woningbouw">Woningbouw</SelectItem>
                        <SelectItem value="commercial">Commercieel</SelectItem>
                        <SelectItem value="infrastructure">Infrastructuur</SelectItem>
                        <SelectItem value="renovation">Renovatie</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="categoryEn">Category (English)</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, categoryEn: value })}>
                      <SelectTrigger data-testid="select-project-category-en">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Residential">Residential</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                        <SelectItem value="Renovation">Renovation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Locatie</Label>
                    <Input
                      id="location"
                      value={formData.location || ""}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      data-testid="input-project-location"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="year">Jaar</Label>
                    <Input
                      id="year"
                      value={formData.year || ""}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      data-testid="input-project-year"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status || "completed"} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                      <SelectTrigger data-testid="select-project-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed">Voltooid</SelectItem>
                        <SelectItem value="in_progress">In Uitvoering</SelectItem>
                        <SelectItem value="planned">Gepland</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="image">Afbeelding URL</Label>
                  <Input
                    id="image"
                    value={formData.image || ""}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    data-testid="input-project-image"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={editingId ? updateMutation.isPending : createMutation.isPending} data-testid="button-save-project">
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? (updateMutation.isPending ? "Bijwerken..." : "Bijwerken") : (createMutation.isPending ? "Opslaan..." : "Opslaan")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingId(null);
                      setFormData({ titleNl: "", titleEn: "", descriptionNl: "", descriptionEn: "", categoryNl: "", categoryEn: "", location: "", year: "", image: "", status: "completed" });
                    }}
                    data-testid="button-cancel-project"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annuleren
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Image Gallery Management - Only shown when editing existing project */}
        {editingId && currentProject && (
          <Card data-testid="project-images-gallery">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Project Afbeeldingen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="project-images" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Klik om afbeeldingen te uploaden of sleep ze hierheen
                      </span>
                      <span className="text-xs text-gray-500">PNG, JPG, GIF tot 10MB</span>
                    </label>
                    <input
                      id="project-images"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e.target.files)}
                      disabled={isUploadingImages}
                      data-testid="input-project-images"
                    />
                  </div>
                  {isUploadingImages && (
                    <div className="mt-4">
                      <div className="text-sm text-blue-600">Afbeeldingen uploaden...</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Images Grid */}
              {currentProject.gallery && Array.isArray(currentProject.gallery) && currentProject.gallery.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium mb-3">Geüploade Afbeeldingen ({(currentProject.gallery as any[]).length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(currentProject.gallery as any[]).map((image: any, index: number) => (
                      <div key={image.id || index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={image.thumbnail || image.url}
                            alt={image.originalName || `Project image ${index + 1}`}
                            className="w-full h-full object-cover"
                            data-testid={`project-image-${index}`}
                          />
                        </div>
                        
                        {/* Image Controls */}
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                          <div className="flex gap-2">
                            {/* Set as Featured Button */}
                            <Button
                              size="sm"
                              variant={currentProject.featuredImage === image.url ? "default" : "outline"}
                              onClick={() => setFeaturedImageMutation.mutate({ 
                                projectId: currentProject.id, 
                                imageUrl: image.url 
                              })}
                              disabled={setFeaturedImageMutation.isPending}
                              data-testid={`button-set-featured-${index}`}
                              className="text-white border-white hover:bg-white hover:text-black"
                            >
                              {currentProject.featuredImage === image.url ? (
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              ) : (
                                <StarOff className="w-4 h-4" />
                              )}
                            </Button>
                            
                            {/* Delete Button */}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteImageMutation.mutate({ 
                                projectId: currentProject.id, 
                                imageId: image.id 
                              })}
                              disabled={deleteImageMutation.isPending}
                              data-testid={`button-delete-image-${index}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Featured Badge */}
                        {currentProject.featuredImage === image.url && (
                          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                            Hoofdafbeelding
                          </div>
                        )}

                        {/* Image Info */}
                        <div className="mt-2 text-xs text-gray-500">
                          <div className="truncate">{image.originalName}</div>
                          <div>{Math.round(image.size / 1024)} KB</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Images State */}
              {(!currentProject.gallery || !Array.isArray(currentProject.gallery) || currentProject.gallery.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon className="mx-auto h-16 w-16 text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium">Nog geen afbeeldingen</h3>
                  <p className="mt-2">Upload afbeeldingen om een galerij te maken voor dit project</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {projects.map((project) => (
            <Card key={project.id} data-testid={`project-item-${project.id}`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold">{project.titleNl}</h4>
                    <p className="text-muted-foreground text-sm">{project.descriptionNl}</p>
                    <div className="text-xs text-muted-foreground mt-2">
                      <span className="inline-block mr-4">📍 {project.location}</span>
                      <span className="inline-block mr-4">📅 {project.year}</span>
                      <span className="inline-block mr-4">🏷️ {project.categoryNl}</span>
                      <span className="inline-block">🔄 {project.status}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(project.id)}
                      data-testid={`button-edit-project-${project.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(project.id)}
                      data-testid={`button-delete-project-${project.id}`}
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
    );
  };

  const BlogEditor = () => {
    const [formData, setFormData] = useState<InsertBlogArticle>({
      title: "",
      excerpt: "",
      content: "",
      category: "",
      image: "",
      slug: "",
      isPublished: false,
    });

    const { data: articles = [] } = useQuery<BlogArticle[]>({
      queryKey: ["/api/admin/blog"],
    });

    const createMutation = useMutation({
      mutationFn: async (data: InsertBlogArticle) => {
        return await apiRequest("/api/admin/blog", "POST", data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
        setFormData({ title: "", excerpt: "", content: "", category: "", image: "", slug: "", isPublished: false });
        setIsCreating(false);
        toast({ title: "Succes", description: "Blog artikel succesvol aangemaakt" });
      },
      onError: (error) => {
        if (!handleUnauthorizedError(error)) {
          toast({ title: "Fout", description: "Kon blog artikel niet aanmaken", variant: "destructive" });
        }
      },
    });

    const updateMutation = useMutation({
      mutationFn: async ({ id, data }: { id: string; data: Partial<InsertBlogArticle> }) => {
        return await apiRequest(`/api/admin/blog/${id}`, "PUT", data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
        setEditingId(null);
        toast({ title: "Succes", description: "Blog artikel succesvol bijgewerkt" });
      },
      onError: (error) => {
        if (!handleUnauthorizedError(error)) {
          toast({ title: "Fout", description: "Kon blog artikel niet bijwerken", variant: "destructive" });
        }
      },
    });

    const deleteMutation = useMutation({
      mutationFn: async (id: string) => {
        return await apiRequest(`/api/admin/blog/${id}`, "DELETE");
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
        toast({ title: "Succes", description: "Blog artikel succesvol verwijderd" });
      },
      onError: (error) => {
        if (!handleUnauthorizedError(error)) {
          toast({ title: "Fout", description: "Kon blog artikel niet verwijderen", variant: "destructive" });
        }
      },
    });

    const generateSlug = (title: string) => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    };

    return (
      <div className="space-y-6" data-testid="blog-editor">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Blog Beheer</h3>
          <Button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2"
            data-testid="button-add-blog"
          >
            <Plus className="w-4 h-4" />
            Artikel Toevoegen
          </Button>
        </div>

        {isCreating && (
          <Card data-testid="create-blog-form">
            <CardHeader>
              <CardTitle>Nieuw Blog Artikel Maken</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const slug = formData.slug || generateSlug(formData.title);
                  createMutation.mutate({ ...formData, slug });
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="title">Titel</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setFormData({ 
                        ...formData, 
                        title: newTitle,
                        slug: generateSlug(newTitle)
                      });
                    }}
                    data-testid="input-blog-title"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="automatisch-gegenereerd-vanuit-titel"
                    data-testid="input-blog-slug"
                  />
                </div>
                <div>
                  <Label htmlFor="excerpt">Samenvatting</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt || ""}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Korte samenvatting van het artikel..."
                    data-testid="textarea-blog-excerpt"
                  />
                </div>
                <div>
                  <Label htmlFor="content">Inhoud</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={8}
                    placeholder="Volledige inhoud van het artikel..."
                    data-testid="textarea-blog-content"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Categorie</Label>
                    <Input
                      id="category"
                      value={formData.category || ""}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="bijv. Duurzaamheid, Innovatie"
                      data-testid="input-blog-category"
                    />
                  </div>
                  <div>
                    <Label htmlFor="image">Uitgelichte Afbeelding URL</Label>
                    <Input
                      id="image"
                      value={formData.image || ""}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      data-testid="input-blog-image"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublished"
                    checked={formData.isPublished || false}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                    data-testid="switch-blog-published"
                  />
                  <Label htmlFor="isPublished">Publiceren</Label>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={createMutation.isPending} data-testid="button-save-blog">
                    <Save className="w-4 h-4 mr-2" />
                    {createMutation.isPending ? "Opslaan..." : "Opslaan"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      setFormData({ title: "", excerpt: "", content: "", category: "", image: "", slug: "", isPublished: false });
                    }}
                    data-testid="button-cancel-blog"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annuleren
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {articles.map((article) => (
            <Card key={article.id} data-testid={`blog-item-${article.id}`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{article.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        article.isPublished 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                      }`}>
                        {article.isPublished ? 'Gepubliceerd' : 'Concept'}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">{article.excerpt}</p>
                    <div className="text-xs text-muted-foreground mt-2">
                      <span className="inline-block mr-4">🏷️ {article.category}</span>
                      <span className="inline-block mr-4">🔗 /{article.slug}</span>
                      {article.publishedAt && (
                        <span className="inline-block">📅 {new Date(article.publishedAt).toLocaleDateString('nl-NL')}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(article.id)}
                      data-testid={`button-edit-blog-${article.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(article.id)}
                      data-testid={`button-delete-blog-${article.id}`}
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
    );
  };

  // Maatschappelijke Editor
  const MaatschappelijkeEditor = () => {
    const [formData, setFormData] = useState<InsertMaatschappelijkeContent>({
      titleNl: "",
      titleEn: "",
      descriptionNl: "",
      descriptionEn: "",
      contentNl: "",
      contentEn: "",
      image: "",
      gallery: [],
      initiatives: [],
      order: 0,
    });

    const { data: content = [] } = useQuery<MaatschappelijkeContent[]>({
      queryKey: ["/api/admin/maatschappelijke"],
    });

    const createMutation = useMutation({
      mutationFn: async (data: InsertMaatschappelijkeContent) => {
        return await apiRequest("/api/admin/maatschappelijke", "POST", data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/maatschappelijke"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/maatschappelijke"] });
        setFormData({ titleNl: "", titleEn: "", descriptionNl: "", descriptionEn: "", contentNl: "", contentEn: "", image: "", gallery: [], initiatives: [], order: 0 });
        setIsCreating(false);
        toast({ title: "Succes", description: "Maatschappelijke content succesvol toegevoegd" });
      },
      onError: (error) => {
        if (!handleUnauthorizedError(error)) {
          toast({ title: "Fout", description: "Kon maatschappelijke content niet toevoegen", variant: "destructive" });
        }
      },
    });

    const updateMutation = useMutation({
      mutationFn: async ({ id, data }: { id: string; data: Partial<InsertMaatschappelijkeContent> }) => {
        return await apiRequest(`/api/admin/maatschappelijke/${id}`, "PUT", data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/maatschappelijke"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/maatschappelijke"] });
        setEditingId(null);
        toast({ title: "Succes", description: "Maatschappelijke content succesvol bijgewerkt" });
      },
      onError: (error) => {
        if (!handleUnauthorizedError(error)) {
          toast({ title: "Fout", description: "Kon maatschappelijke content niet bijwerken", variant: "destructive" });
        }
      },
    });

    const deleteMutation = useMutation({
      mutationFn: async (id: string) => {
        return await apiRequest(`/api/admin/maatschappelijke/${id}`, "DELETE");
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/maatschappelijke"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/maatschappelijke"] });
        toast({ title: "Succes", description: "Maatschappelijke content succesvol verwijderd" });
      },
      onError: (error) => {
        if (!handleUnauthorizedError(error)) {
          toast({ title: "Fout", description: "Kon maatschappelijke content niet verwijderen", variant: "destructive" });
        }
      },
    });

    useEffect(() => {
      if (editingId && content.length > 0) {
        const contentToEdit = content.find(c => c.id === editingId);
        if (contentToEdit) {
          setFormData({
            titleNl: contentToEdit.titleNl,
            titleEn: contentToEdit.titleEn,
            descriptionNl: contentToEdit.descriptionNl,
            descriptionEn: contentToEdit.descriptionEn,
            contentNl: contentToEdit.contentNl,
            contentEn: contentToEdit.contentEn,
            image: contentToEdit.image || "",
            gallery: Array.isArray(contentToEdit.gallery) ? contentToEdit.gallery : [],
            initiatives: Array.isArray(contentToEdit.initiatives) ? contentToEdit.initiatives : [],
            order: contentToEdit.order,
          });
        }
      }
    }, [editingId, content]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingId) {
        updateMutation.mutate({ id: editingId, data: formData });
      } else {
        createMutation.mutate(formData);
      }
    };

    return (
      <div className="space-y-6" data-testid="maatschappelijke-editor">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Maatschappelijke Verantwoordelijkheid</h3>
          <Button onClick={() => setIsCreating(true)} data-testid="button-add-maatschappelijke">
            <Plus className="w-4 h-4 mr-2" />
            Voeg toe
          </Button>
        </div>

        {(isCreating || editingId) && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Bewerk Content" : "Nieuwe Content"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4" data-testid="maatschappelijke-form">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="titleNl">Titel (Nederlands)</Label>
                    <Input
                      id="titleNl"
                      value={formData.titleNl}
                      onChange={(e) => setFormData({ ...formData, titleNl: e.target.value })}
                      placeholder="e.g., Maatschappelijke Verantwoordelijkheid"
                      data-testid="input-title-nl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="titleEn">Titel (English)</Label>
                    <Input
                      id="titleEn"
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      placeholder="e.g., Social Responsibility"
                      data-testid="input-title-en"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="descriptionNl">Beschrijving (Nederlands)</Label>
                    <Textarea
                      id="descriptionNl"
                      value={formData.descriptionNl}
                      onChange={(e) => setFormData({ ...formData, descriptionNl: e.target.value })}
                      rows={3}
                      placeholder="Korte beschrijving..."
                      data-testid="textarea-description-nl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="descriptionEn">Beschrijving (English)</Label>
                    <Textarea
                      id="descriptionEn"
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                      rows={3}
                      placeholder="Short description..."
                      data-testid="textarea-description-en"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contentNl">Inhoud (Nederlands)</Label>
                    <Textarea
                      id="contentNl"
                      value={formData.contentNl}
                      onChange={(e) => setFormData({ ...formData, contentNl: e.target.value })}
                      rows={6}
                      placeholder="Uitgebreide inhoud..."
                      data-testid="textarea-content-nl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contentEn">Inhoud (English)</Label>
                    <Textarea
                      id="contentEn"
                      value={formData.contentEn}
                      onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                      rows={6}
                      placeholder="Extended content..."
                      data-testid="textarea-content-en"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="image">Afbeelding URL</Label>
                    <Input
                      id="image"
                      value={formData.image || ""}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      data-testid="input-image"
                    />
                  </div>
                  <div>
                    <Label htmlFor="order">Volgorde</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      data-testid="input-order"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={editingId ? updateMutation.isPending : createMutation.isPending} 
                    data-testid="button-save"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {(editingId ? updateMutation.isPending : createMutation.isPending) ? "Opslaan..." : "Opslaan"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingId(null);
                      setFormData({ titleNl: "", titleEn: "", descriptionNl: "", descriptionEn: "", contentNl: "", contentEn: "", image: "", gallery: [], initiatives: [], order: 0 });
                    }}
                    data-testid="button-cancel"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annuleren
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {content.map((item) => (
            <Card key={item.id} data-testid={`maatschappelijke-item-${item.id}`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{item.titleNl}</h4>
                    <p className="text-muted-foreground mb-2">{item.descriptionNl}</p>
                    <div className="text-sm text-muted-foreground">Volgorde: {item.order}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(item.id)}
                      data-testid={`button-edit-${item.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(item.id)}
                      data-testid={`button-delete-${item.id}`}
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
    );
  };

  // Section Settings Editor - Simplified Version
  const SectionSettingsEditor = () => {
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
        queryClient.invalidateQueries({ queryKey: ["/api/section-settings"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/section-settings"] });
        toast({ title: "Succes", description: "Sectie-instelling succesvol bijgewerkt" });
      },
      onError: (error) => {
        if (!handleUnauthorizedError(error)) {
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
  };

  const PartnersEditor = () => {
    const [formData, setFormData] = useState<InsertPartner>({
      name: "",
      category: "",
      since: "",
      order: 0,
      logo: "",
    });
    const [uploadingLogo, setUploadingLogo] = useState(false);

    const { data: partners = [] } = useQuery<Partner[]>({
      queryKey: ["/api/admin/partners"],
    });

    // Populate form data when editing a partner
    useEffect(() => {
      if (editingId && partners.length > 0) {
        const partnerToEdit = partners.find(p => p.id === editingId);
        if (partnerToEdit) {
          setFormData({
            name: partnerToEdit.name,
            category: partnerToEdit.category,
            since: partnerToEdit.since || "",
            order: partnerToEdit.order,
            logo: partnerToEdit.logo || "",
          });
        }
      }
    }, [editingId, partners]);

    const createMutation = useMutation({
      mutationFn: async (data: InsertPartner) => {
        return await apiRequest("/api/admin/partners", "POST", data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/partners"] });
        setFormData({ name: "", category: "", since: "", order: 0, logo: "" });
        setIsCreating(false);
        toast({ title: "Succes", description: "Partner succesvol toegevoegd" });
      },
      onError: (error) => {
        if (!handleUnauthorizedError(error)) {
          toast({ title: "Fout", description: "Kon partner niet toevoegen", variant: "destructive" });
        }
      },
    });

    // File upload handler
    const handleLogoUpload = async (file: File) => {
      setUploadingLogo(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/admin/media/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Upload failed');
        }
        
        const result = await response.json();
        return result.url;
      } catch (error) {
        toast({ title: "Fout", description: "Kon logo niet uploaden", variant: "destructive" });
        throw error;
      } finally {
        setUploadingLogo(false);
      }
    };

    const updateMutation = useMutation({
      mutationFn: async ({ id, data }: { id: string; data: Partial<InsertPartner> }) => {
        return await apiRequest(`/api/admin/partners/${id}`, "PUT", data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/partners"] });
        setEditingId(null);
        toast({ title: "Succes", description: "Partner succesvol bijgewerkt" });
      },
      onError: (error) => {
        if (!handleUnauthorizedError(error)) {
          toast({ title: "Fout", description: "Kon partner niet bijwerken", variant: "destructive" });
        }
      },
    });

    const deleteMutation = useMutation({
      mutationFn: async (id: string) => {
        return await apiRequest(`/api/admin/partners/${id}`, "DELETE");
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/partners"] });
        toast({ title: "Succes", description: "Partner succesvol verwijderd" });
      },
      onError: (error) => {
        if (!handleUnauthorizedError(error)) {
          toast({ title: "Fout", description: "Kon partner niet verwijderen", variant: "destructive" });
        }
      },
    });

    return (
      <div className="space-y-6" data-testid="partners-editor">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Partners Beheer</h3>
          <Button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2"
            data-testid="button-add-partner"
          >
            <Plus className="w-4 h-4" />
            Partner Toevoegen
          </Button>
        </div>

        {isCreating && (
          <Card data-testid="create-partner-form">
            <CardHeader>
              <CardTitle>Nieuwe Partner Toevoegen</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createMutation.mutate(formData);
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="name">Bedrijfsnaam</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="bijv. Groene Materialen BV"
                    data-testid="input-partner-name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Categorie</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger data-testid="select-partner-category">
                        <SelectValue placeholder="Selecteer categorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Materialen">Materialen</SelectItem>
                        <SelectItem value="Veiligheid">Veiligheid</SelectItem>
                        <SelectItem value="Technologie">Technologie</SelectItem>
                        <SelectItem value="Architectuur">Architectuur</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Logistiek">Logistiek</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="since">Partner Sinds</Label>
                    <Input
                      id="since"
                      value={formData.since || ""}
                      onChange={(e) => setFormData({ ...formData, since: e.target.value })}
                      placeholder="bijv. Sinds 2020"
                      data-testid="input-partner-since"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="order">Volgorde</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    data-testid="input-partner-order"
                  />
                </div>
                
                {/* Logo Upload */}
                <div>
                  <Label htmlFor="logo">Partner Logo</Label>
                  <div className="flex items-center gap-3 mt-2">
                    {formData.logo && (
                      <div className="flex items-center gap-2">
                        <img
                          src={formData.logo}
                          alt="Partner logo"
                          className="w-12 h-12 object-contain border rounded"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFormData({ ...formData, logo: "" })}
                          data-testid="button-remove-logo"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const logoUrl = await handleLogoUpload(file);
                            setFormData({ ...formData, logo: logoUrl });
                          } catch (error) {
                            console.error("Logo upload failed:", error);
                          }
                        }
                      }}
                      disabled={uploadingLogo}
                      className="flex-1"
                      data-testid="input-partner-logo"
                    />
                    {uploadingLogo && (
                      <span className="text-sm text-muted-foreground">Uploading...</span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" disabled={createMutation.isPending} data-testid="button-save-partner">
                    <Save className="w-4 h-4 mr-2" />
                    {createMutation.isPending ? "Opslaan..." : "Opslaan"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      setFormData({ name: "", category: "", since: "", order: 0 });
                    }}
                    data-testid="button-cancel-partner"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annuleren
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {editingId && (
          <Card data-testid="edit-partner-form">
            <CardHeader>
              <CardTitle>Partner Bewerken</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateMutation.mutate({ id: editingId, data: formData });
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="edit-name">Bedrijfsnaam</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    data-testid="input-edit-partner-name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category">Categorie</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger data-testid="select-edit-partner-category">
                      <SelectValue placeholder="Selecteer categorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bouw">Bouw</SelectItem>
                      <SelectItem value="Techniek">Techniek</SelectItem>
                      <SelectItem value="Leverancier">Leverancier</SelectItem>
                      <SelectItem value="Consultant">Consultant</SelectItem>
                      <SelectItem value="Logistiek">Logistiek</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-since">Partner Sinds</Label>
                  <Input
                    id="edit-since"
                    value={formData.since || ""}
                    onChange={(e) => setFormData({ ...formData, since: e.target.value })}
                    placeholder="bijv. Sinds 2020"
                    data-testid="input-edit-partner-since"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-order">Volgorde</Label>
                  <Input
                    id="edit-order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    data-testid="input-edit-partner-order"
                  />
                </div>
                
                {/* Logo Upload - Edit Form */}
                <div>
                  <Label htmlFor="edit-logo">Partner Logo</Label>
                  <div className="flex items-center gap-3 mt-2">
                    {formData.logo && (
                      <div className="flex items-center gap-2">
                        <img
                          src={formData.logo}
                          alt="Partner logo"
                          className="w-12 h-12 object-contain border rounded"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFormData({ ...formData, logo: "" })}
                          data-testid="button-remove-edit-logo"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const logoUrl = await handleLogoUpload(file);
                            setFormData({ ...formData, logo: logoUrl });
                          } catch (error) {
                            console.error("Logo upload failed:", error);
                          }
                        }
                      }}
                      disabled={uploadingLogo}
                      className="flex-1"
                      data-testid="input-edit-partner-logo"
                    />
                    {uploadingLogo && (
                      <span className="text-sm text-muted-foreground">Uploading...</span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending}
                    data-testid="button-save-edit-partner"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {updateMutation.isPending ? "Opslaan..." : "Opslaan"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ name: "", category: "", since: "", order: 0 });
                    }}
                    data-testid="button-cancel-edit-partner"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annuleren
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {partners.map((partner) => (
            <Card key={partner.id} data-testid={`partner-item-${partner.id}`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3 flex-1">
                    {partner.logo && (
                      <img
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        className="w-10 h-10 object-contain border rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold">{partner.name}</h4>
                      <div className="text-xs text-muted-foreground mt-2">
                        <span className="inline-block mr-4">🏷️ {partner.category}</span>
                        <span className="inline-block mr-4">📅 {partner.since}</span>
                        <span className="inline-block">📋 Volgorde: {partner.order}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(partner.id)}
                      data-testid={`button-edit-partner-${partner.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(partner.id)}
                      data-testid={`button-delete-partner-${partner.id}`}
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
    );
  };

  const renderEditor = () => {
    switch (contentType) {
      case "hero":
        return <HeroEditor />;
      case "statistics":
        return <StatisticsEditor />;
      case "about":
        return <AboutEditor />;
      case "services":
        return <ServicesEditor />;
      case "projects":
        return <ProjectsEditor />;
      case "blog":
        return <EnhancedBlogEditor />;
      case "partners":
        return <PartnersEditor />;
      case "maatschappelijke":
        return <MaatschappelijkeEditor />;
      case "section-settings":
        return <SectionSettingsEditor />;
      case "inquiries":
        return <InquiriesViewer />;
      default:
        return <div>Content type not found</div>;
    }
  };

  return <div data-testid={`content-editor-${contentType}`}>{renderEditor()}</div>;
}
