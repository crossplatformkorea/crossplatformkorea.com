import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: "public",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React ecosystem
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
            return 'react-vendor';
          }
          
          // Convex
          if (id.includes('convex') || id.includes('@convex-dev')) {
            return 'convex-vendor';
          }
          
          // UI libraries
          if (id.includes('@radix-ui') || id.includes('class-variance-authority') || id.includes('clsx') || id.includes('tailwind-merge')) {
            return 'ui-vendor';
          }
          
          // Icon libraries (split into separate chunks due to size)
          if (id.includes('lucide-react')) {
            return 'lucide-vendor';
          }
          if (id.includes('@icons-pack')) {
            return 'icons-vendor';
          }
          
          // Date and i18n utilities
          if (id.includes('date-fns') || id.includes('i18next')) {
            return 'i18n-vendor';
          }
          
          // Markdown and text processing
          if (id.includes('micromark') || id.includes('hast') || id.includes('mdast') || id.includes('remark') || id.includes('rehype')) {
            return 'markdown-vendor';
          }
          
          // Framer Motion (animation library)
          if (id.includes('framer-motion')) {
            return 'animation-vendor';
          }
          
          // Other vendor libraries
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    // 청크 크기 경고 한계를 조정
    chunkSizeWarningLimit: 500,
  },
});
