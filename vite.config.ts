import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { sitemapPlugin } from "./vite-plugin-sitemap";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemapPlugin({
      hostname: 'https://crossplatformkorea.com',
      changefreq: 'weekly',
      priority: 0.7,
    })
  ],
  publicDir: "public",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
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
          'ui-vendor': [
            '@radix-ui/react-dialog', 
            'clsx', 
            'tailwind-merge', 
            'framer-motion'
          ],
          
          // Icon libraries
          'icons-vendor': ['lucide-react', '@icons-pack/react-simple-icons'],
          
          // Internationalization and utilities
          'i18n-vendor': ['i18next', 'react-i18next', 'date-fns'],
          
          // Markdown processing
          'markdown-vendor': [
            'react-markdown', 
            'rehype-raw', 
            'remark-breaks'
          ],
          
          // Other utilities
          'utils-vendor': ['uuid', 'zustand', 'sonner', 'resend']
        },
      },
    },
    // 청크 크기 경고 한계를 조정
    chunkSizeWarningLimit: 500,
  },
});
