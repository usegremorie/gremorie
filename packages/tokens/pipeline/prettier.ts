import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';

// The repository's own Prettier config, resolved from inside this package,
// so output formats the same whatever --root the build writes to.
const anchor = fileURLToPath(new URL('../styles/theme.css', import.meta.url));

export async function formatCss(text: string): Promise<string> {
  const config = (await resolveConfig(anchor)) ?? {};
  return format(text, { ...config, parser: 'css' });
}

export async function formatJson(value: unknown): Promise<string> {
  const config = (await resolveConfig(anchor)) ?? {};
  return format(JSON.stringify(value, null, 2), { ...config, parser: 'json' });
}
