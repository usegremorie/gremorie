/// <reference types="vitest" />
import angular from '@analogjs/vite-plugin-angular';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  // Point the Angular transform at the spec tsconfig: the project's root
  // tsconfig.json is solution-style (empty `include`, only references), so
  // without this the plugin builds an empty TS program and every
  // Angular-decorator file is reported "not in the TypeScript program".
  // tsconfigPaths resolves workspace `@gremorie/*` imports to their source
  // (via tsconfig.base paths) so specs don't depend on each package's built
  // dist being present.
  plugins: [
    tsconfigPaths({ root: '../../', projects: ['tsconfig.base.json'] }),
    angular({ tsconfig: 'tsconfig.spec.json' }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/packages/ng-data',
      provider: 'v8',
    },
  },
});
