import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

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

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
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
    return foundationsRedirects;
  },
};

export default withMDX(config);
