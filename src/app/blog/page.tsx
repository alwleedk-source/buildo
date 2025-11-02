import { Metadata } from 'next';
import { BlogPageServer } from '@/components/pages/blog-page-server';

export const metadata: Metadata = {
  title: 'Blog - BouwMeesters Amsterdam',
  description: 'Ontdek de nieuwste trends, tips en inzichten uit de bouwwereld',
};

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams?: Promise<{
    category?: string;
    tag?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  return <BlogPageServer searchParams={params} />;
}
