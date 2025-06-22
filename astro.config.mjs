// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import AstroPWA from '@vite-pwa/astro';

import vue from '@astrojs/vue';

export default defineConfig({
  devToolbar: {
    enabled: false
  },
  server: { port: 4323 },
  site: 'https://merinojuan.github.io',
  base: '/dolarg',
  vite: {
    // @ts-ignore
    plugins: [tailwindcss()]
  },
  integrations: [
    AstroPWA({
      mode: 'development',
      base: '/dolarg/',
      scope: '/dolarg/',
      includeAssets: ['favicon.svg'],
      manifest: false,
      workbox: {
        navigateFallback: '/dolarg',
      },
      devOptions: {
        enabled: true,
        navigateFallbackAllowlist: [/^\/$/],
      },
    }),
    vue({ appEntrypoint: '/src/pages/_app' })
  ]
});
