/// <reference types="vitest" />
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vite';

// Mirrors the ng-data test setup. The Angular AOT transform needs the spec
// tsconfig to emit JS (not just declarations) — see tsconfig.spec.json, which
// overrides the workspace-wide `emitDeclarationOnly: true`. Without that, every
// component falls back to JIT and signal inputs (`input.required()`) are not
// recognised (NG0303/NG0950).
export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/ng-artifacts',
  plugins: [angular(), nxViteTsPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    reporters: ['default'],
  },
});
