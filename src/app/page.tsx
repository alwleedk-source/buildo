import { Metadata } from 'next';
import { HomePage } from '@/components/pages/home-page';

export const metadata: Metadata = {
  title: 'Home - BouwMeesters Amsterdam',
  description: 'Home - BouwMeesters Amsterdam page',
};

export const dynamic = 'force-dynamic';

export default function Page() {
  return <HomePage />;
}
