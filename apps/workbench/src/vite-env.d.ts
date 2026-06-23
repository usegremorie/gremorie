/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Origin of the published React Storybook (defaults to the local dev server). */
  readonly VITE_RX_BASE?: string;
  /** Origin of the published Angular Storybook (defaults to the local dev server). */
  readonly VITE_NG_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
