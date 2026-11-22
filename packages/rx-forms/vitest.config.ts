import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    // Specs opt into jsdom with a `@vitest-environment` pragma.
    environment: 'node',
    include: ['src/**/*.spec.{ts,tsx}'],
  },
});
