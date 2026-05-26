import { Hono } from "hono";
import { cors } from "hono/cors";
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import { parseCssFile } from "../parsers/css/parse-css-file.js";
import { scanProjectComponents } from "../parsers/ts/scan-project.js";
import type { TokenGraph } from "../graph/types.js";
import { applyChanges, type Change } from "../serializer/apply-changes.js";
import { gitStatus } from "../git/status.js";

export interface AppConfig {
  projectRoot: string;
  globalsCss: string;
}

export function createApp(cfg: AppConfig) {
  const app = new Hono();
  app.use("*", cors());

  app.get("/api/health", (c) => c.json({ ok: true }));

  app.get("/api/git-status", (c) => c.json(gitStatus(cfg.projectRoot)));

  app.get("/api/project", (c) => {
    const cssPath = join(cfg.projectRoot, cfg.globalsCss);
    const css = readFileSync(cssPath, "utf8");
    const baseGraph = parseCssFile(css, cfg.globalsCss);
    const components = scanProjectComponents(cfg.projectRoot);
    const graph: TokenGraph = {
      ...baseGraph,
      components: Object.fromEntries(components.map(comp => [comp.name, comp]))
    };
    return c.json({
      project: { root: cfg.projectRoot, globalsCss: cfg.globalsCss },
      graph
    });
  });

  app.post("/api/apply", async (c) => {
    const body = await c.req.json() as { changes: Change[] };
    const cssPath = join(cfg.projectRoot, cfg.globalsCss);
    const css = readFileSync(cssPath, "utf8");
    const next = applyChanges(css, cfg.globalsCss, body.changes);
    writeFileSync(cssPath, next);
    return c.json({ written: cfg.globalsCss, changeCount: body.changes.length });
  });

  return app;
}
