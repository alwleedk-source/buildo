'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import translationNL from '../../public/locales/nl/translation.json';
import translationEN from '../../public/locales/en/translation.json';

const resources = {
  nl: {
    translation: translationNL,
  },
  en: {
    translation: translationEN,
  },
};

// Only initialize if not already initialized
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'nl',
      lng: 'nl',
      debug: false,
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
      },
    });
}

export default i18n;
