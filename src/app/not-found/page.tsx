import { Metadata } from 'next';
import { NotFoundPage } from '@/components/pages/notfound-page';

export const metadata: Metadata = {
  title: 'Not Found - BouwMeesters Amsterdam',
  description: 'Not Found - BouwMeesters Amsterdam page',
};

export const dynamic = 'force-dynamic';

export default function Page() {
  return <NotFoundPage />;
}
