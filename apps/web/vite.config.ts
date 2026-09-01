import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { sitemapPlugin } from './vite-plugin-sitemap';
import { rssPlugin } from './vite-plugin-rss';

// https://vite.dev/config/
export default defineConfig({
  envDir: '../..',
  plugins: [
    react(),
    sitemapPlugin({
      hostname: 'https://crossplatformkorea.com',
    }),
    rssPlugin({
      hostname: 'https://crossplatformkorea.com',
      title: 'Cross-Platform Korea',
      description:
        '한국 크로스플랫폼 개발자 커뮤니티 — React Native, Flutter, Kotlin Multiplatform, Tauri, Electron 등 최신 소식과 심층 해설.',
    }),
  ],
  publicDir: 'public',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@convex': path.resolve(__dirname, '../../convex'),
    },
  },
  build: {
    sourcemap: false, // Disable source maps for production
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // UI and styling libraries
          'ui-vendor': ['@radix-ui/react-dialog', 'clsx', 'tailwind-merge', 'framer-motion'],

          // Icon libraries
          'icons-vendor': ['lucide-react', '@icons-pack/react-simple-icons'],

          // Internationalization and utilities
          'i18n-vendor': ['i18next', 'react-i18next', 'date-fns'],

          // Markdown processing
          'markdown-vendor': ['react-markdown', 'rehype-raw', 'remark-breaks'],

          // Other utilities
          'utils-vendor': ['zustand', 'sonner'],
        },
      },
    },
    // 청크 크기 경고 한계를 조정
    chunkSizeWarningLimit: 500,
  },
});
