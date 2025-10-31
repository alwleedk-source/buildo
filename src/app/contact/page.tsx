'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

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

interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  openingHours?: string;
}

export default function ContactPage() {
  const { language } = useLanguage();
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({});
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Fetch form fields configuration
  useEffect(() => {
    fetch('/api/admin/contact-form-settings')
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          const visibleFields = data.data
            .filter((field: FormField) => field.isVisible)
            .sort((a: FormField, b: FormField) => a.order - b.order);
          setFormFields(visibleFields);
        }
      })
      .catch(err => console.error('Failed to fetch form fields:', err));
  }, []);

  // Fetch contact info
  useEffect(() => {
    fetch('/api/contact-info')
      .then(res => res.json())
      .then(data => {
        if (data.data && data.data.length > 0) {
          setContactInfo(data.data[0]);
        }
      })
      .catch(err => console.error('Failed to fetch contact info:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({});
        // Reset form
        const form = e.target as HTMLFormElement;
        form.reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const renderField = (field: FormField) => {
    const label = language === 'nl' ? field.labelNl : field.labelEn;
    const commonProps = {
      id: field.fieldKey,
      name: field.fieldKey,
      required: field.isRequired,
      placeholder: field.placeholder || '',
      value: formData[field.fieldKey] || '',
      onChange: (e: any) => handleChange(field.fieldKey, e.target.value)
    };

    switch (field.fieldType) {
      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.fieldKey}>
              {label} {field.isRequired && <span className="text-red-500">*</span>}
            </Label>
            <Textarea {...commonProps} rows={5} />
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.fieldKey}>
              {label} {field.isRequired && <span className="text-red-500">*</span>}
            </Label>
            <Select
              value={formData[field.fieldKey] || ''}
              onValueChange={(value) => handleChange(field.fieldKey, value)}
              required={field.isRequired}
            >
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder || `Select ${label}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options && Array.isArray(field.options) && field.options.map((option: any) => (
                  <SelectItem key={option.value || option} value={option.value || option}>
                    {option.label || option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      default:
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.fieldKey}>
              {label} {field.isRequired && <span className="text-red-500">*</span>}
            </Label>
            <Input {...commonProps} type={field.fieldType} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {language === 'nl' ? 'Neem Contact Op' : 'Get in Touch'}
          </h1>
          <p className="text-xl text-gray-100 max-w-2xl">
            {language === 'nl' 
              ? 'Heeft u een vraag of wilt u een offerte aanvragen? Neem gerust contact met ons op.'
              : 'Have a question or want to request a quote? Feel free to contact us.'}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  {language === 'nl' ? 'Contactgegevens' : 'Contact Information'}
                </h2>
                <p className="text-gray-600 mb-8">
                  {language === 'nl'
                    ? 'U kunt ons bereiken via onderstaande contactgegevens of vul het contactformulier in.'
                    : 'You can reach us through the contact details below or fill out the contact form.'}
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.email && (
                  <Card>
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">
                          {language === 'nl' ? 'E-mailadres' : 'Email Address'}
                        </h3>
                        <a href={`mailto:${contactInfo.email}`} className="text-primary hover:underline">
                          {contactInfo.email}
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {contactInfo.phone && (
                  <Card>
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Phone className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">
                          {language === 'nl' ? 'Telefoonnummer' : 'Phone Number'}
                        </h3>
                        <a href={`tel:${contactInfo.phone}`} className="text-primary hover:underline">
                          {contactInfo.phone}
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {(contactInfo.address || contactInfo.city) && (
                  <Card>
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">
                          {language === 'nl' ? 'Adres' : 'Address'}
                        </h3>
                        <p className="text-gray-600">
                          {contactInfo.address && <>{contactInfo.address}<br /></>}
                          {contactInfo.postalCode && contactInfo.city && (
                            <>{contactInfo.postalCode} {contactInfo.city}<br /></>
                          )}
                          {contactInfo.country}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {contactInfo.openingHours && (
                  <Card>
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">
                          {language === 'nl' ? 'Openingstijden' : 'Opening Hours'}
                        </h3>
                        <p className="text-gray-600 whitespace-pre-line">
                          {contactInfo.openingHours}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">
                    {language === 'nl' ? 'Stuur ons een bericht' : 'Send us a message'}
                  </h2>

                  {submitStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                      {language === 'nl'
                        ? 'Bedankt voor uw bericht! We nemen zo spoedig mogelijk contact met u op.'
                        : 'Thank you for your message! We will contact you as soon as possible.'}
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                      {language === 'nl'
                        ? 'Er is een fout opgetreden. Probeer het later opnieuw.'
                        : 'An error occurred. Please try again later.'}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {formFields.length > 0 ? (
                      <>
                        {formFields.map(field => renderField(field))}
                        
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            language === 'nl' ? 'Verzenden...' : 'Sending...'
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              {language === 'nl' ? 'Verstuur Bericht' : 'Send Message'}
                            </>
                          )}
                        </Button>
                      </>
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        {language === 'nl'
                          ? 'Contactformulier wordt geladen...'
                          : 'Loading contact form...'}
                      </p>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
