import { Metadata } from 'next';
import { MaatschappelijkePage } from '@/components/pages/maatschappelijke-page';

export const metadata: Metadata = {
  title: 'Maatschappelijke - BouwMeesters Amsterdam',
  description: 'Maatschappelijke - BouwMeesters Amsterdam page',
};

export const dynamic = 'force-dynamic';

export default function Page() {
  return <MaatschappelijkePage />;
}
