import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/illtracker/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      manifest: {
        name: 'Mood Tracker',
        short_name: 'MoodTracker',
        description: 'A mobile-first PWA for tracking your daily mood',
        theme_color: '#667eea',
        background_color: '#667eea',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/illtracker/',
        scope: '/illtracker/',
        lang: 'en',
        categories: ['health', 'lifestyle', 'productivity'],
        icons: [
          {
            src: '/illtracker/pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: '/illtracker/pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          },
          {
            src: '/illtracker/pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/illtracker/pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'maskable'
          },
          {
            src: '/illtracker/pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ]
      }
    })
  ],
})
