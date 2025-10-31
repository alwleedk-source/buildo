import { Metadata } from 'next';
import { ServicePage } from '@/components/pages/service-page';

export const metadata: Metadata = {
  title: 'Service - BouwMeesters Amsterdam',
  description: 'Service - BouwMeesters Amsterdam page',
};

export const dynamic = 'force-dynamic';

export default function Page() {
  return <ServicePage />;
}
