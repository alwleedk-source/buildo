// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://bouwmeesters-amsterdam.nl',
  
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': '/src',
        '@features': '/src/features',
        '@components': '/src/components',
        '@layouts': '/src/layouts',
        '@lib': '/src/lib',
        '@config': '/src/config',
      }
    }
  },

  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'nl',
        locales: {
          nl: 'nl-NL',
          en: 'en-US',
        },
      },
    }),
  ],

  i18n: {
    defaultLocale: 'nl',
    locales: ['nl', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  build: {
    inlineStylesheets: 'auto',
  },

  output: 'static',

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});