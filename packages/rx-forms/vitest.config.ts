import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const src = (pkg: string) =>
  fileURLToPath(new URL(`../${pkg}/src/index.ts`, import.meta.url));

export default defineConfig({
  plugins: [react()],
  // Specs run against sibling sources, so no package has to be built first.
  resolve: {
    alias: {
      '@gremorie/rx-core': src('rx-core'),
      '@gremorie/color': src('color'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.spec.{ts,tsx}'],
  },
});
