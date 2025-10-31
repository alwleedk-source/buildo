import { Metadata } from 'next';
import { TeamPage } from '@/components/pages/team-page';

export const metadata: Metadata = {
  title: 'Team - BouwMeesters Amsterdam',
  description: 'Team - BouwMeesters Amsterdam page',
};

export const dynamic = 'force-dynamic';

export default function Page() {
  return <TeamPage />;
}
