import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  root: './',
  build: { outDir: path.resolve(__dirname, 'dist') },
  plugins: [react()],
  optimizeDeps: { exclude: ['lucide-react'] },
  server: { port: 8080 }
});