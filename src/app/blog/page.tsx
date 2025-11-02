import { Metadata } from 'next';
import { BlogPageServer } from '@/components/pages/blog-page-server';

export const metadata: Metadata = {
  title: 'Blog - BouwMeesters Amsterdam | Bouw Tips & Trends',
  description: 'Ontdek de nieuwste trends, tips en inzichten uit de bouwwereld. Lees over duurzaam bouwen, renovatie tips, nieuwbouw trends en meer van onze bouwexperts.',
  keywords: 'bouw blog, renovatie tips, nieuwbouw trends, duurzaam bouwen, bouw advies, Amsterdam',
  openGraph: {
    title: 'Blog - BouwMeesters Amsterdam',
    description: 'Ontdek de nieuwste trends, tips en inzichten uit de bouwwereld.',
    type: 'website',
  },
};

export const revalidate = 300; // Revalidate every 5 minutes

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
