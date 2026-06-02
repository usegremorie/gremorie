import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5023,
    strictPort: true,
    proxy: {
      '/api': 'http://localhost:5024',
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
