'use client';

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import type { InsertContactInquiry, ContactInfo, CompanyDetails, ContactFormSetting } from '@/lib/db/schema';

export function ContactSection() {
  const { toast } = useToast();
  const { i18n } = useTranslation();

  // Fetch contact info, company details, and form settings
  const { data: contactInfo = [] } = useQuery<ContactInfo[]>({
    queryKey: ['/api/contact-info'],
  });

  const { data: companyDetails } = useQuery<CompanyDetails | null>({
    queryKey: ['/api/company-details'],
  });

  const { data: formSettings = [] } = useQuery<ContactFormSetting[]>({
    queryKey: ['/api/contact-form-settings'],
  });

  const [formData, setFormData] = useState<InsertContactInquiry>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    message: ''
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContactInquiry) => {
      return await apiRequest('/api/contact', 'POST', data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your message has been sent successfully. We'll get back to you soon!",
      });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        projectType: '',
        message: ''
      });
    },
    onError: (error) => {
      console.error('Contact form error:', error);
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Dynamic validation based on form settings
    const missingRequiredFields = formSettings
      .filter(setting => setting.isVisible && setting.isRequired)
      .filter(setting => {
        const fieldKey = setting.fieldKey as keyof InsertContactInquiry;
        return !formData[fieldKey] || formData[fieldKey].trim() === '';
      });

    if (missingRequiredFields.length > 0) {
      const currentLang = i18n.language === 'nl' ? 'nl' : 'en';
      const missingFieldNames = missingRequiredFields
        .map(field => currentLang === 'nl' ? field.labelNl : field.labelEn)
        .join(', ');
      
      toast({
        title: currentLang === 'nl' ? "Validatiefout" : "Validation Error",
        description: currentLang === 'nl' 
          ? `Vul de volgende verplichte velden in: ${missingFieldNames}`
          : `Please fill in the following required fields: ${missingFieldNames}`,
        variant: "destructive",
      });
      return;
    }

    contactMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof InsertContactInquiry, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Render form field based on settings
  const renderFormField = (setting: ContactFormSetting) => {
    if (!setting.isVisible) return null;

    const label = i18n.language === 'nl' ? setting.labelNl : setting.labelEn;
    const required = setting.isRequired ?? true;
    const fieldKey = setting.fieldKey as keyof InsertContactInquiry;
    const placeholder = setting.placeholder || '';

    const commonProps = {
      id: fieldKey,
      value: formData[fieldKey] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        handleInputChange(fieldKey, e.target.value),
      required,
      placeholder,
      'data-testid': `input-${fieldKey}`,
    };

    switch (setting.fieldType) {
      case 'select':
        return (
          <div key={fieldKey}>
            <Label htmlFor={fieldKey} className="block text-sm font-medium text-card-foreground mb-2">
              {label} {required && '*'}
            </Label>
            <Select onValueChange={(value) => handleInputChange(fieldKey, value)}>
              <SelectTrigger data-testid={`select-${fieldKey}`}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {setting.options && Array.isArray(setting.options) && (setting.options as string[]).map((option: string) => (
                  <SelectItem key={option} value={option.toLowerCase().replace(/\s+/g, '-')}>
                    {String(option)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'textarea':
        return (
          <div key={fieldKey}>
            <Label htmlFor={fieldKey} className="block text-sm font-medium text-card-foreground mb-2">
              {label} {required && '*'}
            </Label>
            <Textarea
              {...commonProps}
              rows={4}
              data-testid={`textarea-${fieldKey}`}
            />
          </div>
        );

      default: // text, email, tel
        return (
          <div key={fieldKey}>
            <Label htmlFor={fieldKey} className="block text-sm font-medium text-card-foreground mb-2">
              {label} {required && '*'}
            </Label>
            <Input
              {...commonProps}
              type={setting.fieldType || 'text'}
            />
          </div>
        );
    }
  };

  // Helper functions for contact info
  const getContactInfoByType = (type: string) => {
    return contactInfo.find(info => info.type === type && info.isActive);
  };

  const getIconByType = (type: string) => {
    switch (type) {
      case 'phone': return <Phone className="w-6 h-6 text-primary-foreground" />;
      case 'email': return <Mail className="w-6 h-6 text-secondary-foreground" />;
      case 'address': return <MapPin className="w-6 h-6 text-accent-foreground" />;
      case 'hours': return <Clock className="w-6 h-6 text-muted-foreground" />;
      default: return <Phone className="w-6 h-6 text-primary-foreground" />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'phone': return 'bg-primary';
      case 'email': return 'bg-secondary';
      case 'address': return 'bg-accent';
      case 'hours': return 'bg-muted';
      default: return 'bg-primary';
    }
  };

  return (
    <section id="contact" className="py-20" data-testid="contact-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-contact-title">
            {i18n.language === 'nl' ? 'Neem contact op' : 'Get In Touch'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-contact-subtitle">
            {i18n.language === 'nl' 
              ? 'Klaar om uw volgende bouwproject te starten? Neem vandaag nog contact met ons op voor een adviesgesprek.' 
              : 'Ready to start your next construction project? Contact us today for a consultation.'
            }
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-lg border border-border" data-testid="contact-form-card">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                {/* Dynamic form fields based on admin settings */}
                {formSettings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {i18n.language === 'nl' ? 'Formulierinstellingen worden geladen...' : 'Loading form settings...'}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Group fields by order and render dynamically */}
                    {formSettings
                      .filter(setting => setting.isVisible)
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .reduce((acc, setting, index, array) => {
                        // Create groups for layout - pair up fields if they're both simple inputs
                        const currentField = renderFormField(setting);
                        const isSimpleField = setting.fieldType === 'text' || setting.fieldType === 'email' || setting.fieldType === 'tel';
                        
                        if (isSimpleField && index < array.length - 1) {
                          const nextSetting = array[index + 1];
                          const nextIsSimple = nextSetting && nextSetting.isVisible && 
                            (nextSetting.fieldType === 'text' || nextSetting.fieldType === 'email' || nextSetting.fieldType === 'tel');
                          
                          if (nextIsSimple && acc.skipNext !== true) {
                            const nextField = renderFormField(nextSetting);
                            acc.skipNext = true;
                            acc.elements.push(
                              <div key={`group-${setting.fieldKey}-${nextSetting.fieldKey}`} className="grid md:grid-cols-2 gap-4">
                                {currentField}
                                {nextField}
                              </div>
                            );
                            return acc;
                          }
                        }
                        
                        if (acc.skipNext) {
                          acc.skipNext = false;
                          return acc;
                        }
                        
                        acc.elements.push(currentField);
                        return acc;
                      }, { elements: [] as React.ReactNode[], skipNext: false }).elements
                    }
                  </>
                )}
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                  disabled={contactMutation.isPending}
                  data-testid="button-submit-contact"
                >
                  {contactMutation.isPending 
                    ? (i18n.language === 'nl' ? 'Verzenden...' : 'Sending...') 
                    : (i18n.language === 'nl' ? 'Offerte aanvragen' : 'Request Quote')
                  }
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="shadow-lg border border-border" data-testid="contact-info-card">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-card-foreground mb-6" data-testid="text-contact-info-title">
                  {i18n.language === 'nl' ? 'Contactinformatie' : 'Contact Information'}
                </h3>
                <div className="space-y-6">
                  {/* Dynamic Contact Info */}
                  {contactInfo
                    .filter(info => info.isActive && info.type !== 'hours')
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((info) => (
                    <div key={info.id} className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${getBackgroundColor(info.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        {getIconByType(info.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-card-foreground" data-testid={`text-${info.type}-label`}>
                          {i18n.language === 'nl' ? info.labelNl : info.labelEn}
                        </h4>
                        <p className="text-muted-foreground whitespace-pre-line" data-testid={`text-${info.type}-value`}>
                          {info.value}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Fallback Contact Info if no dynamic data */}
                  {contactInfo.length === 0 && (
                    <>
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                          <Phone className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-card-foreground" data-testid="text-phone-label">Phone</h4>
                          <p className="text-muted-foreground" data-testid="text-phone-number">
                            {companyDetails?.phone || "+31 20 123 4567"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-6 h-6 text-secondary-foreground" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-card-foreground" data-testid="text-email-label">Email</h4>
                          <p className="text-muted-foreground" data-testid="text-email-address">
                            {companyDetails?.email || "info@buildit-professional.com"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-6 h-6 text-accent-foreground" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-card-foreground" data-testid="text-address-label">Address</h4>
                          <p className="text-muted-foreground" data-testid="text-address-street">
                            {companyDetails?.address ? (
                              <>
                                {companyDetails.address}
                                {companyDetails.city && <><br />{companyDetails.city}</>}
                                {companyDetails.postalCode && <><br />{companyDetails.postalCode}</>}
                                {companyDetails.country && <><br />{companyDetails.country}</>}
                              </>
                            ) : (
                              <>
                                Bouwmeesterstraat 123, 1017 AD Amsterdam,<br />
                                Netherlands
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="shadow-lg border border-border" data-testid="business-hours-card">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-card-foreground mb-6" data-testid="text-hours-title">
                  Business Hours
                </h3>
                <div className="space-y-3">
                  {(() => {
                    const hoursInfo = getContactInfoByType('hours');
                    if (hoursInfo) {
                      return (
                        <div className="whitespace-pre-line text-muted-foreground" data-testid="text-dynamic-hours">
                          {hoursInfo.value}
                        </div>
                      );
                    } else {
                      return (
                        <>
                          <div className="flex justify-between">
                            <span className="text-card-foreground font-medium" data-testid="text-hours-weekdays">Monday - Friday:</span>
                            <span className="text-muted-foreground" data-testid="text-hours-weekdays-time">08:00 - 17:00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-card-foreground font-medium" data-testid="text-hours-saturday">Saturday:</span>
                            <span className="text-muted-foreground" data-testid="text-hours-saturday-time">09:00 - 13:00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-card-foreground font-medium" data-testid="text-hours-sunday">Sunday:</span>
                            <span className="text-muted-foreground" data-testid="text-hours-sunday-time">Closed</span>
                          </div>
                        </>
                      );
                    }
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
