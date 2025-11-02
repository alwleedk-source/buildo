'use client';

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Settings, Edit, Save, X, Check } from "lucide-react";
import type { EmailSetting, InsertEmailSetting } from '@/lib/db/schema';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface EmailSettingsProps {}

export function EmailSettings({}: EmailSettingsProps) {
  const [editingSetting, setEditingSetting] = useState<EmailSetting | null>(null);
  const [editValue, setEditValue] = useState("");
  
  const { toast } = useToast();

  const { data: settings = [], isLoading } = useQuery<EmailSetting[]>({
    queryKey: ['/api/admin/email/settings'],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, setting }: { id: string; setting: Partial<InsertEmailSetting> }) => {
      const response = await fetch(`/api/admin/email/settings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(setting),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update setting');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/email/settings'] });
      setEditingSetting(null);
      setEditValue("");
      toast({
        title: "Instelling bijgewerkt",
        description: "E-mailinstelling succesvol bijgewerkt",
      });
    },
    onError: (error) => {
      toast({
        title: "Fout bij bijwerken instelling",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const startEditing = (setting: EmailSetting) => {
    setEditingSetting(setting);
    setEditValue(setting.settingValue || "");
  };

  const cancelEditing = () => {
    setEditingSetting(null);
    setEditValue("");
  };

  const saveEdit = async () => {
    if (!editingSetting) return;
    
    updateMutation.mutate({
      id: editingSetting.id,
      setting: { 
        settingKey: editingSetting.settingKey,
        settingValue: editValue 
      }
    });
  };

  const toggleBooleanSetting = (setting: EmailSetting) => {
    const newValue = setting.settingValue === 'true' ? 'false' : 'true';
    updateMutation.mutate({
      id: setting.id,
      setting: { 
        settingKey: setting.settingKey,
        settingValue: newValue 
      }
    });
  };

  const getSettingTypeDisplay = (type: string) => {
    switch (type) {
      case 'text':
        return 'Tekst';
      case 'boolean':
        return 'Logisch';
      case 'number':
        return 'Numeriek';
      case 'email':
        return 'E-mail';
      case 'url':
        return 'URL';
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">E-mailinstellingen laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">E-mailinstellingen</h1>
          <p className="text-muted-foreground">
            Beheer e-mailsysteeminstellingen en globale variabelen
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Information Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Bedrijfsinformatie
            </CardTitle>
            <CardDescription>
              Basisinformatie over het bedrijf gebruikt in e-mailtemplates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {settings
                .filter((setting: EmailSetting) => 
                  ['company_name', 'company_email', 'company_phone', 'company_address', 'website_url'].includes(setting.settingKey)
                )
                .map((setting: EmailSetting) => (
                  <SettingRow
                    key={setting.id}
                    setting={setting}
                    isEditing={editingSetting?.id === setting.id}
                    editValue={editValue}
                    onEdit={startEditing}
                    onCancel={cancelEditing}
                    onSave={saveEdit}
                    onToggle={toggleBooleanSetting}
                    setEditValue={setEditValue}
                    isLoading={updateMutation.isPending}
                  />
                ))}
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Systeem Instellingen
            </CardTitle>
            <CardDescription>
              Email systeem en notificatie instellingen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {settings
                .filter((setting: EmailSetting) => 
                  !['company_name', 'company_email', 'company_phone', 'company_address', 'website_url'].includes(setting.settingKey)
                )
                .map((setting: EmailSetting) => (
                  <SettingRow
                    key={setting.id}
                    setting={setting}
                    isEditing={editingSetting?.id === setting.id}
                    editValue={editValue}
                    onEdit={startEditing}
                    onCancel={cancelEditing}
                    onSave={saveEdit}
                    onToggle={toggleBooleanSetting}
                    setEditValue={setEditValue}
                    isLoading={updateMutation.isPending}
                  />
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Settings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Alle Instellingen</CardTitle>
          <CardDescription>
            Volledig overzicht van alle email instellingen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Setting Sleutel</TableHead>
                <TableHead>Waarde</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Beschrijving</TableHead>
                <TableHead>Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {settings.map((setting: EmailSetting) => (
                <TableRow key={setting.id} data-testid={`row-setting-${setting.settingKey}`}>
                  <TableCell className="font-mono text-sm" data-testid={`text-setting-key-${setting.id}`}>
                    {setting.settingKey}
                  </TableCell>
                  <TableCell data-testid={`text-setting-value-${setting.id}`}>
                    {editingSetting?.id === setting.id ? (
                      <div className="flex items-center gap-2">
                        {setting.settingType === 'boolean' ? (
                          <Switch
                            checked={editValue === 'true'}
                            onCheckedChange={(checked) => setEditValue(checked.toString())}
                            data-testid={`switch-edit-${setting.id}`}
                          />
                        ) : (
                          <Input
                            type={setting.settingType === 'email' ? 'email' : 'text'}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="max-w-xs"
                            data-testid={`input-edit-${setting.id}`}
                          />
                        )}
                      </div>
                    ) : (
                      setting.settingType === 'boolean' ? (
                        <Badge variant={setting.settingValue === 'true' ? "default" : "secondary"}>
                          {setting.settingValue === 'true' ? 'Ingeschakeld' : 'Uitgeschakeld'}
                        </Badge>
                      ) : (
                        <span className="max-w-xs truncate block">
                          {setting.settingValue}
                        </span>
                      )
                    )}
                  </TableCell>
                  <TableCell data-testid={`text-setting-type-${setting.id}`}>
                    <Badge variant="outline">
                      {getSettingTypeDisplay(setting.settingType || 'text')}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-sm truncate" data-testid={`text-setting-description-${setting.id}`}>
                    {setting.description || 'Geen beschrijving'}
                  </TableCell>
                  <TableCell>
                    {editingSetting?.id === setting.id ? (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={saveEdit}
                          disabled={updateMutation.isPending}
                          data-testid={`button-save-${setting.id}`}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={cancelEditing}
                          disabled={updateMutation.isPending}
                          data-testid={`button-cancel-${setting.id}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(setting)}
                        data-testid={`button-edit-setting-${setting.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

interface SettingRowProps {
  setting: EmailSetting;
  isEditing: boolean;
  editValue: string;
  onEdit: (setting: EmailSetting) => void;
  onCancel: () => void;
  onSave: () => void;
  onToggle: (setting: EmailSetting) => void;
  setEditValue: (value: string) => void;
  isLoading: boolean;
}

function SettingRow({
  setting,
  isEditing,
  editValue,
  onEdit,
  onCancel,
  onSave,
  onToggle,
  setEditValue,
  isLoading
}: SettingRowProps) {
  const getSettingLabel = (key: string) => {
    const labels: Record<string, string> = {
      company_name: 'Bedrijfsnaam',
      company_email: 'Bedrijfs email',
      company_phone: 'Telefoonnummer',
      company_address: 'Adres',
      website_url: 'Website URL',
      auto_reply_enabled: 'Automatisch antwoorden',
      admin_email: 'Beheerder email',
      admin_notifications_enabled: 'Beheerder notificaties'
    };
    return labels[key] || key;
  };

  if (setting.settingType === 'boolean') {
    return (
      <div 
        className="flex items-center justify-between p-3 border rounded-lg"
        data-testid={`setting-row-${setting.settingKey}`}
      >
        <div>
          <Label className="font-medium">{getSettingLabel(setting.settingKey)}</Label>
          <p className="text-sm text-muted-foreground">{setting.description}</p>
        </div>
        <Switch
          checked={setting.settingValue === 'true'}
          onCheckedChange={() => onToggle(setting)}
          disabled={isLoading}
          data-testid={`switch-${setting.settingKey}`}
        />
      </div>
    );
  }

  return (
    <div 
      className="p-3 border rounded-lg space-y-2"
      data-testid={`setting-row-${setting.settingKey}`}
    >
      <div className="flex items-center justify-between">
        <Label className="font-medium">{getSettingLabel(setting.settingKey)}</Label>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(setting)}
            data-testid={`button-edit-${setting.settingKey}`}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground">{setting.description}</p>
      
      {isEditing ? (
        <div className="flex items-center gap-2">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-1"
            data-testid={`input-edit-${setting.settingKey}`}
          />
          <Button
            size="sm"
            onClick={onSave}
            disabled={isLoading}
            data-testid={`button-save-${setting.settingKey}`}
          >
            <Save className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onCancel}
            data-testid={`button-cancel-${setting.settingKey}`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div 
          className="p-2 bg-muted rounded text-sm"
          data-testid={`value-${setting.settingKey}`}
        >
          {setting.settingValue}
        </div>
      )}
    </div>
  );
}