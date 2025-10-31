"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Home, 
  Wrench, 
  FolderKanban, 
  FileText, 
  Users, 
  Handshake, 
  MessageSquare,
  Mail,
  Settings
} from 'lucide-react';

export default function AdminDashboard() {
  const sections = [
    {
      title: 'Hero Section',
      description: 'Manage homepage hero content, video, and text',
      icon: Home,
      href: '/admin/content/hero',
      color: 'bg-blue-500'
    },
    {
      title: 'Services',
      description: 'Manage services and service details',
      icon: Wrench,
      href: '/admin/content/services',
      color: 'bg-green-500'
    },
    {
      title: 'Projects',
      description: 'Manage project portfolio and case studies',
      icon: FolderKanban,
      href: '/admin/content/projects',
      color: 'bg-purple-500'
    },
    {
      title: 'Blog',
      description: 'Manage blog articles and categories',
      icon: FileText,
      href: '/admin/content/blog',
      color: 'bg-orange-500'
    },
    {
      title: 'Team',
      description: 'Manage team members and their information',
      icon: Users,
      href: '/admin/content/team',
      color: 'bg-pink-500'
    },
    {
      title: 'Partners',
      description: 'Manage partner logos and links',
      icon: Handshake,
      href: '/admin/content/partners',
      color: 'bg-indigo-500'
    },
    {
      title: 'Testimonials',
      description: 'Manage customer reviews and testimonials',
      icon: MessageSquare,
      href: '/admin/content/testimonials',
      color: 'bg-yellow-500'
    },
    {
      title: 'Contact Messages',
      description: 'View and manage contact form submissions',
      icon: Mail,
      href: '/admin/communication/inquiries',
      color: 'bg-red-500'
    },
    {
      title: 'Form Settings',
      description: 'Configure contact form fields',
      icon: Settings,
      href: '/admin/settings/general',
      color: 'bg-gray-500'
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage all website content from here</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.href} href={section.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`${section.color} p-3 rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{section.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">5</div>
                <div className="text-sm text-gray-600">Services</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">5</div>
                <div className="text-sm text-gray-600">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">3</div>
                <div className="text-sm text-gray-600">Blog Posts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600">3</div>
                <div className="text-sm text-gray-600">Team Members</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
