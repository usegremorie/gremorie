import kleur from 'kleur';

import { REGISTRY } from '../registry.js';

export function listCommand(): void {
  const available = REGISTRY.filter((entry) => entry.available);
  const upcoming = REGISTRY.filter((entry) => !entry.available);

  console.log();
  console.log(kleur.bold().white('Available now'));
  console.log(kleur.dim('━'.repeat(50)));
  for (const entry of available) {
    const name = kleur.cyan(entry.name.padEnd(16));
    const pkg = kleur.dim(entry.pkg);
    console.log(`  ${name}${pkg}`);
    console.log(`  ${' '.repeat(16)}${kleur.dim(entry.description)}`);
  }

  if (upcoming.length > 0) {
    console.log();
    console.log(kleur.bold().white('Coming soon'));
    console.log(kleur.dim('━'.repeat(50)));
    for (const entry of upcoming) {
      const name = kleur.gray(entry.name.padEnd(16));
      const phase = kleur.yellow(`v0.${entry.phase}`);
      console.log(`  ${name}${phase}`);
      console.log(`  ${' '.repeat(16)}${kleur.dim(entry.description)}`);
    }
  }

  console.log();
  console.log(
    kleur.dim('Install one with:') +
      ' ' +
      kleur.cyan('gremorie add <name>'),
  );
  console.log();
}
