import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  publicDir: 'public', // Добавляем это, чтобы Vite использовал папку public
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        manifest: 'public/manifest.json' // Указываем явный вход для манифеста
      }
    }
  }
});
