import { Metadata } from 'next';
import { LegalPagePage } from '@/components/pages/legalpage-page';

export const metadata: Metadata = {
  title: 'Legal Page - BouwMeesters Amsterdam',
  description: 'Legal Page - BouwMeesters Amsterdam page',
};

export const dynamic = 'force-dynamic';

export default function Page() {
  return <LegalPagePage />;
}
