import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      // A small custom plugin to copy index.html to 404.html for GitHub Pages
      // This is necessary because GitHub Pages serves 404.html for any unknown routes
      name: 'copy-index-to-404',
      closeBundle: () => {
        const indexPath = path.resolve(__dirname, 'dist/index.html');
        const notFoundPath = path.resolve(__dirname, 'dist/404.html');
        fs.copyFileSync(indexPath, notFoundPath);
        console.log('✅ Copied index.html to 404.html for GitHub Pages fallback.');
      }
    }
  ],
  base: '/vim-web-demo/', // Must match your GitHub repo name
  build: {
    outDir: "./dist",
    sourcemap: true,
    minify: false,
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
});
