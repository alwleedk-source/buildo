'use client';

import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize i18n on client side
    if (typeof window !== 'undefined') {
      i18n.changeLanguage(i18n.language);
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
