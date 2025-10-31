'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save } from 'lucide-react';

export default function HeroAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/hero-content');
      if (res.ok) {
        const data = await res.json();
        setFormData(data || {});
      }
    } catch (error) {
      console.error('Error fetching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch('/api/admin/hero-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        alert('Hero content updated successfully!');
      } else {
        alert('Failed to update hero content');
      }
    } catch (error) {
      alert('Error updating hero content');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  if (loading) {
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
          <p className="text-gray-600">Manage your homepage hero section content</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dutch Content */}
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
                  />
                </div>
                <div>
                  <Label htmlFor="secondaryCtaNl">Secondary Button (NL)</Label>
                  <Input
                    id="secondaryCtaNl"
                    value={formData.secondaryCtaNl || ''}
                    onChange={(e) => handleChange('secondaryCtaNl', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* English Content */}
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
                />
              </div>
              <div>
                <Label htmlFor="subtitleEn">Subtitle (EN)</Label>
                <Textarea
                  id="subtitleEn"
                  value={formData.subtitleEn || ''}
                  onChange={(e) => handleChange('subtitleEn', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryCtaEn">Primary Button (EN)</Label>
                  <Input
                    id="primaryCtaEn"
                    value={formData.primaryCtaEn || ''}
                    onChange={(e) => handleChange('primaryCtaEn', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="secondaryCtaEn">Secondary Button (EN)</Label>
                  <Input
                    id="secondaryCtaEn"
                    value={formData.secondaryCtaEn || ''}
                    onChange={(e) => handleChange('secondaryCtaEn', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Background Media</CardTitle>
              <CardDescription>Configure background video or image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="mediaType">Media Type</Label>
                <select
                  id="mediaType"
                  value={formData.mediaType || 'image'}
                  onChange={(e) => handleChange('mediaType', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
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
                    <p className="text-sm text-gray-500 mt-1">
                      Supports: Direct MP4/WebM links, YouTube, Vimeo
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="videoType">Video Type</Label>
                    <select
                      id="videoType"
                      value={formData.videoType || 'upload'}
                      onChange={(e) => handleChange('videoType', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="upload">Direct Upload/URL</option>
                      <option value="youtube">YouTube</option>
                      <option value="vimeo">Vimeo</option>
                    </select>
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

              <div>
                <Label htmlFor="overlayOpacity">Overlay Opacity (%)</Label>
                <Input
                  id="overlayOpacity"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.overlayOpacity || 40}
                  onChange={(e) => handleChange('overlayOpacity', parseInt(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="textAlign">Text Alignment</Label>
                <select
                  id="textAlign"
                  value={formData.textAlign || 'center'}
                  onChange={(e) => handleChange('textAlign', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving} className="px-6">
              {saving ? (
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
