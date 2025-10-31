'use client';

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Phone, Mail, CreditCard } from "lucide-react";
import { insertCompanyDetailsSchema, CompanyDetails } from '@/lib/db/schema';
import { apiRequest, queryClient } from "@/lib/queryClient";

const formSchema = insertCompanyDetailsSchema;

interface CompanyDetailsFormData {
  companyNameNl: string;
  companyNameEn: string;
  btwNumber?: string;
  kvkNumber?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  iban?: string;
}

export function CompanyDetailsEditor() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch company details from admin API
  const { data: companyDetails, isLoading } = useQuery<CompanyDetails | null>({
    queryKey: ['/api/admin/company-details'],
  });

  const form = useForm<CompanyDetailsFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyNameNl: "",
      companyNameEn: "",
      btwNumber: "",
      kvkNumber: "",
      address: "",
      city: "",
      postalCode: "",
      country: "Netherlands",
      phone: "",
      email: "",
      website: "",
      iban: "",
    },
  });

  // Update form when data is loaded
  useEffect(() => {
    if (companyDetails) {
      form.reset({
        companyNameNl: companyDetails.companyNameNl || "",
        companyNameEn: companyDetails.companyNameEn || "",
        btwNumber: companyDetails.btwNumber || "",
        kvkNumber: companyDetails.kvkNumber || "",
        address: companyDetails.address || "",
        city: companyDetails.city || "",
        postalCode: companyDetails.postalCode || "",
        country: companyDetails.country || "Netherlands",
        phone: companyDetails.phone || "",
        email: companyDetails.email || "",
        website: companyDetails.website || "",
        iban: companyDetails.iban || "",
      });
    }
  }, [companyDetails]);

  // Create or update mutation
  const saveDetailsMutation = useMutation({
    mutationFn: async (data: CompanyDetailsFormData) => {
      if (companyDetails?.id) {
        return await apiRequest(`/api/admin/company-details/${companyDetails.id}`, 'PUT', data);
      } else {
        return await apiRequest('/api/admin/company-details', 'POST', data);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Company details saved successfully!",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/company-details'] });
    },
    onError: (error) => {
      console.error('Company details error:', error);
      toast({
        title: "Error",
        description: "Failed to save company details. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (data: CompanyDetailsFormData) => {
    saveDetailsMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold" data-testid="heading-company-details">Company Details</h2>
          <p className="text-muted-foreground">
            Manage company information, BTW number, KVK number, and contact details
          </p>
        </div>
        {!isEditing && (
          <Button 
            onClick={() => setIsEditing(true)}
            data-testid="button-edit-company-details"
          >
            Edit Details
          </Button>
        )}
      </div>

      {!isEditing && companyDetails ? (
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="legal">Legal Info</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Dutch Name</label>
                    <p className="text-muted-foreground" data-testid="text-company-name-nl">
                      {companyDetails.companyNameNl || "Not set"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">English Name</label>
                    <p className="text-muted-foreground" data-testid="text-company-name-en">
                      {companyDetails.companyNameEn || "Not set"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="legal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Legal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">BTW Number</label>
                    <p className="text-muted-foreground font-mono" data-testid="text-btw-number">
                      {companyDetails.btwNumber || "Not set"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">KVK Number</label>
                    <p className="text-muted-foreground font-mono" data-testid="text-kvk-number">
                      {companyDetails.kvkNumber || "Not set"}
                    </p>
                  </div>
                </div>
                {companyDetails.iban && (
                  <div>
                    <label className="text-sm font-medium">IBAN</label>
                    <p className="text-muted-foreground font-mono" data-testid="text-iban">
                      {companyDetails.iban}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {companyDetails.address ? (
                    <div className="space-y-1">
                      <p data-testid="text-address">{companyDetails.address}</p>
                      <p data-testid="text-city-postal">
                        {companyDetails.postalCode} {companyDetails.city}
                      </p>
                      <p data-testid="text-country">{companyDetails.country}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No address set</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Contact Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {companyDetails.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span data-testid="text-phone">{companyDetails.phone}</span>
                    </div>
                  )}
                  {companyDetails.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span data-testid="text-email">{companyDetails.email}</span>
                    </div>
                  )}
                  {companyDetails.website && (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 text-muted-foreground">🌐</span>
                      <span data-testid="text-website">{companyDetails.website}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList>
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="legal">Legal Info</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Names</CardTitle>
                    <CardDescription>
                      Set both Dutch and English company names for bilingual support
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="companyNameNl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dutch Company Name *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g. Bouwbedrijf Amsterdam BV"
                                {...field} 
                                data-testid="input-company-name-nl"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="companyNameEn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>English Company Name *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g. Amsterdam Construction Company Ltd"
                                {...field} 
                                data-testid="input-company-name-en"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="legal" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Legal Information</CardTitle>
                    <CardDescription>
                      Dutch company registration and tax details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="btwNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>BTW Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g. NL123456789B01"
                                {...field} 
                                data-testid="input-btw-number"
                              />
                            </FormControl>
                            <FormDescription>
                              Dutch VAT identification number
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="kvkNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>KVK Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g. 12345678"
                                {...field} 
                                data-testid="input-kvk-number"
                              />
                            </FormControl>
                            <FormDescription>
                              Chamber of Commerce registration number
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="iban"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IBAN</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. NL91ABNA0417164300"
                              {...field} 
                              data-testid="input-iban"
                            />
                          </FormControl>
                          <FormDescription>
                            Bank account for invoicing (optional)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Address</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Street name and number"
                                {...field} 
                                data-testid="input-address"
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Postal Code</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="1234 AB"
                                  {...field} 
                                  data-testid="input-postal-code"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Amsterdam"
                                  {...field} 
                                  data-testid="input-city"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Netherlands"
                                {...field} 
                                data-testid="input-country"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="+31 20 123 4567"
                                {...field} 
                                data-testid="input-phone"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email"
                                placeholder="info@company.nl"
                                {...field} 
                                data-testid="input-email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://www.company.nl"
                                {...field} 
                                data-testid="input-website"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setIsEditing(false)}
                data-testid="button-cancel-edit"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={saveDetailsMutation.isPending}
                data-testid="button-save-company-details"
              >
                {saveDetailsMutation.isPending ? "Saving..." : "Save Details"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}