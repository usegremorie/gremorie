import { readFileSync } from 'node:fs';

import { Command, CommanderError } from 'commander';
import kleur from 'kleur';

import { addCommand } from './commands/add.js';
import { initCommand } from './commands/init.js';
import { listCommand } from './commands/list.js';
import { getRegistryUrl } from './registry.js';

/** Read the real version from package.json so `-v` never drifts. */
function readVersion(): string {
  try {
    const pkg = JSON.parse(
      readFileSync(new URL('../package.json', import.meta.url), 'utf-8'),
    ) as { version?: string };
    return pkg.version ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
}

const program = new Command();

program
  .name('gremorie')
  .description(
    'Scaffold AI components into your React or Angular app via the Gremorie registry.',
  )
  .version(readVersion(), '-v, --version');

program
  .command('init')
  .description('Set up the Gremorie theme + dependencies in this project.')
  .option('--dry-run', 'Print what would happen without writing anything.')
  .option('-y, --yes', 'Skip confirmation prompts.')
  .action(async (options) => {
    await initCommand(options);
  });

program
  .command('add <components...>')
  .description(
    'Install one or more Gremorie registry items (e.g. rx-button, ng-prompt-input).',
  )
  .option('--dry-run', 'Print what would happen without writing files.')
  .option(
    '--framework <fw>',
    'Framework to install for (ng | rx | vue | sv; angular/react aliases work too). Inferred from the item name prefix or your package.json when omitted.',
  )
  .action(async (components: string[], options) => {
    await addCommand(components, {
      dryRun: options.dryRun,
      framework: options.framework,
    });
  });

program
  .command('list')
  .alias('ls')
  .description('List items available in the registry.')
  .action(async () => {
    await listCommand();
  });

program
  .configureHelp({
    sortSubcommands: false,
  })
  .addHelpText(
    'after',
    `
${kleur.dim('Registry URL:')}
  ${kleur.cyan(getRegistryUrl())}
  ${kleur.dim('(override with GREMORIE_REGISTRY_URL)')}

${kleur.dim('Examples:')}
  ${kleur.cyan('gremorie init')}                         Set up theme and deps
  ${kleur.cyan('gremorie add rx-button')}                Install the React Button
  ${kleur.cyan('gremorie add ng-prompt-input')}          Install the Angular PromptInput primitive
  ${kleur.cyan('gremorie add ng-area-chart')}            Install the Angular Area Chart (pulls ng-chart)
  ${kleur.cyan('gremorie add rx-badge rx-card')}         Install several items at once
  ${kleur.cyan('gremorie list')}                         See what is available
`,
  );

// Make usage errors (unknown command, missing argument, bad option) exit
// non-zero instead of relying on default behaviour. Help/version exit 0.
program.exitOverride();

program.parseAsync(process.argv).catch((err) => {
  if (err instanceof CommanderError) {
    // Commander already printed its message (help, version, or usage error).
    process.exit(err.exitCode === 0 ? 0 : err.exitCode || 1);
  }
  console.error(kleur.red('x'), err instanceof Error ? err.message : err);
  process.exit(1);
});
