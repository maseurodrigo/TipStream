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
    target: 'esnext' // Optimize for modern browsers
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