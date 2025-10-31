import { Metadata } from 'next';
import { ProjectPage } from '@/components/pages/project-page';

export const metadata: Metadata = {
  title: 'Project - BouwMeesters Amsterdam',
  description: 'Project - BouwMeesters Amsterdam page',
};

export const dynamic = 'force-dynamic';

export default function Page() {
  return <ProjectPage />;
}
