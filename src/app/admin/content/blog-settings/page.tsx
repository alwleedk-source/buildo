'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save } from 'lucide-react';

export default function BlogSettingsAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/section-settings');
      if (res.ok) {
        const data = await res.json();
        const blogSetting = data.find((s: any) => s.sectionKey === 'blog');
        setFormData(blogSetting || { sectionKey: 'blog', isVisible: true, showInFooter: true });
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
      const res = await fetch('/api/section-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        alert('Blog settings updated successfully!');
      } else {
        alert('Failed to update blog settings');
      }
    } catch (error) {
      alert('Error updating blog settings');
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
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Blog Section Settings</h1>
          <p className="text-gray-600">Configure blog section visibility and display options</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Section Settings</CardTitle>
              <CardDescription>Control how the blog section appears on your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isVisible">Show Blog Section</Label>
                  <p className="text-sm text-gray-500">Display blog section on homepage</p>
                </div>
                <Switch
                  id="isVisible"
                  checked={formData.isVisible || false}
                  onCheckedChange={(checked) => handleChange('isVisible', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="showInFooter">Show in Footer</Label>
                  <p className="text-sm text-gray-500">Include blog link in footer navigation</p>
                </div>
                <Switch
                  id="showInFooter"
                  checked={formData.showInFooter || false}
                  onCheckedChange={(checked) => handleChange('showInFooter', checked)}
                />
              </div>

              <div>
                <Label htmlFor="titleNl">Section Title (NL)</Label>
                <Input
                  id="titleNl"
                  value={formData.titleNl || ''}
                  onChange={(e) => handleChange('titleNl', e.target.value)}
                  placeholder="Laatste Nieuws"
                />
              </div>

              <div>
                <Label htmlFor="titleEn">Section Title (EN)</Label>
                <Input
                  id="titleEn"
                  value={formData.titleEn || ''}
                  onChange={(e) => handleChange('titleEn', e.target.value)}
                  placeholder="Latest News"
                />
              </div>

              <div>
                <Label htmlFor="descriptionNl">Description (NL)</Label>
                <Textarea
                  id="descriptionNl"
                  value={formData.descriptionNl || ''}
                  onChange={(e) => handleChange('descriptionNl', e.target.value)}
                  placeholder="Blijf op de hoogte van onze laatste projecten en nieuws..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="descriptionEn">Description (EN)</Label>
                <Textarea
                  id="descriptionEn"
                  value={formData.descriptionEn || ''}
                  onChange={(e) => handleChange('descriptionEn', e.target.value)}
                  placeholder="Stay updated with our latest projects and news..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="postsPerPage">Posts Per Page</Label>
                <Input
                  id="postsPerPage"
                  type="number"
                  min="1"
                  max="50"
                  value={formData.postsPerPage || 6}
                  onChange={(e) => handleChange('postsPerPage', parseInt(e.target.value))}
                />
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
