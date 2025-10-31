"use client";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save, MoveUp, MoveDown } from 'lucide-react';

interface FormField {
  id: string;
  fieldKey: string;
  labelNl: string;
  labelEn: string;
  placeholder: string | null;
  isRequired: boolean;
  isVisible: boolean;
  fieldType: string;
  options: any;
  order: number;
}

export default function ContactFormSettingsPage() {
  const queryClient = useQueryClient();
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Fetch form settings
  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['/api/admin/contact-form-settings'],
    queryFn: async () => {
      const response = await fetch('/api/admin/contact-form-settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      return response.json();
    }
  });

  const fields = settingsData?.data || [];

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (field: FormField) => {
      const response = await fetch('/api/admin/contact-form-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(field)
      });
      if (!response.ok) throw new Error('Failed to update field');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contact-form-settings'] });
      setEditingField(null);
      alert('Field updated successfully!');
    }
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (field: Partial<FormField>) => {
      const response = await fetch('/api/admin/contact-form-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(field)
      });
      if (!response.ok) throw new Error('Failed to create field');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contact-form-settings'] });
      setIsAdding(false);
      alert('Field created successfully!');
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/contact-form-settings?id=${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete field');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contact-form-settings'] });
      alert('Field deleted successfully!');
    }
  });

  const handleSave = (field: FormField) => {
    if (field.id) {
      updateMutation.mutate(field);
    } else {
      createMutation.mutate(field);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this field?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Contact Form Settings</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Contact Form Settings</h1>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Field
        </Button>
      </div>

      <div className="grid gap-6">
        {fields.map((field: FormField) => (
          <Card key={field.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{field.labelNl} / {field.labelEn}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingField(field)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(field.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <strong>Key:</strong> {field.fieldKey}
                </div>
                <div>
                  <strong>Type:</strong> {field.fieldType}
                </div>
                <div>
                  <strong>Required:</strong> {field.isRequired ? 'Yes' : 'No'}
                </div>
                <div>
                  <strong>Visible:</strong> {field.isVisible ? 'Yes' : 'No'}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {(editingField || isAdding) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingField ? 'Edit Field' : 'Add Field'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const field = {
                    id: editingField?.id || '',
                    fieldKey: formData.get('fieldKey') as string,
                    labelNl: formData.get('labelNl') as string,
                    labelEn: formData.get('labelEn') as string,
                    placeholder: formData.get('placeholder') as string,
                    isRequired: formData.get('isRequired') === 'on',
                    isVisible: formData.get('isVisible') === 'on',
                    fieldType: formData.get('fieldType') as string,
                    options: null,
                    order: parseInt(formData.get('order') as string) || 0
                  };
                  handleSave(field);
                }}
                className="space-y-4"
              >
                <div>
                  <Label>Field Key</Label>
                  <Input
                    name="fieldKey"
                    defaultValue={editingField?.fieldKey || ''}
                    required
                    placeholder="e.g., first_name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Label (NL)</Label>
                    <Input
                      name="labelNl"
                      defaultValue={editingField?.labelNl || ''}
                      required
                      placeholder="Voornaam"
                    />
                  </div>
                  <div>
                    <Label>Label (EN)</Label>
                    <Input
                      name="labelEn"
                      defaultValue={editingField?.labelEn || ''}
                      required
                      placeholder="First Name"
                    />
                  </div>
                </div>

                <div>
                  <Label>Placeholder</Label>
                  <Input
                    name="placeholder"
                    defaultValue={editingField?.placeholder || ''}
                    placeholder="John"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Field Type</Label>
                    <Select name="fieldType" defaultValue={editingField?.fieldType || 'text'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="tel">Phone</SelectItem>
                        <SelectItem value="textarea">Textarea</SelectItem>
                        <SelectItem value="select">Select</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Order</Label>
                    <Input
                      name="order"
                      type="number"
                      defaultValue={editingField?.order || 0}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      name="isRequired"
                      defaultChecked={editingField?.isRequired ?? true}
                    />
                    <Label>Required</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      name="isVisible"
                      defaultChecked={editingField?.isVisible ?? true}
                    />
                    <Label>Visible</Label>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingField(null);
                      setIsAdding(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
