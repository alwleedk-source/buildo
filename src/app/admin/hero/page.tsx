'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, Video, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function HeroAdmin() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<any>({});

  const { data: heroData, isLoading } = useQuery({
    queryKey: ['/api/admin/hero-content'],
    queryFn: async () => {
      const res = await fetch('/api/admin/hero-content');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setFormData(data || {});
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/admin/hero-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/hero-content'] });
      toast.success('Hero content updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update hero content');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Hero Section</h1>
          <p className="text-muted-foreground">Manage your homepage hero section content</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="content" className="space-y-6">
            <TabsList>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dutch Content</CardTitle>
                  <CardDescription>Content displayed in Dutch language</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="titleNl">Title (NL)</Label>
                    <Input
                      id="titleNl"
                      value={formData.titleNl || ''}
                      onChange={(e) => handleChange('titleNl', e.target.value)}
                      placeholder="Enter Dutch title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subtitleNl">Subtitle (NL)</Label>
                    <Textarea
                      id="subtitleNl"
                      value={formData.subtitleNl || ''}
                      onChange={(e) => handleChange('subtitleNl', e.target.value)}
                      placeholder="Enter Dutch subtitle"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primaryCtaNl">Primary Button (NL)</Label>
                      <Input
                        id="primaryCtaNl"
                        value={formData.primaryCtaNl || ''}
                        onChange={(e) => handleChange('primaryCtaNl', e.target.value)}
                        placeholder="e.g., Neem Contact Op"
                      />
                    </div>
                    <div>
                      <Label htmlFor="secondaryCtaNl">Secondary Button (NL)</Label>
                      <Input
                        id="secondaryCtaNl"
                        value={formData.secondaryCtaNl || ''}
                        onChange={(e) => handleChange('secondaryCtaNl', e.target.value)}
                        placeholder="e.g., Bekijk Projecten"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>English Content</CardTitle>
                  <CardDescription>Content displayed in English language</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="titleEn">Title (EN)</Label>
                    <Input
                      id="titleEn"
                      value={formData.titleEn || ''}
                      onChange={(e) => handleChange('titleEn', e.target.value)}
                      placeholder="Enter English title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subtitleEn">Subtitle (EN)</Label>
                    <Textarea
                      id="subtitleEn"
                      value={formData.subtitleEn || ''}
                      onChange={(e) => handleChange('subtitleEn', e.target.value)}
                      placeholder="Enter English subtitle"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primaryCtaEn">Primary Button (EN)</Label>
                      <Input
                        id="primaryCtaEn"
                        value={formData.primaryCtaEn || ''}
                        onChange={(e) => handleChange('primaryCtaEn', e.target.value)}
                        placeholder="e.g., Contact Us"
                      />
                    </div>
                    <div>
                      <Label htmlFor="secondaryCtaEn">Secondary Button (EN)</Label>
                      <Input
                        id="secondaryCtaEn"
                        value={formData.secondaryCtaEn || ''}
                        onChange={(e) => handleChange('secondaryCtaEn', e.target.value)}
                        placeholder="e.g., View Projects"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Background Media</CardTitle>
                  <CardDescription>Choose between video or image background</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Media Type</Label>
                    <Select
                      value={formData.mediaType || 'image'}
                      onValueChange={(value) => handleChange('mediaType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image">
                          <div className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" />
                            Image
                          </div>
                        </SelectItem>
                        <SelectItem value="video">
                          <div className="flex items-center gap-2">
                            <Video className="w-4 h-4" />
                            Video
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.mediaType === 'video' && (
                    <>
                      <div>
                        <Label htmlFor="videoUrl">Video URL</Label>
                        <Input
                          id="videoUrl"
                          type="url"
                          value={formData.videoUrl || ''}
                          onChange={(e) => handleChange('videoUrl', e.target.value)}
                          placeholder="https://example.com/video.mp4"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Supports: Direct MP4/WebM links, YouTube, Vimeo
                        </p>
                      </div>
                      <div>
                        <Label>Video Type</Label>
                        <Select
                          value={formData.videoType || 'upload'}
                          onValueChange={(value) => handleChange('videoType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="upload">Direct Upload/URL</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                            <SelectItem value="vimeo">Vimeo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {formData.mediaType === 'image' && (
                    <div>
                      <Label htmlFor="backgroundImage">Background Image URL</Label>
                      <Input
                        id="backgroundImage"
                        type="url"
                        value={formData.backgroundImage || ''}
                        onChange={(e) => handleChange('backgroundImage', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Display Settings</CardTitle>
                  <CardDescription>Customize how the hero section appears</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Text Alignment</Label>
                    <Select
                      value={formData.textAlign || 'center'}
                      onValueChange={(value) => handleChange('textAlign', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Overlay Opacity: {formData.overlayOpacity || 40}%</Label>
                    <Slider
                      value={[formData.overlayOpacity || 40]}
                      onValueChange={([value]) => handleChange('overlayOpacity', value)}
                      min={0}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="headerOverlay">Transparent Header</Label>
                    <Switch
                      id="headerOverlay"
                      checked={formData.headerOverlay || false}
                      onCheckedChange={(checked) => handleChange('headerOverlay', checked)}
                    />
                  </div>

                  <div>
                    <Label>Display Style</Label>
                    <Select
                      value={formData.displayStyle || 'overlay'}
                      onValueChange={(value) => handleChange('displayStyle', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="overlay">Overlay</SelectItem>
                        <SelectItem value="split">Split Screen</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4 mt-6">
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
