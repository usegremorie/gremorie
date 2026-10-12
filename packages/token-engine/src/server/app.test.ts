import { afterEach, describe, it, expect, vi } from 'vitest';
import { createApp } from './app.js';
import { dirname, join } from 'node:path';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
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
    const dir = mkdtempSync(join(tmpdir(), 'tokens-srv-'));
    const app = createApp({ projectRoot: dir, globalsCss: 'globals.css' });
    const res = await app.request('/api/health');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    rmSync(dir, { recursive: true, force: true });
  });

  it('GET /api/project returns parsed graph', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'tokens-srv-'));
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
    const dir = mkdtempSync(join(tmpdir(), 'tokens-srv-'));
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
  const roots: string[] = [];
  afterEach(() => {
    for (const root of roots.splice(0)) {
      rmSync(root, { recursive: true, force: true });
    }
  });
  const setup = (rebuild?: () => Promise<void>) => {
    const root = mkdtempSync(join(tmpdir(), 'tokens-dtcg-'));
    roots.push(root);
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
      rebuild:
        rebuild ??
        (async () => {
          await run(process.execPath, [
            join(tokensPkg, 'pipeline', 'build.ts'),
            '--root',
            root,
          ]);
        }),
    });
    return { root, app };
  };

  it('GET /api/project returns the DTCG graph', async () => {
    const { app } = setup();
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
  });

  const post = (
    app: ReturnType<typeof createApp>,
    body: unknown,
    headers: Record<string, string> = {},
  ) =>
    app.request('/api/apply', {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...headers },
      body: JSON.stringify(body),
    });
  const lightJson = (root: string) =>
    readFileSync(join(root, 'tokens/semantic/light.json'), 'utf8');

  it('POST /api/apply answers 400 to a reference to nothing', async () => {
    const { root, app } = setup();
    const before = lightJson(root);
    const res = await post(app, {
      changes: [
        {
          kind: 'semantic-value',
          tokenName: '--primary',
          theme: 'default',
          mode: 'light',
          newValue: { kind: 'reference', targetName: '--color-nope-1' },
        },
      ],
    });
    expect(res.status).toBe(400);
    expect(((await res.json()) as { error: string }).error).toMatch(
      /Unknown reference target/,
    );
    expect(lightJson(root)).toBe(before);
  });

  it('POST /api/apply answers 400 when changes is not a list', async () => {
    const { app } = setup();
    const res = await post(app, { changes: 'all of them' });
    expect(res.status).toBe(400);
  });

  it('POST /api/apply restores every file when the rebuild fails', async () => {
    const { root, app } = setup(async () => {
      throw new Error('pipeline exploded');
    });
    const before = lightJson(root);
    const colorBefore = readFileSync(
      join(root, 'tokens/primitive/color.json'),
      'utf8',
    );
    const res = await post(app, {
      changes: [
        {
          kind: 'primitive-value',
          tokenName: '--color-gray-50',
          newValue: 'oklch(0.99 0 0)',
        },
        {
          kind: 'semantic-value',
          tokenName: '--primary',
          theme: 'default',
          mode: 'light',
          newValue: { kind: 'reference', targetName: '--color-violet-700' },
        },
      ],
    });
    expect(res.status).toBe(500);
    expect(((await res.json()) as { error: string }).error).toMatch(
      /pipeline exploded/,
    );
    expect(lightJson(root)).toBe(before);
    expect(
      readFileSync(join(root, 'tokens/primitive/color.json'), 'utf8'),
    ).toBe(colorBefore);
  });

  it('rebuilds from the restored JSON after a failed rebuild', async () => {
    let calls = 0;
    let seenOnRetry: string | undefined;
    const { root, app } = setup(async () => {
      calls += 1;
      if (calls === 1) throw new Error('pipeline exploded');
      seenOnRetry = lightJson(root);
    });
    const before = lightJson(root);
    const res = await post(app, {
      changes: [
        {
          kind: 'semantic-value',
          tokenName: '--primary',
          theme: 'default',
          mode: 'light',
          newValue: { kind: 'reference', targetName: '--color-violet-700' },
        },
      ],
    });
    expect(res.status).toBe(500);
    expect(((await res.json()) as { error: string }).error).toMatch(
      /pipeline exploded/,
    );
    expect(calls).toBe(2);
    expect(seenOnRetry).toBe(before);
  });

  it('logs and still reports the first error when the retry rebuild fails', async () => {
    const logged = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    try {
      let calls = 0;
      const { root, app } = setup(async () => {
        calls += 1;
        throw new Error(calls === 1 ? 'first failure' : 'retry failure');
      });
      const before = lightJson(root);
      const res = await post(app, {
        changes: [
          {
            kind: 'semantic-value',
            tokenName: '--primary',
            theme: 'default',
            mode: 'light',
            newValue: { kind: 'reference', targetName: '--color-violet-700' },
          },
        ],
      });
      expect(res.status).toBe(500);
      expect(((await res.json()) as { error: string }).error).toMatch(
        /first failure/,
      );
      expect(calls).toBe(2);
      expect(lightJson(root)).toBe(before);
      expect(logged).toHaveBeenCalledTimes(1);
      expect(String(logged.mock.calls[0]?.join(' '))).toMatch(/retry failure/);
    } finally {
      logged.mockRestore();
    }
  });

  it('refuses a request from a foreign origin and allows a local one', async () => {
    const { root, app } = setup(async () => undefined);
    const before = lightJson(root);
    const change = {
      changes: [
        {
          kind: 'semantic-value',
          tokenName: '--primary',
          theme: 'default',
          mode: 'light',
          newValue: { kind: 'reference', targetName: '--color-violet-700' },
        },
      ],
    };
    const foreign = await post(app, change, {
      origin: 'https://evil.example',
    });
    expect(foreign.status).toBe(403);
    expect(foreign.headers.get('access-control-allow-origin')).toBeNull();
    expect(lightJson(root)).toBe(before);

    const local = await app.request('/api/project', {
      headers: { origin: 'http://localhost:5023' },
    });
    expect(local.status).toBe(200);
    expect(local.headers.get('access-control-allow-origin')).toBe(
      'http://localhost:5023',
    );
    const loopback = await app.request('/api/health', {
      headers: { origin: 'http://127.0.0.1:4000' },
    });
    expect(loopback.status).toBe(200);
  });
});
