import { describe, it, expect } from 'vitest';
import { createApp } from './app.js';
import { dirname, join } from 'node:path';
import {
  cpSync,
  existsSync,
  mkdirSync,
  writeFileSync,
  rmSync,
  readFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

describe('server app', () => {
  it('GET /api/health returns ok', async () => {
    const dir = join(tmpdir(), 'tokens-srv-' + Date.now());
    mkdirSync(dir, { recursive: true });
    const app = createApp({ projectRoot: dir, globalsCss: 'globals.css' });
    const res = await app.request('/api/health');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    rmSync(dir, { recursive: true, force: true });
  });

  it('GET /api/project returns parsed graph', async () => {
    const dir = join(tmpdir(), 'tokens-srv-' + Date.now());
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      join(dir, 'globals.css'),
      `@theme { --color-gray-50: oklch(0.98 0 0); }
       :root { --background: var(--color-gray-50); }`,
    );

    const app = createApp({ projectRoot: dir, globalsCss: 'globals.css' });
    const res = await app.request('/api/project');
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      graph: { primitives: Record<string, unknown> };
    };
    expect(body.graph.primitives).toBeDefined();
    expect(Object.keys(body.graph.primitives)).toHaveLength(1);
    rmSync(dir, { recursive: true, force: true });
  });

  it('POST /api/apply updates globals.css', async () => {
    const dir = join(tmpdir(), 'tokens-srv-' + Date.now());
    mkdirSync(dir, { recursive: true });
    const cssPath = join(dir, 'globals.css');
    writeFileSync(cssPath, `@theme { --color-gray-50: oklch(0.98 0 0); }`);

    const app = createApp({ projectRoot: dir, globalsCss: 'globals.css' });
    const res = await app.request('/api/apply', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        changes: [
          {
            kind: 'primitive-value',
            tokenName: '--color-gray-50',
            newValue: 'oklch(0.99 0 0)',
          },
        ],
      }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { written: string };
    expect(body.written).toBe('globals.css');

    const updated = readFileSync(cssPath, 'utf8');
    expect(updated).toContain('oklch(0.99 0 0)');
    rmSync(dir, { recursive: true, force: true });
  });
});

const tokensPkg = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../../tokens',
);
const run = promisify(execFile);

describe('server app (DTCG source)', () => {
  const setup = () => {
    const root = join(
      tmpdir(),
      `tokens-dtcg-${process.pid}-${Math.random().toString(36).slice(2)}`,
    );
    mkdirSync(join(root, 'styles'), { recursive: true });
    cpSync(join(tokensPkg, 'tokens'), join(root, 'tokens'), {
      recursive: true,
    });
    cpSync(
      join(tokensPkg, 'styles', 'partials'),
      join(root, 'styles', 'partials'),
      { recursive: true },
    );
    cpSync(join(tokensPkg, 'package.json'), join(root, 'package.json'));
    const app = createApp({
      projectRoot: root,
      source: 'dtcg',
      tokensDir: join(root, 'tokens'),
      rebuild: async () => {
        await run(process.execPath, [
          join(tokensPkg, 'pipeline', 'build.ts'),
          '--root',
          root,
        ]);
      },
    });
    return { root, app };
  };

  it('GET /api/project returns the DTCG graph', async () => {
    const { root, app } = setup();
    const res = await app.request('/api/project');
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      project: { source: string };
      graph: {
        primitives: Record<string, unknown>;
        semantics: Record<string, unknown>;
      };
    };
    expect(body.project.source).toBe('dtcg');
    expect(Object.keys(body.graph.primitives).length).toBeGreaterThan(300);
    expect(body.graph.semantics['claude::dark::--primary']).toBeDefined();
    rmSync(root, { recursive: true, force: true });
  });

  it('POST /api/apply changes the JSON and the generated CSS', async () => {
    const { root, app } = setup();
    const res = await app.request('/api/apply', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        changes: [
          {
            kind: 'primitive-value',
            tokenName: '--color-gray-50',
            newValue: 'oklch(0.99 0 0)',
          },
          {
            kind: 'semantic-value',
            tokenName: '--secondary',
            theme: 'chatgpt',
            mode: 'dark',
            newValue: { kind: 'reference', targetName: '--color-emerald-900' },
          },
        ],
      }),
    });
    expect(res.status).toBe(200);
    expect(
      readFileSync(join(root, 'tokens/primitive/color.json'), 'utf8'),
    ).toContain('"components": [0.99, 0, 0]');
    expect(readFileSync(join(root, 'styles/theme.css'), 'utf8')).toContain(
      '--color-gray-50: oklch(0.99 0 0);',
    );
    const chatgpt = readFileSync(
      join(root, 'styles/themes/chatgpt.css'),
      'utf8',
    );
    expect(chatgpt.slice(chatgpt.indexOf('.dark {'))).toContain(
      '--secondary: var(--color-emerald-900);',
    );
    rmSync(root, { recursive: true, force: true });
  }, 120_000);

  it('POST /api/apply answers 400 to an edit DTCG cannot hold', async () => {
    const { root, app } = setup();
    const res = await app.request('/api/apply', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        changes: [
          {
            kind: 'primitive-value',
            tokenName: '--font-sans',
            newValue: 'Arial',
          },
        ],
      }),
    });
    expect(res.status).toBe(400);
    expect(existsSync(join(root, 'styles/theme.css'))).toBe(false);
    rmSync(root, { recursive: true, force: true });
  });
});
