import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: './',
  plugins: [
    react(),
    // Add the HTML plugin rewrite for development
    {
      name: 'rewrite-all-to-index',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url?.startsWith('/@') && !req.url?.includes('.')) {
            req.url = '/index.html';
          }
          next();
        });
      }
    }
  ],
  server: {
    host: true,
    port: 8080,
    strictPort: true,
    open: '/login',
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});