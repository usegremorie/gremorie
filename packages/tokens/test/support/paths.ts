import { fileURLToPath } from 'node:url';

export const PACKAGE_ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const REFERENCE_DIR = fileURLToPath(
  new URL('../../reference/0.8.0/', import.meta.url),
);
