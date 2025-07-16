import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
export default defineConfig(({ mode }) => ({
  base: '/', // Add this line
  server: {
    host: true,
    port: 8080,
    strictPort: true,
    open: '/login',
  },

  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Add explicit file extensions for directories
      "@/components/ui": path.resolve(__dirname, "./src/components/ui/index.ts"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          // Remove shadcn from manualChunks since we're handling it via alias
        },
      },
    },
  },
}));