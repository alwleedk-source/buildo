import { Metadata } from 'next';
import { BlogPageServer } from '@/components/pages/blog-page-server';

export const metadata: Metadata = {
  title: 'Blog - BouwMeesters Amsterdam',
  description: 'Ontdek de nieuwste trends, tips en inzichten uit de bouwwereld',
};

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams?: {
    category?: string;
    tag?: string;
  };
}

export default function Page({ searchParams }: PageProps) {
  return <BlogPageServer searchParams={searchParams} />;
}
