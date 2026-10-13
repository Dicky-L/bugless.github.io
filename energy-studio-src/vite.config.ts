import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

// Relative asset paths support both local Vite preview and GitHub Pages project subpaths.
export default defineConfig({
  plugins: [vue()],
  base: './',
  build: { outDir: 'dist', sourcemap: false },
  test: { environment: 'node' }
});