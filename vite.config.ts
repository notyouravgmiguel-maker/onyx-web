import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// Source lives in src/ (src/index.html is the entry). `npm run build` writes to
// dist/ and then publishes into the project root, which WAMP serves at
// http://localhost/onyx-web/.
export default defineConfig({
  root: 'src',
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // The installers are only on disk under /downloads, served by WAMP.
    proxy: {
      '/downloads': {
        target: 'http://localhost',
        rewrite: (p) => `/onyx-web${p}`,
      },
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
