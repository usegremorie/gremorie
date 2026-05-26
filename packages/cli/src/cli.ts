import { Command } from 'commander';
import kleur from 'kleur';

import { addCommand } from './commands/add.js';
import { initCommand } from './commands/init.js';
import { listCommand } from './commands/list.js';
import { getRegistryUrl } from './registry.js';

const program = new Command();

program
  .name('gremorie')
  .description('Scaffold AI components into your Angular app via the Gremorie registry.')
  .version('0.0.1', '-v, --version');

program
  .command('init')
  .description('Set up the Gremorie theme + dependencies in this project.')
  .option('--dry-run', 'Print what would happen without writing anything.')
  .option('-y, --yes', 'Skip confirmation prompts.')
  .action(async (options) => {
    await initCommand(options);
  });

program
  .command('add <component>')
  .description('Install a Gremorie registry item (e.g. ng-prompt-input).')
  .option('--dry-run', 'Print what would happen without writing files.')
  .option('--framework <fw>', 'Framework to install for (ng | react | vue).', 'ng')
  .action(async (component: string, options) => {
    await addCommand(component, {
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
  ${kleur.cyan('gremorie init')}                    Set up theme and deps
  ${kleur.cyan('gremorie add ng-prompt-input')}     Install the PromptInput family
  ${kleur.cyan('gremorie list')}                    See what is available
`,
  );

program.parseAsync(process.argv).catch((err) => {
  console.error(kleur.red('x'), err instanceof Error ? err.message : err);
  process.exit(1);
});
