/// <reference types="vitest" />
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const fromSrc = (path: string) => fileURLToPath(new URL(`./src/${path}`, import.meta.url));

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@domain': fromSrc('domain'),
      '@application': fromSrc('application'),
      '@infrastructure': fromSrc('infrastructure'),
      '@presentation': fromSrc('presentation'),
      '@main': fromSrc('main'),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
