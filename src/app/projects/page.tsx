import { Metadata } from 'next';
import { ProjectsPage } from '@/components/pages/projects-page';

export const metadata: Metadata = {
  title: 'Projects - BouwMeesters Amsterdam',
  description: 'Projects - BouwMeesters Amsterdam page',
};

export const dynamic = 'force-dynamic';

export default function Page() {
  return <ProjectsPage />;
}
