import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    outDir: "./docs",
    //emptyOutDir: true,
    sourcemap: true,
    // Minify set to true will break the IIFE output
    minify: false,
  },
});
