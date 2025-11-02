import type { Metadata } from 'next';
import { HomePage } from '@/components/pages/home-page';

export const metadata: Metadata = {
  title: 'Home - BouwMeesters Amsterdam',
  description: 'Home - BouwMeesters Amsterdam page',
};

export const revalidate = 300; // Revalidate every 5 minutes

export default function Page() {
  return <HomePage />;
}
