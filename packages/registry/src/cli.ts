import kleur from 'kleur';

import { generate } from './generate.js';

const [, , command, ...rest] = process.argv;

const subcommand = command ?? 'generate';

if (subcommand === 'generate') {
  // Optional flags: --out, --cwd
  let cwd: string | undefined;
  let outDir: string | undefined;
  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i];
    if (arg === '--cwd') cwd = rest[++i];
    else if (arg === '--out') outDir = rest[++i];
  }

  generate({ cwd, outDir }).catch((err) => {
    console.error(kleur.red('x'), err instanceof Error ? err.message : err);
    process.exit(1);
  });
} else if (subcommand === '--help' || subcommand === '-h') {
  console.log(
    `Usage: gremorie-registry generate [--cwd <path>] [--out <path>]`,
  );
} else {
  console.error(kleur.red('x'), `Unknown command: ${subcommand}`);
  process.exit(1);
}
