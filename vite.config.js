import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      // Configura o @ para a pasta src
      '@': path.resolve(__dirname, './src'),
      // Configura o # para a pasta public
      '#': path.resolve(__dirname, './public'),
    },
  },
  server: {
    // Garante que o Vite corre na porta padrão e permite acesso externo se necessário
    port: 5173,
    strictPort: true,
  }
});
