import { Hono } from 'hono';
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

export function createApp(cfg: AppConfig) {
  const app = new Hono();
  app.use('*', cors());

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

  app.post('/api/apply', async (c) => {
    const body = (await c.req.json()) as { changes: Change[] };
    if (cfg.source === 'dtcg') {
      const texts = Object.fromEntries(
        listDtcgFiles(cfg.tokensDir).map((rel) => [
          rel,
          readFileSync(join(cfg.tokensDir, rel), 'utf8'),
        ]),
      );
      let changed: Record<string, string>;
      try {
        changed = applyDtcgChanges(texts, body.changes);
      } catch (error) {
        if (error instanceof DtcgChangeError) {
          return c.json({ error: error.message }, 400);
        }
        throw error;
      }
      for (const [rel, text] of Object.entries(changed)) {
        const target = join(cfg.tokensDir, rel);
        const config = (await resolveConfig(target)) ?? {};
        writeFileSync(
          target,
          await format(text, { ...config, parser: 'json' }),
        );
      }
      await cfg.rebuild();
      return c.json({
        written: Object.keys(changed).join(', '),
        changeCount: body.changes.length,
      });
    }
    const cssPath = join(cfg.projectRoot, cfg.globalsCss);
    const css = readFileSync(cssPath, 'utf8');
    const next = applyChanges(css, cfg.globalsCss, body.changes);
    writeFileSync(cssPath, next);
    return c.json({
      written: cfg.globalsCss,
      changeCount: body.changes.length,
    });
  });

  return app;
}
