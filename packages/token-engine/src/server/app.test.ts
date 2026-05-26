import { describe, it, expect } from "vitest";
import { createApp } from "./app.js";
import { join } from "node:path";
import { mkdirSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";

describe("server app", () => {
  it("GET /api/health returns ok", async () => {
    const dir = join(tmpdir(), "tokens-srv-" + Date.now());
    mkdirSync(dir, { recursive: true });
    const app = createApp({ projectRoot: dir, globalsCss: "globals.css" });
    const res = await app.request("/api/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    rmSync(dir, { recursive: true, force: true });
  });

  it("GET /api/project returns parsed graph", async () => {
    const dir = join(tmpdir(), "tokens-srv-" + Date.now());
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "globals.css"),
      `@theme { --color-gray-50: oklch(0.98 0 0); }
       :root { --background: var(--color-gray-50); }`
    );

    const app = createApp({ projectRoot: dir, globalsCss: "globals.css" });
    const res = await app.request("/api/project");
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.graph.primitives).toBeDefined();
    expect(Object.keys(body.graph.primitives)).toHaveLength(1);
    rmSync(dir, { recursive: true, force: true });
  });

  it("POST /api/apply updates globals.css", async () => {
    const dir = join(tmpdir(), "tokens-srv-" + Date.now());
    mkdirSync(dir, { recursive: true });
    const cssPath = join(dir, "globals.css");
    writeFileSync(cssPath,
      `@theme { --color-gray-50: oklch(0.98 0 0); }`
    );

    const app = createApp({ projectRoot: dir, globalsCss: "globals.css" });
    const res = await app.request("/api/apply", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ changes: [
        { kind: "primitive-value", tokenName: "--color-gray-50", newValue: "oklch(0.99 0 0)" }
      ]})
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect((body as any).written).toBe("globals.css");

    const updated = readFileSync(cssPath, "utf8");
    expect(updated).toContain("oklch(0.99 0 0)");
    rmSync(dir, { recursive: true, force: true });
  });
});
