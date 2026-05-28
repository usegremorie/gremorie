import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: [
    "@gremorie/rx-ai",
    "@gremorie/rx-containers",
    "@gremorie/rx-core",
    "@gremorie/rx-data",
    "@gremorie/rx-display",
    "@gremorie/rx-feedback",
    "@gremorie/rx-forms",
    "@gremorie/rx-navigation",
    "@gremorie/rx-overlays"
  ]
};

export default withMDX(config);
