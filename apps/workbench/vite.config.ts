import { join } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/**
 * Standalone Gremorie Workbench app. The shell dogfoods the React (`rx-*`)
 * primitives; the previews embed the two unified Storybooks as symmetric
 * iframes (React :4401, Angular :4400). Components resolve from SOURCE via
 * aliases (HMR, no build needed) - mirrors packages/rx-ai/.storybook.
 */
const workspaceRoot = join(__dirname, '..', '..');

const RX_PACKAGES = [
  'rx-core',
  'rx-ai',
  'rx-artifacts',
  'rx-forms',
  'rx-display',
  'rx-overlays',
  'rx-feedback',
  'rx-navigation',
  'rx-containers',
  'rx-data',
];

export default defineConfig({
  root: __dirname,
  plugins: [react(), tailwindcss()],
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.mjs', '.js', '.json'],
    alias: {
      '@gremorie/contracts': join(
        workspaceRoot,
        'packages',
        'contracts',
        'src',
        'index.ts',
      ),
      ...Object.fromEntries(
        RX_PACKAGES.map((p) => [
          `@gremorie/${p}`,
          join(workspaceRoot, 'packages', p, 'src', 'index.ts'),
        ]),
      ),
    },
  },
});
