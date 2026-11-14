import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    // renderToStaticMarkup needs no DOM: the emitted markup is what SSR would send to the browser.
    environment: 'node',
    include: ['src/**/*.spec.{ts,tsx}'],
  },
});
