import { Metadata } from 'next';
import { LoginPage } from '@/components/pages/login-page';

export const metadata: Metadata = {
  title: 'Login - BouwMeesters Amsterdam',
  description: 'Login - BouwMeesters Amsterdam page',
};

export const dynamic = 'force-dynamic';

export default function Page() {
  return <LoginPage />;
}
