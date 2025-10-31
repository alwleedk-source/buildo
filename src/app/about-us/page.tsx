import { Metadata } from 'next';
import { AboutUsPage } from '@/components/pages/aboutus-page';

export const metadata: Metadata = {
  title: 'About Us - BouwMeesters Amsterdam',
  description: 'About Us - BouwMeesters Amsterdam page',
};

export const dynamic = 'force-dynamic';

export default function Page() {
  return <AboutUsPage />;
}
