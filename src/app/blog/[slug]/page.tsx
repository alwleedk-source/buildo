import { Metadata } from 'next';
import { BlogArticlePage } from '@/components/pages/blogarticle-page';

export const metadata: Metadata = {
  title: 'Blog Article - BouwMeesters Amsterdam',
  description: 'Blog Article - BouwMeesters Amsterdam page',
};

export const dynamic = 'force-dynamic';

export default function Page() {
  return <BlogArticlePage />;
}
