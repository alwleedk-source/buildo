'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { 
  Plus, 
  Save, 
  X, 
  Edit, 
  Trash2, 
  User, 
  Users, 
  Mail, 
  Phone, 
  Linkedin, 
  Twitter,
  Settings,
  Calendar,
  Award,
  Building,
  Image as ImageIcon
} from 'lucide-react';
import type { TeamMember, TeamSettings, InsertTeamMember, InsertTeamSettings } from '@/lib/db/schema';
import { ImageUploadField } from './image-upload-field';

interface TeamMemberFormData {
  nameNl: string;
  nameEn: string;
  titleNl: string;
  titleEn: string;
  bioNl: string;
  bioEn: string;
  department: string;
  email: string;
  phone: string;
  image: string;
  linkedinUrl: string;
  twitterUrl: string;
  startDate: string;
  experienceYears: number | null;
  specialties: string[];
  showContactInfo: boolean;
}

interface TeamSettingsFormData {
  pageTitleNl: string;
  pageTitleEn: string;
  pageDescriptionNl: string;
  pageDescriptionEn: string;
  metaTitleNl: string;
  metaTitleEn: string;
  metaDescriptionNl: string;
  metaDescriptionEn: string;
  ctaTitleNl: string;
  ctaTitleEn: string;
  ctaDescriptionNl: string;
  ctaDescriptionEn: string;
  ctaButtonTextNl: string;
  ctaButtonTextEn: string;
  ctaButtonUrlNl: string;
  ctaButtonUrlEn: string;
  pageShowBios: boolean;
  pageShowDepartments: boolean;
  pageShowExperience: boolean;
  pageShowSkills: boolean;
  pageShowSocial: boolean;
  pageItemsPerRow: number;
  enableSearch: boolean;
  enableDepartmentFilter: boolean;
  imageShape: string;
}

