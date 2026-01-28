import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'GymstarQuiz',
      fileName: 'gymstar-quiz.min',
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        entryFileNames: 'gymstar-quiz.min.js',
        format: 'iife',
        name: 'GymstarQuiz'
      }
    },
    minify: 'terser',
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    port: 3000,
    open: true
  }
});
