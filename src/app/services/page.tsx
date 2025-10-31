import { Metadata } from 'next';
import { ServicesPage } from '@/components/pages/services-page';

export const metadata: Metadata = {
  title: 'Services - BouwMeesters Amsterdam',
  description: 'Services - BouwMeesters Amsterdam page',
};

export const dynamic = 'force-dynamic';

export default function Page() {
  return <ServicesPage />;
}
