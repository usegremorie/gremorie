import { join } from "node:path";
import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

/**
 * React Storybook for all `@gremorie/rx-*` packages.
 *
 * Mirrors the Angular setup (packages/ng-ai/.storybook): a single instance
 * whose `stories` glob reaches into sibling rx-* packages, so one server
 * covers every React primitive. Run with `nx storybook rx-ai` (port 4401).
 *
 * - Components are resolved from SOURCE (src/index.ts) via Vite aliases, so
 *   stories reflect the current code with HMR - no library build required.
 * - Tailwind v4 is wired through @tailwindcss/vite; the token theme + class
 *   scanning live in ./preview.css.
 */
const RX_PACKAGES = [
  "rx-core",
  "rx-ai",
  "rx-artifacts",
  "rx-forms",
  "rx-display",
  "rx-overlays",
  "rx-feedback",
  "rx-navigation",
  "rx-containers",
  "rx-data",
] as const;

const config: StorybookConfig = {
  stories: [
    "../src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../../rx-artifacts/src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../../rx-forms/src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../../rx-display/src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../../rx-overlays/src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../../rx-feedback/src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../../rx-navigation/src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../../rx-containers/src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../../rx-data/src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
  ],
  addons: ["@storybook/addon-docs"],
  framework: { name: "@storybook/react-vite", options: {} },
  async viteFinal(cfg) {
    // Repo root: nx runs targets from the workspace root.
    const root = process.cwd();
    cfg.plugins = cfg.plugins ?? [];
    cfg.plugins.push(tailwindcss());
    cfg.resolve = cfg.resolve ?? {};
    // Resolve TS source BEFORE .js, so a stray compiled file accidentally
    // emitted next to a .tsx (e.g. a misconfigured tsc run) can never shadow
    // the real source and serve a stale component.
    cfg.resolve.extensions = [
      ".tsx",
      ".ts",
      ".jsx",
      ".mjs",
      ".js",
      ".mts",
      ".cts",
      ".json",
    ];
    cfg.resolve.alias = {
      ...(cfg.resolve.alias as Record<string, string> | undefined),
      ...Object.fromEntries(
        RX_PACKAGES.map((p) => [
          `@gremorie/${p}`,
          join(root, "packages", p, "src", "index.ts"),
        ]),
      ),
    };
    return cfg;
  },
};

export default config;
