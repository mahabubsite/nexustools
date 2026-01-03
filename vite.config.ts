import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['logo.png', 'favicon.ico', 'robots.txt'],
          manifest: {
            name: 'Nexus Tools',
            short_name: 'Nexus',
            description: 'High-performance online tools for builders and creators',
            theme_color: '#2563EB',
            background_color: '#ffffff',
            display: 'standalone',
            scope: '/',
            start_url: '/',
            icons: [
              { src: '/logo.png', sizes: '192x192', type: 'image/png' },
              { src: '/logo.png', sizes: '512x512', type: 'image/png' }
            ]
          },
          workbox: {
            runtimeCaching: [
              {
                urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'images-cache',
                  expiration: {
                    maxEntries: 60,
                    maxAgeSeconds: 30 * 24 * 60 * 60
                  }
                }
              },
              {
                urlPattern: /\/api\//,
                handler: 'NetworkFirst',
                options: {
                  cacheName: 'api-cache',
                  networkTimeoutSeconds: 10,
                  expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 24 * 60 * 60
                  }
                }
              },
              {
                urlPattern: /\//,
                handler: 'NetworkFirst',
                options: {
                  cacheName: 'html-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 24 * 60 * 60
                  }
                }
              }
            ]
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
