import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  root: './',
  build: { 
    outDir: path.resolve(__dirname, 'dist'),
    chunkSizeWarningLimit: 1000, // Prevent warnings
    rollupOptions: {
      output: {
        manualChunks: {
          'lucide-icons': ['lucide-react'] // Create a separate cacheable chunk
        }
      }
    },
    minify: 'esbuild', // Use ESBuild for minification
    target: 'esnext', // Optimize for modern browsers
    esbuild: {
      drop: ['console', 'debugger'], // Remove console logs & debugger
      minifyIdentifiers: true, // Minify variable & function names
      minifyWhitespace: true, // Remove unnecessary whitespace
      minifySyntax: true // Optimize syntax for better performance
    }
  },
  plugins: [react()],  
  optimizeDeps: {
    include: ['lucide-react'] // Prebundle Lucide to speed up loading
  },
  server: { 
    port: 8080, 
    allowedHosts: ['tipstream.up.railway.app']
  }
});