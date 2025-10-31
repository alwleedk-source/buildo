import { Metadata } from 'next';
import { MaatschappelijkeDetailPage } from '@/components/pages/maatschappelijkedetail-page';

export const metadata: Metadata = {
  title: 'Maatschappelijke Detail - BouwMeesters Amsterdam',
  description: 'Maatschappelijke Detail - BouwMeesters Amsterdam page',
};

export const dynamic = 'force-dynamic';

export default function Page() {
  return <MaatschappelijkeDetailPage />;
}
