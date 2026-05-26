import { execSync } from 'node:child_process';

import kleur from 'kleur';

import { findEntry, REGISTRY } from '../registry.js';
import {
  detectPackageManager,
  installCommand,
} from '../lib/package-manager.js';

export interface AddOptions {
  dryRun?: boolean;
}

export async function addCommand(
  name: string,
  options: AddOptions = {},
): Promise<void> {
  const cwd = process.cwd();
  console.log();
  console.log(kleur.bold().cyan(`gremorie add ${name}`));
  console.log();

  const entry = findEntry(name);
  if (!entry) {
    console.log(kleur.red('✗'), `Unknown component: "${name}"`);
    console.log();
    console.log(kleur.dim('Available components:'));
    for (const item of REGISTRY) {
      const status = item.available ? kleur.green('●') : kleur.yellow('○');
      console.log(`  ${status} ${item.name}`);
    }
    console.log();
    process.exit(1);
  }

  if (!entry.available) {
    console.log(
      kleur.yellow('⚠'),
      `"${name}" is planned for v0.${entry.phase} and not yet available.`,
    );
    console.log(kleur.dim('Run'), kleur.cyan('gremorie list'), kleur.dim('to see what ships today.'));
    console.log();
    process.exit(1);
  }

  const pm = detectPackageManager(cwd);
  const packages = [entry.pkg, ...(entry.depends ?? [])];
  const cmd = installCommand(pm, packages);

  if (options.dryRun) {
    console.log(kleur.yellow('→'), kleur.dim(`would run: ${cmd}`));
    return;
  }

  console.log(kleur.cyan('→'), `running: ${cmd}`);
  try {
    execSync(cmd, { cwd, stdio: 'inherit' });
  } catch {
    console.log(kleur.red('✗'), 'Install failed — fix the error above and re-run.');
    process.exit(1);
  }

  console.log();
  console.log(kleur.green('✓'), `Installed ${kleur.bold(entry.pkg)}.`);
  console.log();
  console.log(kleur.dim('Next step — import in your component:'));
  console.log();
  if (entry.name === 'prompt-input') {
    console.log(kleur.cyan(`  import {`));
    console.log(kleur.cyan(`    PromptInput,`));
    console.log(kleur.cyan(`    PromptInputTextarea,`));
    console.log(kleur.cyan(`    PromptInputSubmit,`));
    console.log(kleur.cyan(`    PromptInputToolbar,`));
    console.log(kleur.cyan(`  } from '${entry.pkg}';`));
  } else if (entry.name === 'core') {
    console.log(kleur.cyan(`  import { Button, cn } from '${entry.pkg}';`));
  } else if (entry.name === 'attachments') {
    console.log(kleur.cyan(`  import {`));
    console.log(kleur.cyan(`    AttachmentList,`));
    console.log(kleur.cyan(`    AttachmentItem,`));
    console.log(kleur.cyan(`    AttachmentPreview,`));
    console.log(kleur.cyan(`    AttachmentInfo,`));
    console.log(kleur.cyan(`    AttachmentRemove,`));
    console.log(kleur.cyan(`  } from '${entry.pkg}';`));
  }
  console.log();
  console.log(
    kleur.dim('Docs:'),
    kleur.cyan(`https://gremorie.com/docs/components/${entry.name}`),
  );
  console.log();
}
