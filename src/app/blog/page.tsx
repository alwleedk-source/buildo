import { Metadata } from 'next';
import { BlogPage } from '@/components/pages/blog-page';

export const metadata: Metadata = {
  title: 'Blog - BouwMeesters Amsterdam',
  description: 'Blog - BouwMeesters Amsterdam page',
};

export const dynamic = 'force-dynamic';

export default function Page() {
  return <BlogPage />;
}
