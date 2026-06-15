import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
// `base` is '/' for local dev/preview; the deploy workflow sets DEPLOY_BASE
// to '/Take-Two/' so assets resolve under the GitHub Pages project subpath.
export default defineConfig({
  base: process.env.DEPLOY_BASE || '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon-32.png', 'apple-touch-icon.png', 'icon.svg'],
      manifest: {
        name: 'Behind the Show — Production Tracker',
        short_name: 'Behind the Show',
        description:
          'Production tracker for the Behind the Show documentary — episodes, footage, schedule, team, and open questions.',
        theme_color: '#1C1A17',
        background_color: '#FBF7F0',
        display: 'standalone',
        orientation: 'portrait',
        categories: ['productivity'],
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'pwa-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
});
