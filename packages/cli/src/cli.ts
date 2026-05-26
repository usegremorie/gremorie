import { Command } from 'commander';
import kleur from 'kleur';

import { addCommand } from './commands/add.js';
import { initCommand } from './commands/init.js';
import { listCommand } from './commands/list.js';

const program = new Command();

program
  .name('gremorie')
  .description('Scaffold AI components into your Angular app.')
  .version('0.0.1', '-v, --version');

program
  .command('init')
  .description('Set up the Gremorie NG theme + dependencies in this project.')
  .option('--dry-run', 'Print what would happen without writing anything.')
  .option('-y, --yes', 'Skip confirmation prompts.')
  .action(async (options) => {
    await initCommand(options);
  });

program
  .command('add <component>')
  .description('Install a Gremorie NG component (e.g. prompt-input).')
  .option('--dry-run', 'Print what would happen without installing.')
  .action(async (component: string, options) => {
    await addCommand(component, options);
  });

program
  .command('list')
  .alias('ls')
  .description('List available components and what is coming soon.')
  .action(() => {
    listCommand();
  });

program
  .configureHelp({
    sortSubcommands: false,
  })
  .addHelpText(
    'after',
    `
${kleur.dim('Examples:')}
  ${kleur.cyan('gremorie init')}                Set up tokens and core deps
  ${kleur.cyan('gremorie add prompt-input')}    Install the PromptInput family
  ${kleur.cyan('gremorie list')}                See what is shipping and what is planned
`,
  );

program.parseAsync(process.argv).catch((err) => {
  console.error(kleur.red('✗'), err instanceof Error ? err.message : err);
  process.exit(1);
});
