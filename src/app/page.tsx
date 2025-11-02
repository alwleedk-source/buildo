import type { Metadata } from 'next';
import { HomePage } from '@/components/pages/home-page';

export const metadata: Metadata = {
  title: 'BouwMeesters Amsterdam - Professionele Bouwoplossingen',
  description: 'BouwMeesters Amsterdam BV biedt professionele bouwdiensten in Amsterdam. Specialisten in nieuwbouw, renovatie, verbouwing en duurzaam bouwen. Vraag vrijblijvend offerte aan.',
  keywords: 'bouwbedrijf Amsterdam, nieuwbouw, renovatie, verbouwing, duurzaam bouwen, aannemer Amsterdam',
  openGraph: {
    title: 'BouwMeesters Amsterdam - Professionele Bouwoplossingen',
    description: 'Professionele bouwdiensten in Amsterdam. Nieuwbouw, renovatie en duurzaam bouwen.',
    type: 'website',
  },
};

export const revalidate = 300; // Revalidate every 5 minutes

export default function Page() {
  return <HomePage />;
}
