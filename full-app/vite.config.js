import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      
      '@': path.resolve(__dirname, './src'),

      '#': path.resolve(__dirname, './src/assets/js'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  }
});
