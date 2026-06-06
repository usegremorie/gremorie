import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

// The monorepo root, two levels up from apps/docs. Pinning Turbopack's root
// silences the "multiple lockfiles / inferred workspace root" warning, which
// fires when the app is built from a nested git worktree that carries its own
// untracked package-lock.json alongside the repo-root one.
const workspaceRoot = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);

/**
 * 301 redirects from the legacy `/foundations/*` paths to the new
 * IA destinations (Phase 1 of proposta v4). Mirrored in `vercel.json`
 * so they apply both via Vercel's edge layer and Next's middleware,
 * which keeps local `next start` parity with production.
 */
const foundationsRedirects = [
  {
    source: '/foundations/about',
    destination: '/platform/internal/about',
    permanent: true,
  },
  {
    source: '/foundations/contributing',
    destination: '/get-started/contributing',
    permanent: true,
  },
  {
    source: '/foundations/principles',
    destination: '/get-started/philosophy',
    permanent: true,
  },
  {
    source: '/foundations/architecture',
    destination: '/platform/architecture',
    permanent: true,
  },
  {
    source: '/foundations/component-catalog',
    destination: '/components/overview',
    permanent: true,
  },
  {
    source: '/foundations/documentation-standard',
    destination: '/platform/internal/documentation-standard',
    permanent: true,
  },
  {
    source: '/foundations/storybook-structure',
    destination: '/platform/internal/storybook-structure',
    permanent: true,
  },
  {
    source: '/foundations/accessibility',
    destination: '/platform/internal/accessibility',
    permanent: true,
  },
  {
    source: '/foundations/layout-stability',
    destination: '/platform/internal/layout-stability',
    permanent: true,
  },
  { source: '/foundations/corpus', destination: '/corpus', permanent: true },
  {
    source: '/foundations/corpus/:path*',
    destination: '/corpus/:path*',
    permanent: true,
  },
  {
    source: '/foundations',
    destination: '/get-started/philosophy',
    permanent: true,
  },
  {
    source: '/foundations/:path*',
    destination: '/get-started/philosophy',
    permanent: true,
  },
];

/**
 * 301 redirects from the legacy flat AI paths to the new category folders.
 * The AI docs moved from /components/ai/<name> into the Chatbot, Code,
 * Workflow and Utilities categories under the Components root.
 */
const aiCategoryMap = {
  'prompt-input': 'chatbot',
  message: 'chatbot',
  conversation: 'chatbot',
  reasoning: 'chatbot',
  'chain-of-thought': 'chatbot',
  task: 'chatbot',
  tool: 'chatbot',
  sources: 'chatbot',
  'inline-citation': 'chatbot',
  plan: 'chatbot',
  checkpoint: 'chatbot',
  confirmation: 'chatbot',
  context: 'chatbot',
  queue: 'chatbot',
  suggestion: 'chatbot',
  shimmer: 'chatbot',
  'model-selector': 'chatbot',
  artifact: 'code',
  'code-block': 'code',
  'web-preview': 'code',
  canvas: 'workflow',
  node: 'workflow',
  edge: 'workflow',
  connection: 'workflow',
  controls: 'workflow',
  panel: 'workflow',
  toolbar: 'workflow',
  image: 'utilities',
  'open-in-chat': 'utilities',
};

const aiRedirects = Object.entries(aiCategoryMap).map(([name, category]) => ({
  source: `/components/ai/${name}`,
  destination: `/components/${category}/${name}`,
  permanent: true,
}));

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  turbopack: {
    root: workspaceRoot,
  },
  transpilePackages: [
    '@gremorie/rx-ai',
    '@gremorie/rx-containers',
    '@gremorie/rx-core',
    '@gremorie/rx-data',
    '@gremorie/rx-display',
    '@gremorie/rx-feedback',
    '@gremorie/rx-forms',
    '@gremorie/rx-navigation',
    '@gremorie/rx-overlays',
  ],
  async redirects() {
    return [...foundationsRedirects, ...aiRedirects];
  },
};

export default withMDX(config);
