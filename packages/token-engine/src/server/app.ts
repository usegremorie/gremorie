import { Hono, type Context } from 'hono';
import { cors } from 'hono/cors';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { format, resolveConfig } from 'prettier';
import { parseCssFile } from '../parsers/css/parse-css-file.js';
import {
  buildDtcgGraph,
  listDtcgFiles,
  readDtcgFiles,
} from '../parsers/dtcg/load-dtcg.js';
import { scanProjectComponents } from '../parsers/ts/scan-project.js';
import type { TokenGraph } from '../graph/types.js';
import { applyChanges, type Change } from '../serializer/apply-changes.js';
import {
  applyDtcgChanges,
  DtcgChangeError,
} from '../serializer/apply-dtcg-changes.js';
import { gitStatus } from '../git/status.js';

export type AppConfig =
  | { projectRoot: string; globalsCss: string; source?: 'css' }
  | {
      projectRoot: string;
      source: 'dtcg';
      tokensDir: string;
      /** Regenerates styles/ (and dist/) from the JSON after a write. */
      rebuild: () => Promise<void>;
    };

/** The editor runs on this machine; only pages served from it may call us. */
const LOCAL_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
/** A Host header naming this machine, on any port. */
const LOCAL_HOST = /^(localhost|127\.0\.0\.1)(:\d+)?$/;

export function createApp(cfg: AppConfig) {
  const app = new Hono();
  // A page on another site could rebind its own hostname to 127.0.0.1 and
  // then pass the origin check: refuse any Host that does not name this
  // machine, whatever the port.
  app.use('*', async (c, next) => {
    const host = c.req.header('host') ?? new URL(c.req.url).host;
    if (!LOCAL_HOST.test(host)) {
      return c.json({ error: `Host not allowed: ${host}` }, 403);
    }
    await next();
  });
  // The server writes files and runs a build, so a page from another site
  // must not reach it: refuse foreign origins outright, not only via CORS.
  app.use('*', async (c, next) => {
    const origin = c.req.header('origin');
    if (origin !== undefined && !LOCAL_ORIGIN.test(origin)) {
      return c.json({ error: `Origin not allowed: ${origin}` }, 403);
    }
    await next();
  });
  app.use(
    '*',
    cors({ origin: (origin) => (LOCAL_ORIGIN.test(origin) ? origin : null) }),
  );

  app.get('/api/health', (c) => c.json({ ok: true }));

  app.get('/api/git-status', (c) => c.json(gitStatus(cfg.projectRoot)));

  app.get('/api/project', (c) => {
    if (cfg.source === 'dtcg') {
      return c.json({
        project: {
          root: cfg.projectRoot,
          globalsCss: relative(cfg.projectRoot, cfg.tokensDir),
          source: 'dtcg',
        },
        graph: buildDtcgGraph(readDtcgFiles(cfg.tokensDir)),
      });
    }
    const cssPath = join(cfg.projectRoot, cfg.globalsCss);
    const css = readFileSync(cssPath, 'utf8');
    const baseGraph = parseCssFile(css, cfg.globalsCss);
    const components = scanProjectComponents(cfg.projectRoot);
    const graph: TokenGraph = {
      ...baseGraph,
      components: Object.fromEntries(
        components.map((comp) => [comp.name, comp]),
      ),
    };
    return c.json({
      project: { root: cfg.projectRoot, globalsCss: cfg.globalsCss },
      graph,
    });
  });

  // One apply at a time: each reads the files, writes them and rebuilds, so
  // two at once would lose an edit or run two builds over the same output.
  let applying: Promise<unknown> = Promise.resolve();
  app.post('/api/apply', (c) => {
    const result = applying.then(() => apply(c));
    applying = result.catch(() => undefined);
    return result;
  });

  const apply = async (c: Context) => {
    const body = (await c.req.json()) as { changes?: unknown };
    if (!Array.isArray(body.changes)) {
      return c.json({ error: 'changes must be a list' }, 400);
    }
    const changes = body.changes as Change[];
    if (cfg.source === 'dtcg') {
      const texts = Object.fromEntries(
        listDtcgFiles(cfg.tokensDir).map((rel) => [
          rel,
          readFileSync(join(cfg.tokensDir, rel), 'utf8'),
        ]),
      );
      let changed: Record<string, string>;
      try {
        changed = applyDtcgChanges(texts, changes);
      } catch (error) {
        if (error instanceof DtcgChangeError) {
          return c.json({ error: error.message }, 400);
        }
        throw error;
      }
      // Format everything first, so a Prettier failure writes nothing.
      const formatted: [string, string][] = [];
      for (const [rel, text] of Object.entries(changed)) {
        const target = join(cfg.tokensDir, rel);
        const config = (await resolveConfig(target)) ?? {};
        formatted.push([
          target,
          await format(text, { ...config, parser: 'json' }),
        ]);
      }
      try {
        for (const [target, text] of formatted) writeFileSync(target, text);
        await cfg.rebuild();
      } catch (error) {
        // Put the source back as it was: the JSON and the CSS must agree.
        for (const [rel] of Object.entries(changed)) {
          const original = texts[rel];
          if (original !== undefined) {
            writeFileSync(join(cfg.tokensDir, rel), original);
          }
        }
        // The failed build may have left styles/ half written: build again
        // from the restored JSON. Best effort, the first error is the answer.
        try {
          await cfg.rebuild();
        } catch (retryError) {
          console.error(
            'Rebuild from the restored tokens also failed:',
            (retryError as Error).message,
          );
        }
        return c.json({ error: (error as Error).message }, 500);
      }
      return c.json({
        written: Object.keys(changed).join(', '),
        changeCount: changes.length,
      });
    }
    const cssPath = join(cfg.projectRoot, cfg.globalsCss);
    const css = readFileSync(cssPath, 'utf8');
    const next = applyChanges(css, cfg.globalsCss, changes);
    writeFileSync(cssPath, next);
    return c.json({
      written: cfg.globalsCss,
      changeCount: changes.length,
    });
  };

  return app;
}
