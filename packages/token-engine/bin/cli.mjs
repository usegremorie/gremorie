#!/usr/bin/env node
import { execFile } from 'node:child_process';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';
import { serve } from '@hono/node-server';
import open from 'open';
import { createApp } from '../dist/server/app.js';
import {
  detectDtcgProject,
  detectRegistryProject,
} from '../dist/project/detect.js';

const args = process.argv.slice(2);
const noOpen = args.includes('--no-open');
const target = args.find((a) => !a.startsWith('--')) ?? process.cwd();
const projectRoot = resolve(target);
const run = promisify(execFile);

let app;
const dtcg = detectDtcgProject(projectRoot);
if (dtcg) {
  app = createApp({
    projectRoot: dtcg.root,
    source: 'dtcg',
    tokensDir: dtcg.tokensDir,
    rebuild: async () => {
      await run(
        process.execPath,
        [join(dtcg.packageDir, 'pipeline', 'build.ts')],
        { cwd: dtcg.packageDir },
      );
    },
  });
  console.log(`> Tokens - DTCG source: ${dtcg.tokensDir}`);
} else {
  const project = detectRegistryProject(projectRoot);
  if (!project) {
    console.error(
      `x Not a Gremorie or registry-compatible project: ${projectRoot}`,
    );
    console.error('  Looking for packages/tokens/tokens or components.json.');
    process.exit(1);
  }
  app = createApp({
    projectRoot: project.root,
    globalsCss: project.globalsCss,
  });
  console.log(`> Tokens - serving project: ${project.root}`);
}

const PORT = 5024;
serve({ fetch: app.fetch, port: PORT }, (info) => {
  const url = 'http://localhost:5023/';
  console.log(`> Engine API: http://localhost:${info.port}`);
  console.log(
    `> Editor UI: ${url} (run \`nx serve tokens-atlas\` in another terminal)`,
  );
  // Opening a browser is a convenience; the server runs either way.
  if (!noOpen) open(url).catch(() => undefined);
});
