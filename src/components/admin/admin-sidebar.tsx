'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Home, 
  Layout, 
  BarChart3, 
  Users, 
  Briefcase, 
  FileText, 
  Handshake, 
  Heart,
  Building,
  Mail,
  Settings,
  Image,
  MessageSquare,
  HelpCircle,
  Shield,
  Archive,
  ChevronDown,
  ChevronRight
} from "lucide-react";

interface SidebarItem {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  path?: string;
  badge?: string;
  children?: SidebarItem[];
}

const sidebarData: SidebarItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: BarChart3,
    path: "/admin"
  },
  {
    id: "content",
    title: "Content Beheer",
    icon: Layout,
    children: [
      { id: "hero", title: "Hero Sectie", icon: Home, path: "/admin/content/hero" },
      { id: "about", title: "Over Ons", icon: Users, path: "/admin/content/about" },
      { id: "services", title: "Diensten", icon: Briefcase, path: "/admin/content/services" },
      { id: "projects", title: "Projecten", icon: Building, path: "/admin/content/projects" },
      { id: "blog", title: "Blog", icon: FileText, path: "/admin/content/blog" },
      { id: "team", title: "Team", icon: Users, path: "/admin/content/team" },
      { id: "testimonials", title: "Klantbeoordelingen", icon: MessageSquare, path: "/admin/content/testimonials" },
      { id: "partners", title: "Partners", icon: Handshake, path: "/admin/content/partners" },
      { id: "partners-settings", title: "Partners Instellingen", icon: Settings, path: "/admin/content/partners-settings" },
      { id: "blog-settings", title: "Blog Instellingen", icon: FileText, path: "/admin/content/blog-settings" },
      { id: "company-initiatives", title: "Bedrijfsinitiatieven", icon: Heart, path: "/admin/content/company-initiatives" }
    ]
  },
  {
    id: "statistics",
    title: "Statistieken",
    icon: BarChart3,
    children: [
      { id: "stats-content", title: "Statistiek Content", icon: BarChart3, path: "/admin/content/statistics" }
    ]
  },
  {
    id: "pages",
    title: "Pagina's",
    icon: FileText,
    children: [
      { id: "about-page", title: "Over Ons Pagina", icon: Users, path: "/admin/pages/about" },
      { id: "maatschappelijke-page", title: "Maatschappelijke Pagina", icon: Heart, path: "/admin/pages/maatschappelijke" },
      { id: "legal-pages", title: "Juridische Pagina's", icon: Shield, path: "/admin/pages/legal" }
    ]
  },
  {
    id: "communication",
    title: "Communicatie",
    icon: Mail,
    children: [
      { id: "inquiries", title: "Aanvragen", icon: HelpCircle, path: "/admin/communication/inquiries", badge: "3" },
      { id: "comments", title: "Reacties", icon: MessageSquare, path: "/admin/communication/comments", badge: "5" },
      { id: "email-templates", title: "Email Templates", icon: Mail, path: "/admin/communication/email-templates" },
      { id: "email-settings", title: "Email Instellingen", icon: Settings, path: "/admin/communication/email-settings" },
      { id: "email-logs", title: "Email Logs", icon: Archive, path: "/admin/communication/email-logs" }
    ]
  },
  {
    id: "media",
    title: "Media Beheer",
    icon: Image,
    path: "/admin/media"
  },
  {
    id: "settings",
    title: "Instellingen",
    icon: Settings,
    children: [
      { id: "general-settings", title: "Algemene Instellingen", icon: Settings, path: "/admin/settings/general" },
      { id: "company-details", title: "Bedrijfsgegevens", icon: Building, path: "/admin/settings/company" },
      { id: "contact-settings", title: "Contact Instellingen", icon: Mail, path: "/admin/settings/contact" },
      { id: "contact-form-settings", title: "Neem Contact Op Formulier", icon: FileText, path: "/admin/settings/contact-form" },
      { id: "footer-settings", title: "Footer Instellingen", icon: Layout, path: "/admin/settings/footer" }
    ]
  },
  {
    id: "system",
    title: "Systeem",
    icon: Archive,
    children: [
      { id: "content-backups", title: "Content Backups", icon: Archive, path: "/admin/system/backups" }
    ]
  }
];

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className = "" }: AdminSidebarProps) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<string[]>(["content"]);

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isActiveItem = (path?: string) => {
    if (!path) return false;
    return pathname === path || pathname.startsWith(path + "/");
  };

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openSections.includes(item.id);
    const isActive = isActiveItem(item.path);

    if (hasChildren) {
      return (
        <Collapsible key={item.id} open={isOpen} onOpenChange={() => toggleSection(item.id)}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={`w-full justify-start text-left font-normal ${
                level > 0 ? "pl-8" : "pl-4"
              } hover:bg-muted/50`}
              data-testid={`sidebar-section-${item.id}`}
            >
              <item.icon className="mr-3 h-4 w-4" />
              <span className="flex-1">{item.title}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto mr-2">
                  {item.badge}
                </Badge>
              )}
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            {item.children?.map(child => renderSidebarItem(child, level + 1))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Link key={item.id} href={item.path!}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={`w-full justify-start text-left font-normal ${
            level > 0 ? "pl-8" : "pl-4"
          } hover:bg-muted/50`}
          data-testid={`sidebar-item-${item.id}`}
        >
          <item.icon className="mr-3 h-4 w-4" />
          <span className="flex-1">{item.title}</span>
          {item.badge && (
            <Badge variant="secondary" className="ml-auto">
              {item.badge}
            </Badge>
          )}
        </Button>
      </Link>
    );
  };

  return (
    <div className={`w-64 bg-background border-r ${className}`} data-testid="admin-sidebar">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-foreground" data-testid="sidebar-title">
          Admin Dashboard
        </h2>
        <p className="text-sm text-muted-foreground">Content Management Systeem</p>
      </div>
      
      <ScrollArea className="h-[calc(100vh-80px)]">
        <div className="p-2 space-y-1">
          {sidebarData.map(item => renderSidebarItem(item))}
        </div>
      </ScrollArea>
    </div>
  );
}