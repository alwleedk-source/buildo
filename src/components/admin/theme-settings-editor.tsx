'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Upload, Eye, Palette, Type, Layout as LayoutIcon, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ThemeSettings {
  id?: string;
  logoUrl: string | null;
  logoWidth: number;
  logoHeight: number;
  faviconUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  headingFontFamily: string;
  fontSize: string;
  containerMaxWidth: string;
  borderRadius: string;
  darkModeEnabled: boolean;
  darkPrimaryColor: string;
  darkBackgroundColor: string;
  darkTextColor: string;
  customCss: string | null;
}

export function ThemeSettingsEditor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<ThemeSettings>({
    logoUrl: null,
    logoWidth: 180,
    logoHeight: 60,
    faviconUrl: null,
    primaryColor: '#0066CC',
    secondaryColor: '#FF6B35',
    accentColor: '#4ECDC4',
    backgroundColor: '#FFFFFF',
    textColor: '#1A1A1A',
    fontFamily: 'Inter',
    headingFontFamily: 'Inter',
    fontSize: '16px',
    containerMaxWidth: '1280px',
    borderRadius: '8px',
    darkModeEnabled: false,
    darkPrimaryColor: '#3B82F6',
    darkBackgroundColor: '#1A1A1A',
    darkTextColor: '#F5F5F5',
    customCss: null
  });

  // Fetch theme settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['/api/admin/theme-settings'],
    queryFn: async () => {
      const res = await fetch('/api/admin/theme-settings');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      return json.data;
    }
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: ThemeSettings) => {
      const res = await fetch('/api/admin/theme-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/theme-settings'] });
      toast({
        title: 'Success',
        description: 'Theme settings updated successfully!'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update theme settings',
        variant: 'destructive'
      });
    }
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) throw new Error('Upload failed');
      
      const data = await res.json();
      setFormData(prev => ({ ...prev, logoUrl: data.url }));
      
      toast({
        title: 'Success',
        description: 'Logo uploaded successfully!'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload logo',
        variant: 'destructive'
      });
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataObj = new FormData();
    formDataObj.append('file', file);

    try {
      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formDataObj
      });
      
      if (!res.ok) throw new Error('Upload failed');
      
      const data = await res.json();
      setFormData(prev => ({ ...prev, faviconUrl: data.url }));
      
      toast({
        title: 'Success',
        description: 'Favicon uploaded successfully!'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload favicon',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Theme Settings</h1>
          <p className="text-muted-foreground">Customize your website's appearance</p>
        </div>
        <Button onClick={handleSave} disabled={updateMutation.isPending}>
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

      <Tabs defaultValue="branding" className="space-y-4">
        <TabsList>
          <TabsTrigger value="branding">
            <ImageIcon className="w-4 h-4 mr-2" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="colors">
            <Palette className="w-4 h-4 mr-2" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="typography">
            <Type className="w-4 h-4 mr-2" />
            Typography
          </TabsTrigger>
          <TabsTrigger value="layout">
            <LayoutIcon className="w-4 h-4 mr-2" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="advanced">
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logo Settings</CardTitle>
              <CardDescription>Upload and configure your website logo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Logo Image</Label>
                  <div className="mt-2 space-y-4">
                    {formData.logoUrl && (
                      <div className="relative inline-block p-4 border rounded-lg bg-muted">
                        <Image
                          src={formData.logoUrl}
                          alt="Logo"
                          width={formData.logoWidth}
                          height={formData.logoHeight}
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="max-w-sm"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Recommended: PNG or SVG format, transparent background
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="logoWidth">Logo Width (px)</Label>
                    <Input
                      id="logoWidth"
                      type="number"
                      value={formData.logoWidth}
                      onChange={(e) => setFormData(prev => ({ ...prev, logoWidth: parseInt(e.target.value) || 180 }))}
                      min={50}
                      max={500}
                    />
                  </div>
                  <div>
                    <Label htmlFor="logoHeight">Logo Height (px)</Label>
                    <Input
                      id="logoHeight"
                      type="number"
                      value={formData.logoHeight}
                      onChange={(e) => setFormData(prev => ({ ...prev, logoHeight: parseInt(e.target.value) || 60 }))}
                      min={20}
                      max={200}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <div>
                  <Label>Favicon</Label>
                  <div className="mt-2 space-y-4">
                    {formData.faviconUrl && (
                      <div className="relative inline-block p-2 border rounded-lg bg-muted">
                        <Image
                          src={formData.faviconUrl}
                          alt="Favicon"
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <Input
                        type="file"
                        accept="image/x-icon,image/png"
                        onChange={handleFaviconUpload}
                        className="max-w-sm"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Recommended: 32x32px ICO or PNG format
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
              <CardDescription>Customize your website's color palette</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={formData.accentColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={formData.accentColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={formData.backgroundColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={formData.backgroundColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="textColor">Text Color</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="textColor"
                      type="color"
                      value={formData.textColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, textColor: e.target.value }))}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={formData.textColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, textColor: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable dark mode support</p>
                  </div>
                  <Switch
                    checked={formData.darkModeEnabled}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, darkModeEnabled: checked }))}
                  />
                </div>

                {formData.darkModeEnabled && (
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div>
                      <Label htmlFor="darkPrimaryColor">Dark Primary Color</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="darkPrimaryColor"
                          type="color"
                          value={formData.darkPrimaryColor}
                          onChange={(e) => setFormData(prev => ({ ...prev, darkPrimaryColor: e.target.value }))}
                          className="w-20 h-10"
                        />
                        <Input
                          type="text"
                          value={formData.darkPrimaryColor}
                          onChange={(e) => setFormData(prev => ({ ...prev, darkPrimaryColor: e.target.value }))}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="darkBackgroundColor">Dark Background</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="darkBackgroundColor"
                          type="color"
                          value={formData.darkBackgroundColor}
                          onChange={(e) => setFormData(prev => ({ ...prev, darkBackgroundColor: e.target.value }))}
                          className="w-20 h-10"
                        />
                        <Input
                          type="text"
                          value={formData.darkBackgroundColor}
                          onChange={(e) => setFormData(prev => ({ ...prev, darkBackgroundColor: e.target.value }))}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="darkTextColor">Dark Text Color</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="darkTextColor"
                          type="color"
                          value={formData.darkTextColor}
                          onChange={(e) => setFormData(prev => ({ ...prev, darkTextColor: e.target.value }))}
                          className="w-20 h-10"
                        />
                        <Input
                          type="text"
                          value={formData.darkTextColor}
                          onChange={(e) => setFormData(prev => ({ ...prev, darkTextColor: e.target.value }))}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Typography Settings</CardTitle>
              <CardDescription>Configure fonts and text sizes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fontFamily">Body Font Family</Label>
                <Input
                  id="fontFamily"
                  value={formData.fontFamily}
                  onChange={(e) => setFormData(prev => ({ ...prev, fontFamily: e.target.value }))}
                  placeholder="Inter, sans-serif"
                />
              </div>

              <div>
                <Label htmlFor="headingFontFamily">Heading Font Family</Label>
                <Input
                  id="headingFontFamily"
                  value={formData.headingFontFamily}
                  onChange={(e) => setFormData(prev => ({ ...prev, headingFontFamily: e.target.value }))}
                  placeholder="Inter, sans-serif"
                />
              </div>

              <div>
                <Label htmlFor="fontSize">Base Font Size</Label>
                <Input
                  id="fontSize"
                  value={formData.fontSize}
                  onChange={(e) => setFormData(prev => ({ ...prev, fontSize: e.target.value }))}
                  placeholder="16px"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout Tab */}
        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Layout Settings</CardTitle>
              <CardDescription>Configure layout and spacing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="containerMaxWidth">Container Max Width</Label>
                <Input
                  id="containerMaxWidth"
                  value={formData.containerMaxWidth}
                  onChange={(e) => setFormData(prev => ({ ...prev, containerMaxWidth: e.target.value }))}
                  placeholder="1280px"
                />
              </div>

              <div>
                <Label htmlFor="borderRadius">Border Radius</Label>
                <Input
                  id="borderRadius"
                  value={formData.borderRadius}
                  onChange={(e) => setFormData(prev => ({ ...prev, borderRadius: e.target.value }))}
                  placeholder="8px"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom CSS</CardTitle>
              <CardDescription>Add custom CSS to override default styles</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.customCss || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, customCss: e.target.value }))}
                placeholder="/* Add your custom CSS here */&#10;.custom-class {&#10;  color: red;&#10;}"
                rows={15}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
