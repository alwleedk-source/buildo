'use client';

import { useState } from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from '@/lib/queryClient';
import { Lock, User, Building } from "lucide-react";
import { useRouter } from 'next/navigation';

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate auth queries to refresh user state
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      
      toast({
        title: "Succesvol ingelogd",
        description: "Welkom in het admin dashboard",
      });
      
      // Redirect to admin dashboard
      router.push('/admin');
    },
    onError: (error: any) => {
      toast({
        title: "Login mislukt",
        description: error.message || "Ongeldige inloggegevens",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Incomplete gegevens",
        description: "Vul zowel email als wachtwoord in",
        variant: "destructive",
      });
      return;
    }

    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800" data-testid="login-page">
      <div className="w-full max-w-md space-y-6">
        {/* Company Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
            <Building className="w-10 h-10 text-primary-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground" data-testid="company-title">
              BuildIt Professional
            </h1>
            <p className="text-muted-foreground text-lg">
              Admin Dashboard
            </p>
            <p className="text-sm text-muted-foreground">
              Toegang voor geautoriseerde gebruikers
            </p>
          </div>
        </div>

        {/* Login Form */}
        <Card data-testid="login-form-card" className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Inloggen</CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Voer uw gegevens in om toegang te krijgen
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={loginMutation.isPending}
                    data-testid="input-email"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Wachtwoord</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Voer uw wachtwoord in"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={loginMutation.isPending}
                    data-testid="input-password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-200"
                disabled={loginMutation.isPending}
                data-testid="button-login"
              >
                {loginMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Bezig met inloggen...
                  </>
                ) : (
                  "Inloggen"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>


        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2025 Constructor BV. Alle rechten voorbehouden.</p>
        </div>
      </div>
    </div>
  );
}