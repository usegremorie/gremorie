import { reactLibraryConfig } from "./react-library.js";

/**
 * ESLint flat config for Next.js apps in the Gremorie monorepo.
 *
 * Extends the React library config. The `@next/eslint-plugin-next`
 * preset is added per-app once Next.js is installed (Phase 1+),
 * because it needs to resolve from the app's own dependency tree.
 */
export const nextConfig = [
  ...reactLibraryConfig,
  {
    rules: {
      "react/react-in-jsx-scope": "off"
    }
  }
];

export default nextConfig;