export function TeamEditor() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('members');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<'nl' | 'en'>('nl');
  const [newSpecialtyInput, setNewSpecialtyInput] = useState('');
  
  const [memberFormData, setMemberFormData] = useState<TeamMemberFormData>({
    nameNl: '',
    nameEn: '',
    titleNl: '',
    titleEn: '',
    bioNl: '',
    bioEn: '',
    department: '',
    email: '',
    phone: '',
    image: '',
    linkedinUrl: '',
    twitterUrl: '',
    startDate: '',
    experienceYears: null,
    specialties: [],
    showContactInfo: false
  });

  const [settingsFormData, setSettingsFormData] = useState<TeamSettingsFormData>({
    pageTitleNl: '',
    pageTitleEn: '',
    pageDescriptionNl: '',
    pageDescriptionEn: '',
    metaTitleNl: '',
    metaTitleEn: '',
    metaDescriptionNl: '',
    metaDescriptionEn: '',
    ctaTitleNl: '',
    ctaTitleEn: '',
    ctaDescriptionNl: '',
    ctaDescriptionEn: '',
    ctaButtonTextNl: '',
    ctaButtonTextEn: '',
    ctaButtonUrlNl: '',
    ctaButtonUrlEn: '',
    pageShowBios: true,
    pageShowDepartments: true,
    pageShowExperience: true,
    pageShowSkills: true,
    pageShowSocial: true,
    pageItemsPerRow: 3,
    enableSearch: true,
    enableDepartmentFilter: true,
    imageShape: 'rounded-full'
  });

  // Fetch team members
  const { data: teamMembers = [], isLoading: membersLoading } = useQuery<TeamMember[]>({
    queryKey: ['/api/admin/team'],
  });

  // Fetch team settings
  const { data: teamSettings, isLoading: settingsLoading } = useQuery<TeamSettings>({
    queryKey: ['/api/admin/team-settings'],
  });

  // Initialize settings form when data loads
  useEffect(() => {
    if (teamSettings) {
      setSettingsFormData({
        pageTitleNl: teamSettings.pageTitleNl || '',
        pageTitleEn: teamSettings.pageTitleEn || '',
        pageDescriptionNl: teamSettings.pageDescriptionNl || '',
        pageDescriptionEn: teamSettings.pageDescriptionEn || '',
        metaTitleNl: teamSettings.metaTitleNl || '',
        metaTitleEn: teamSettings.metaTitleEn || '',
        metaDescriptionNl: teamSettings.metaDescriptionNl || '',
        metaDescriptionEn: teamSettings.metaDescriptionEn || '',
        ctaTitleNl: teamSettings.ctaTitleNl || '',
        ctaTitleEn: teamSettings.ctaTitleEn || '',
        ctaDescriptionNl: teamSettings.ctaDescriptionNl || '',
        ctaDescriptionEn: teamSettings.ctaDescriptionEn || '',
        ctaButtonTextNl: teamSettings.ctaButtonTextNl || '',
        ctaButtonTextEn: teamSettings.ctaButtonTextEn || '',
        ctaButtonUrlNl: teamSettings.ctaButtonUrlNl || '',
        ctaButtonUrlEn: teamSettings.ctaButtonUrlEn || '',
        pageShowBios: teamSettings.pageShowBios ?? true,
        pageShowDepartments: teamSettings.pageShowDepartments ?? true,
        pageShowExperience: teamSettings.pageShowExperience ?? true,
        pageShowSkills: teamSettings.pageShowSkills ?? true,
        pageShowSocial: teamSettings.pageShowSocial ?? true,
        pageItemsPerRow: teamSettings.pageItemsPerRow || 3,
        enableSearch: teamSettings.enableSearch ?? true,
        enableDepartmentFilter: teamSettings.enableDepartmentFilter ?? true,
        imageShape: teamSettings.imageShape || 'rounded-full'
      });
    }
  }, [teamSettings]);

  // Create team member mutation
  const createMemberMutation = useMutation({
    mutationFn: async (data: InsertTeamMember) => {
      return apiRequest('/api/admin/team', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/team'] });
      queryClient.invalidateQueries({ queryKey: ['/api/team'] });
      toast({ title: 'Succes', description: 'Teamlid toegevoegd' });
      resetMemberForm();
    },
    onError: (error) => {
      toast({ title: 'Fout', description: 'Kon teamlid niet toevoegen', variant: 'destructive' });
      console.error('Error creating team member:', error);
    }
  });

  // Update team member mutation
  const updateMemberMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertTeamMember> }) => {
      return apiRequest(`/api/admin/team/${id}`, 'PATCH', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/team'] });
      queryClient.invalidateQueries({ queryKey: ['/api/team'] });
      toast({ title: 'Succes', description: 'Teamlid bijgewerkt' });
      resetMemberForm();
    },
    onError: (error) => {
      toast({ title: 'Fout', description: 'Kon teamlid niet bijwerken', variant: 'destructive' });
      console.error('Error updating team member:', error);
    }
  });

  // Delete team member mutation
  const deleteMemberMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/admin/team/${id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/team'] });
      queryClient.invalidateQueries({ queryKey: ['/api/team'] });
      toast({ title: 'Succes', description: 'Teamlid verwijderd' });
    },
    onError: (error) => {
      toast({ title: 'Fout', description: 'Kon teamlid niet verwijderen', variant: 'destructive' });
      console.error('Error deleting team member:', error);
    }
  });

  // Update team settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: InsertTeamSettings) => {
      return apiRequest('/api/admin/team-settings', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/team-settings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/team-settings'] });
      toast({ title: 'Succes', description: 'Team instellingen opgeslagen' });
    },
    onError: (error) => {
      toast({ title: 'Fout', description: 'Kon instellingen niet opslaan', variant: 'destructive' });
      console.error('Error updating team settings:', error);
    }
  });

  const resetMemberForm = () => {
    setMemberFormData({
      nameNl: '',
      nameEn: '',
      titleNl: '',
      titleEn: '',
      bioNl: '',
      bioEn: '',
      department: '',
      email: '',
      phone: '',
      image: '',
      linkedinUrl: '',
      twitterUrl: '',
      startDate: '',
      experienceYears: null,
      specialties: [],
      showContactInfo: false
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const startEdit = (member: TeamMember) => {
    setMemberFormData({
      nameNl: member.nameNl,
      nameEn: member.nameEn || '',
      titleNl: member.titleNl,
      titleEn: member.titleEn || '',
      bioNl: member.bioNl || '',
      bioEn: member.bioEn || '',
      department: member.department || '',
      email: member.email || '',
      phone: member.phone || '',
      image: member.image || '',
      linkedinUrl: member.linkedinUrl ?? '',
      twitterUrl: member.twitterUrl ?? '',
      startDate: member.startDate || '',
      experienceYears: member.experienceYears,
      specialties: member.specialties || [],
      showContactInfo: member.showContactInfo ?? false
    });
    setEditingId(member.id);
    setIsCreating(true);
  };

  const handleMemberSubmit = () => {
    const submitData: InsertTeamMember = {
      nameNl: memberFormData.nameNl,
      nameEn: memberFormData.nameEn || memberFormData.nameNl, // Use Dutch name as fallback
      titleNl: memberFormData.titleNl,
      titleEn: memberFormData.titleEn || memberFormData.titleNl, // Use Dutch title as fallback
      bioNl: memberFormData.bioNl || null,
      bioEn: memberFormData.bioEn || null,
      department: memberFormData.department || null,
      email: (memberFormData.email?.trim() || '') ? memberFormData.email.trim() : null,
      phone: (memberFormData.phone?.trim() || '') ? memberFormData.phone.trim() : null,
      image: memberFormData.image || null,
      linkedinUrl: memberFormData.linkedinUrl || null,
      twitterUrl: memberFormData.twitterUrl || null,
      startDate: memberFormData.startDate || null,
      experienceYears: memberFormData.experienceYears,
      specialties: memberFormData.specialties,
      showContactInfo: memberFormData.showContactInfo
    };

    if (editingId) {
      updateMemberMutation.mutate({ id: editingId, data: submitData });
    } else {
      createMemberMutation.mutate(submitData);
    }
  };

  const handleSettingsSubmit = () => {
    const submitData: InsertTeamSettings = {
      pageTitleNl: settingsFormData.pageTitleNl || null,
      pageTitleEn: settingsFormData.pageTitleEn || null,
      pageDescriptionNl: settingsFormData.pageDescriptionNl || null,
      pageDescriptionEn: settingsFormData.pageDescriptionEn || null,
      metaTitleNl: settingsFormData.metaTitleNl || null,
      metaTitleEn: settingsFormData.metaTitleEn || null,
      metaDescriptionNl: settingsFormData.metaDescriptionNl || null,
      metaDescriptionEn: settingsFormData.metaDescriptionEn || null,
      ctaTitleNl: settingsFormData.ctaTitleNl || null,
      ctaTitleEn: settingsFormData.ctaTitleEn || null,
      ctaDescriptionNl: settingsFormData.ctaDescriptionNl || null,
      ctaDescriptionEn: settingsFormData.ctaDescriptionEn || null,
      ctaButtonTextNl: settingsFormData.ctaButtonTextNl || null,
      ctaButtonTextEn: settingsFormData.ctaButtonTextEn || null,
      ctaButtonUrlNl: settingsFormData.ctaButtonUrlNl || null,
      ctaButtonUrlEn: settingsFormData.ctaButtonUrlEn || null,
      pageShowBios: settingsFormData.pageShowBios,
      pageShowDepartments: settingsFormData.pageShowDepartments,
      pageShowExperience: settingsFormData.pageShowExperience,
      pageShowSkills: settingsFormData.pageShowSkills,
      pageShowSocial: settingsFormData.pageShowSocial,
      pageItemsPerRow: settingsFormData.pageItemsPerRow,
      enableSearch: settingsFormData.enableSearch,
      enableDepartmentFilter: settingsFormData.enableDepartmentFilter,
      imageShape: settingsFormData.imageShape
    };

    updateSettingsMutation.mutate(submitData);
  };

  const addSpecialty = () => {
    if (newSpecialtyInput.trim() && !memberFormData.specialties.includes(newSpecialtyInput.trim())) {
      setMemberFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialtyInput.trim()]
      }));
      setNewSpecialtyInput('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setMemberFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const renderMemberCard = (member: TeamMember) => (
    <Card key={member.id} className="relative" data-testid={`team-member-card-${member.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {member.image ? (
            <img
              src={member.image}
              alt={member.nameNl}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg" data-testid={`member-name-${member.id}`}>
              {member.nameNl}
            </h3>
            <p className="text-primary font-medium" data-testid={`member-title-${member.id}`}>
              {member.titleNl}
            </p>
            {member.department && (
              <Badge variant="secondary" className="mt-1">
                {member.department}
              </Badge>
            )}
            
            <div className="flex gap-2 mt-3">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => startEdit(member)}
                data-testid={`edit-member-${member.id}`}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => deleteMemberMutation.mutate(member.id)}
                data-testid={`delete-member-${member.id}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="members" data-testid="tab-members">
            <Users className="w-4 h-4 mr-2" />
            Teamleden
          </TabsTrigger>
          <TabsTrigger value="settings" data-testid="tab-settings">
            <Settings className="w-4 h-4 mr-2" />
            Pagina Instellingen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-6">
          {/* Add/Edit Team Member Form */}
          {isCreating && (
            <Card data-testid="member-form">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {editingId ? 'Teamlid Bewerken' : 'Nieuw Teamlid Toevoegen'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeLanguage} onValueChange={(v) => setActiveLanguage(v as 'nl' | 'en')}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="nl">Nederlands</TabsTrigger>
                    <TabsTrigger value="en">English</TabsTrigger>
                  </TabsList>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`name-${activeLanguage}`}>
                          Naam {activeLanguage === 'en' && '(English)'}
                        </Label>
                        <Input
                          id={`name-${activeLanguage}`}
                          value={activeLanguage === 'nl' ? memberFormData.nameNl : memberFormData.nameEn}
                          onChange={(e) => setMemberFormData(prev => ({
                            ...prev,
                            [activeLanguage === 'nl' ? 'nameNl' : 'nameEn']: e.target.value
                          }))}
                          placeholder="Volledige naam"
                          data-testid={`input-name-${activeLanguage}`}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`title-${activeLanguage}`}>
                          Functie {activeLanguage === 'en' && '(English)'}
                        </Label>
                        <Input
                          id={`title-${activeLanguage}`}
                          value={activeLanguage === 'nl' ? memberFormData.titleNl : memberFormData.titleEn}
                          onChange={(e) => setMemberFormData(prev => ({
                            ...prev,
                            [activeLanguage === 'nl' ? 'titleNl' : 'titleEn']: e.target.value
                          }))}
                          placeholder="Functietitel"
                          data-testid={`input-title-${activeLanguage}`}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`bio-${activeLanguage}`}>
                          Bio {activeLanguage === 'en' && '(English)'}
                        </Label>
                        <Textarea
                          id={`bio-${activeLanguage}`}
                          value={activeLanguage === 'nl' ? memberFormData.bioNl : memberFormData.bioEn}
                          onChange={(e) => setMemberFormData(prev => ({
                            ...prev,
                            [activeLanguage === 'nl' ? 'bioNl' : 'bioEn']: e.target.value
                          }))}
                          placeholder="Korte beschrijving..."
                          rows={3}
                          data-testid={`textarea-bio-${activeLanguage}`}
                        />
                      </div>

                      <div>
                        <Label htmlFor="department">Afdeling</Label>
                        <Input
                          id="department"
                          value={memberFormData.department}
                          onChange={(e) => setMemberFormData(prev => ({ ...prev, department: e.target.value }))}
                          placeholder="Afdeling/Team"
                          data-testid="input-department"
                        />
                      </div>
                    </div>

                    {/* Contact & Additional Info */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={memberFormData.email}
                          onChange={(e) => setMemberFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="email@example.com"
                          data-testid="input-email"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Telefoon</Label>
                        <Input
                          id="phone"
                          value={memberFormData.phone}
                          onChange={(e) => setMemberFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+31 6 12345678"
                          data-testid="input-phone"
                        />
                      </div>

                      <div>
                        <Label htmlFor="start-date">Start Datum</Label>
                        <Input
                          id="start-date"
                          value={memberFormData.startDate}
                          onChange={(e) => setMemberFormData(prev => ({ ...prev, startDate: e.target.value }))}
                          placeholder="Januari 2020"
                          data-testid="input-start-date"
                        />
                      </div>

                      <div>
                        <Label htmlFor="experience">Jaren Ervaring</Label>
                        <Input
                          id="experience"
                          type="number"
                          value={memberFormData.experienceYears || ''}
                          onChange={(e) => setMemberFormData(prev => ({ 
                            ...prev, 
                            experienceYears: e.target.value ? parseInt(e.target.value) : null 
                          }))}
                          placeholder="5"
                          data-testid="input-experience"
                        />
                      </div>

                      <div>
                        <Label htmlFor="linkedin">LinkedIn URL</Label>
                        <Input
                          id="linkedin"
                          value={memberFormData.linkedinUrl}
                          onChange={(e) => setMemberFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                          placeholder="https://linkedin.com/in/username"
                          data-testid="input-linkedin"
                        />
                      </div>

                      <div>
                        <Label htmlFor="twitter">Twitter URL</Label>
                        <Input
                          id="twitter"
                          value={memberFormData.twitterUrl}
                          onChange={(e) => setMemberFormData(prev => ({ ...prev, twitterUrl: e.target.value }))}
                          placeholder="https://twitter.com/username"
                          data-testid="input-twitter"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="mt-6">
                    <Label>Profielfoto</Label>
                    <ImageUploadField
                      label="Upload foto"
                      value={memberFormData.image}
                      onChange={(url) => setMemberFormData(prev => ({ ...prev, image: url }))}
                      accept="image/*"
                      data-testid="upload-profile-image"
                    />
                  </div>

                  {/* Specialties */}
                  <div className="mt-6">
                    <Label>Specialiteiten</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newSpecialtyInput}
                        onChange={(e) => setNewSpecialtyInput(e.target.value)}
                        placeholder="Voeg specialiteit toe..."
                        onKeyPress={(e) => e.key === 'Enter' && addSpecialty()}
                        data-testid="input-specialty"
                      />
                      <Button onClick={addSpecialty} size="sm" data-testid="button-add-specialty">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {memberFormData.specialties.map((specialty, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="flex items-center gap-1"
                          data-testid={`specialty-badge-${index}`}
                        >
                          {specialty}
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => removeSpecialty(specialty)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info Toggle */}
                  <div className="mt-6 flex items-center space-x-2">
                    <Switch
                      id="show-contact"
                      checked={memberFormData.showContactInfo}
                      onCheckedChange={(checked) => setMemberFormData(prev => ({ 
                        ...prev, 
                        showContactInfo: checked 
                      }))}
                      data-testid="switch-show-contact"
                    />
                    <Label htmlFor="show-contact">Contact informatie tonen</Label>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex gap-2">
                    <Button 
                      onClick={handleMemberSubmit}
                      disabled={createMemberMutation.isPending || updateMemberMutation.isPending}
                      data-testid="button-save-member"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingId ? 'Bijwerken' : 'Toevoegen'}
                    </Button>
                    <Button variant="outline" onClick={resetMemberForm} data-testid="button-cancel-member">
                      <X className="w-4 h-4 mr-2" />
                      Annuleren
                    </Button>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Team Members List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Teamleden ({teamMembers.length})
                </CardTitle>
                <Button 
                  onClick={() => setIsCreating(true)}
                  disabled={isCreating}
                  data-testid="button-add-member"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nieuw Teamlid
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {membersLoading ? (
                <div>Laden...</div>
              ) : teamMembers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nog geen teamleden toegevoegd</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teamMembers.map(renderMemberCard)}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Team Pagina Instellingen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeLanguage} onValueChange={(v) => setActiveLanguage(v as 'nl' | 'en')}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="nl">Nederlands</TabsTrigger>
                  <TabsTrigger value="en">English</TabsTrigger>
                </TabsList>

                <div className="space-y-6">
                  {/* Page Content */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`page-title-${activeLanguage}`}>
                          Pagina Titel {activeLanguage === 'en' && '(English)'}
                        </Label>
                        <Input
                          id={`page-title-${activeLanguage}`}
                          value={activeLanguage === 'nl' ? settingsFormData.pageTitleNl : settingsFormData.pageTitleEn}
                          onChange={(e) => setSettingsFormData(prev => ({
                            ...prev,
                            [activeLanguage === 'nl' ? 'pageTitleNl' : 'pageTitleEn']: e.target.value
                          }))}
                          placeholder="Ons Professionele Team"
                          data-testid={`input-page-title-${activeLanguage}`}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`page-description-${activeLanguage}`}>
                          Pagina Beschrijving {activeLanguage === 'en' && '(English)'}
                        </Label>
                        <Textarea
                          id={`page-description-${activeLanguage}`}
                          value={activeLanguage === 'nl' ? settingsFormData.pageDescriptionNl : settingsFormData.pageDescriptionEn}
                          onChange={(e) => setSettingsFormData(prev => ({
                            ...prev,
                            [activeLanguage === 'nl' ? 'pageDescriptionNl' : 'pageDescriptionEn']: e.target.value
                          }))}
                          placeholder="Maak kennis met ons getalenteerde team..."
                          rows={3}
                          data-testid={`textarea-page-description-${activeLanguage}`}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`meta-title-${activeLanguage}`}>
                          SEO Titel {activeLanguage === 'en' && '(English)'}
                        </Label>
                        <Input
                          id={`meta-title-${activeLanguage}`}
                          value={activeLanguage === 'nl' ? settingsFormData.metaTitleNl : settingsFormData.metaTitleEn}
                          onChange={(e) => setSettingsFormData(prev => ({
                            ...prev,
                            [activeLanguage === 'nl' ? 'metaTitleNl' : 'metaTitleEn']: e.target.value
                          }))}
                          placeholder="Team | BuildIt Professional"
                          data-testid={`input-meta-title-${activeLanguage}`}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`meta-description-${activeLanguage}`}>
                          SEO Beschrijving {activeLanguage === 'en' && '(English)'}
                        </Label>
                        <Textarea
                          id={`meta-description-${activeLanguage}`}
                          value={activeLanguage === 'nl' ? settingsFormData.metaDescriptionNl : settingsFormData.metaDescriptionEn}
                          onChange={(e) => setSettingsFormData(prev => ({
                            ...prev,
                            [activeLanguage === 'nl' ? 'metaDescriptionNl' : 'metaDescriptionEn']: e.target.value
                          }))}
                          placeholder="Ontmoet ons professionele bouwteam..."
                          rows={2}
                          data-testid={`textarea-meta-description-${activeLanguage}`}
                        />
                      </div>
                    </div>

                    {/* CTA Section */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`cta-title-${activeLanguage}`}>
                          CTA Titel {activeLanguage === 'en' && '(English)'}
                        </Label>
                        <Input
                          id={`cta-title-${activeLanguage}`}
                          value={activeLanguage === 'nl' ? settingsFormData.ctaTitleNl : settingsFormData.ctaTitleEn}
                          onChange={(e) => setSettingsFormData(prev => ({
                            ...prev,
                            [activeLanguage === 'nl' ? 'ctaTitleNl' : 'ctaTitleEn']: e.target.value
                          }))}
                          placeholder="Wil je bij ons team?"
                          data-testid={`input-cta-title-${activeLanguage}`}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`cta-description-${activeLanguage}`}>
                          CTA Beschrijving {activeLanguage === 'en' && '(English)'}
                        </Label>
                        <Textarea
                          id={`cta-description-${activeLanguage}`}
                          value={activeLanguage === 'nl' ? settingsFormData.ctaDescriptionNl : settingsFormData.ctaDescriptionEn}
                          onChange={(e) => setSettingsFormData(prev => ({
                            ...prev,
                            [activeLanguage === 'nl' ? 'ctaDescriptionNl' : 'ctaDescriptionEn']: e.target.value
                          }))}
                          placeholder="We zijn altijd op zoek naar getalenteerde professionals..."
                          rows={3}
                          data-testid={`textarea-cta-description-${activeLanguage}`}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`cta-button-text-${activeLanguage}`}>
                          CTA Knop Tekst {activeLanguage === 'en' && '(English)'}
                        </Label>
                        <Input
                          id={`cta-button-text-${activeLanguage}`}
                          value={activeLanguage === 'nl' ? settingsFormData.ctaButtonTextNl : settingsFormData.ctaButtonTextEn}
                          onChange={(e) => setSettingsFormData(prev => ({
                            ...prev,
                            [activeLanguage === 'nl' ? 'ctaButtonTextNl' : 'ctaButtonTextEn']: e.target.value
                          }))}
                          placeholder="Bekijk Vacatures"
                          data-testid={`input-cta-button-text-${activeLanguage}`}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`cta-button-url-${activeLanguage}`}>
                          CTA Knop URL {activeLanguage === 'en' && '(English)'}
                        </Label>
                        <Input
                          id={`cta-button-url-${activeLanguage}`}
                          value={activeLanguage === 'nl' ? settingsFormData.ctaButtonUrlNl : settingsFormData.ctaButtonUrlEn}
                          onChange={(e) => setSettingsFormData(prev => ({
                            ...prev,
                            [activeLanguage === 'nl' ? 'ctaButtonUrlNl' : 'ctaButtonUrlEn']: e.target.value
                          }))}
                          placeholder="/contact"
                          data-testid={`input-cta-button-url-${activeLanguage}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Display Options */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Weergave Opties</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="show-bios"
                          checked={settingsFormData.pageShowBios}
                          onCheckedChange={(checked) => setSettingsFormData(prev => ({ 
                            ...prev, 
                            pageShowBios: checked 
                          }))}
                          data-testid="switch-show-bios"
                        />
                        <Label htmlFor="show-bios">Bio's tonen</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="show-departments"
                          checked={settingsFormData.pageShowDepartments}
                          onCheckedChange={(checked) => setSettingsFormData(prev => ({ 
                            ...prev, 
                            pageShowDepartments: checked 
                          }))}
                          data-testid="switch-show-departments"
                        />
                        <Label htmlFor="show-departments">Afdelingen tonen</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="show-experience"
                          checked={settingsFormData.pageShowExperience}
                          onCheckedChange={(checked) => setSettingsFormData(prev => ({ 
                            ...prev, 
                            pageShowExperience: checked 
                          }))}
                          data-testid="switch-show-experience"
                        />
                        <Label htmlFor="show-experience">Ervaring tonen</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="show-skills"
                          checked={settingsFormData.pageShowSkills}
                          onCheckedChange={(checked) => setSettingsFormData(prev => ({ 
                            ...prev, 
                            pageShowSkills: checked 
                          }))}
                          data-testid="switch-show-skills"
                        />
                        <Label htmlFor="show-skills">Vaardigheden tonen</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="show-social"
                          checked={settingsFormData.pageShowSocial}
                          onCheckedChange={(checked) => setSettingsFormData(prev => ({ 
                            ...prev, 
                            pageShowSocial: checked 
                          }))}
                          data-testid="switch-show-social"
                        />
                        <Label htmlFor="show-social">Social media tonen</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="enable-search"
                          checked={settingsFormData.enableSearch}
                          onCheckedChange={(checked) => setSettingsFormData(prev => ({ 
                            ...prev, 
                            enableSearch: checked 
                          }))}
                          data-testid="switch-enable-search"
                        />
                        <Label htmlFor="enable-search">Zoeken inschakelen</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="enable-department-filter"
                          checked={settingsFormData.enableDepartmentFilter}
                          onCheckedChange={(checked) => setSettingsFormData(prev => ({ 
                            ...prev, 
                            enableDepartmentFilter: checked 
                          }))}
                          data-testid="switch-enable-department-filter"
                        />
                        <Label htmlFor="enable-department-filter">Afdelingsfilter inschakelen</Label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="items-per-row">Items per rij</Label>
                        <Select 
                          value={settingsFormData.pageItemsPerRow.toString()} 
                          onValueChange={(value) => setSettingsFormData(prev => ({ 
                            ...prev, 
                            pageItemsPerRow: parseInt(value) 
                          }))}
                        >
                          <SelectTrigger className="w-48" data-testid="select-items-per-row">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2">2 items</SelectItem>
                            <SelectItem value="3">3 items</SelectItem>
                            <SelectItem value="4">4 items</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="image-shape">Vorm van profielfoto's</Label>
                        <Select 
                          value={settingsFormData.imageShape} 
                          onValueChange={(value) => setSettingsFormData(prev => ({ 
                            ...prev, 
                            imageShape: value 
                          }))}
                        >
                          <SelectTrigger className="w-48" data-testid="select-image-shape">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rounded-full">Rond (cirkel)</SelectItem>
                            <SelectItem value="rounded-lg">Afgerond vierkant</SelectItem>
                            <SelectItem value="rounded-md">Licht afgerond</SelectItem>
                            <SelectItem value="rounded-none">Vierkant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="border-t pt-6">
                    <Button 
                      onClick={handleSettingsSubmit}
                      disabled={updateSettingsMutation.isPending}
                      className="w-full md:w-auto"
                      data-testid="button-save-settings"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Instellingen Opslaan
                    </Button>
                  </div>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}