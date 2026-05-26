import kleur from 'kleur';

import { createRegistryClient } from '../registry.js';

export async function listCommand(): Promise<void> {
  const client = createRegistryClient();

  console.log();
  console.log(kleur.bold().cyan('gremorie list'));
  console.log(kleur.dim(`  registry: ${client.baseUrl}`));
  console.log();

  let index;
  try {
    index = await client.fetchIndex();
  } catch (err) {
    console.error(
      kleur.red('x'),
      err instanceof Error ? err.message : String(err),
    );
    process.exit(1);
  }

  if (index.items.length === 0) {
    console.log(kleur.yellow('No items found in the registry.'));
    console.log();
    return;
  }

  console.log(kleur.bold().white('Available items'));
  console.log(kleur.dim('-'.repeat(60)));
  for (const item of index.items) {
    const name = kleur.cyan(item.name.padEnd(20));
    const framework = kleur.gray(`[${item.framework}]`);
    console.log(`  ${name}${framework}`);
    console.log(`  ${' '.repeat(20)}${kleur.dim(item.description)}`);
    if (item.registryDependencies.length > 0) {
      console.log(
        `  ${' '.repeat(20)}${kleur.dim(
          `depends on: ${item.registryDependencies.join(', ')}`,
        )}`,
      );
    }
  }

  console.log();
  console.log(
    kleur.dim('Install one with:'),
    kleur.cyan('gremorie add <name>'),
  );
  console.log();
}
