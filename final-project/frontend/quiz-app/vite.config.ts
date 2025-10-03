// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,
    port: 4200,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
