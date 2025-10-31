'use client';

import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "./admin-sidebar";
import { ArrowLeft, LogOut, User } from "lucide-react";
import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function AdminLayout({ children, title = "Dashboard", description }: AdminLayoutProps) {
  const { toast } = useToast();
  // TODO: Re-enable authentication
  const isAuthenticated = true;
  const isLoading = false;
  const user = { email: 'admin@test.com' };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="min-h-screen bg-muted/30" data-testid="admin-layout">
      {/* Top Header */}
      <div className="bg-background border-b sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <Link href="/" data-testid="link-back-home">
              <Button variant="outline" size="sm" data-testid="button-back-home">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug naar Website
              </Button>
            </Link>
            <div className="h-6 w-px bg-border"></div>
            <div>
              <h1 className="text-xl font-semibold text-foreground" data-testid="header-title">
                {title}
              </h1>
              {description && (
                <p className="text-sm text-muted-foreground" data-testid="header-description">
                  {description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span data-testid="user-name">
                {(user as any)?.firstName || (user as any)?.email || "Beheerder"}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Uitloggen
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main Content */}
        <div className="flex-1 min-h-[calc(100vh-65px)]">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}