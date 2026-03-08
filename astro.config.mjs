// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import AstroPWA from '@vite-pwa/astro';

import vue from '@astrojs/vue';

export default defineConfig({
  devToolbar: {
    enabled: false
  },
  server: { port: 3000 },
  site: 'https://dolarg.duckdns.org',
  base: '/',
  vite: {
    // @ts-ignore
    plugins: [tailwindcss()]
  },
  integrations: [
    AstroPWA({
      mode: 'development',
      base: '/',
      scope: '/',
      includeAssets: ['favicon.svg'],
      manifest: false,
      workbox: {
        navigateFallback: '/',
      },
      devOptions: {
        enabled: true,
        navigateFallbackAllowlist: [/^\/$/],
      },
    }),
    vue({ appEntrypoint: '/src/pages/_app' })
  ]
});
