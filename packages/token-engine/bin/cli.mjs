#!/usr/bin/env node
import { resolve } from "node:path";
import { serve } from "@hono/node-server";
import open from "open";
import { createApp } from "../dist/server/app.js";
import { detectShadcnProject } from "../dist/project/detect.js";

const target = process.argv[2] ?? process.cwd();
const projectRoot = resolve(target);
const project = detectShadcnProject(projectRoot);

if (!project) {
  console.error(`✗ Not a shadcn project: ${projectRoot}`);
  console.error("  Looking for components.json with tailwind.css path.");
  process.exit(1);
}

const app = createApp({
  projectRoot: project.root,
  globalsCss: project.globalsCss
});

const PORT = 5024;
serve({ fetch: app.fetch, port: PORT }, (info) => {
  const url = `http://localhost:5023/`;
  console.log(`▶ Tokens — serving project: ${project.root}`);
  console.log(`▶ Engine API: http://localhost:${info.port}`);
  console.log(`▶ Editor UI: ${url} (run \`pnpm dev:tokens\` in another terminal)`);
  open(url).catch(() => {});
});
