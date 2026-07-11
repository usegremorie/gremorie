import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    // `renderToStaticMarkup` needs no DOM, and asserting on the emitted markup
    // is the point: it is exactly what an SSR'd page would send to a browser.
    environment: 'node',
    include: ['src/**/*.spec.{ts,tsx}'],
  },
});
