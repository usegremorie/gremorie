import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

import kleur from 'kleur';

import { detectAngular, readPackageJsonDependencies } from '../lib/angular-detect.js';
import {
  detectPackageManager,
  installCommand,
} from '../lib/package-manager.js';

const THEME_IMPORT_LINE = "@import '@gremorie/ng-core/theme.css';";

export interface InitOptions {
  dryRun?: boolean;
  yes?: boolean;
}

export async function initCommand(options: InitOptions = {}): Promise<void> {
  const cwd = process.cwd();
  console.log();
  console.log(kleur.bold().cyan('gremorie init'));
  console.log(kleur.dim(`Working dir: ${cwd}`));
  console.log();

  // 1. Detect Angular
  const ctx = detectAngular(cwd);
  if (!ctx.isAngular) {
    console.log(
      kleur.yellow('⚠'),
      kleur.dim(
        'No angular.json / workspace.json / nx.json detected. Continuing anyway — make sure this is the right directory.',
      ),
    );
  } else {
    console.log(
      kleur.green('✓'),
      kleur.dim(`Detected workspace file: ${ctx.workspaceFile}`),
    );
  }

  // 2. Detect package manager
  const pm = detectPackageManager(cwd);
  console.log(kleur.green('✓'), kleur.dim(`Package manager: ${pm}`));

  // 3. Plan deps to install
  const deps = readPackageJsonDependencies(cwd);
  const needs: string[] = [];
  if (!deps['@gremorie/ng-core']) needs.push('@gremorie/ng-core');
  if (!deps['class-variance-authority']) needs.push('class-variance-authority');
  if (!deps['clsx']) needs.push('clsx');
  if (!deps['tailwind-merge']) needs.push('tailwind-merge');

  if (needs.length === 0) {
    console.log(
      kleur.green('✓'),
      kleur.dim('Core dependencies already installed.'),
    );
  } else {
    const cmd = installCommand(pm, needs);
    if (options.dryRun) {
      console.log(kleur.yellow('→'), kleur.dim(`would run: ${cmd}`));
    } else {
      console.log(kleur.cyan('→'), `running: ${cmd}`);
      try {
        execSync(cmd, { cwd, stdio: 'inherit' });
        console.log(kleur.green('✓'), kleur.dim('Installed dependencies.'));
      } catch {
        console.log(
          kleur.red('✗'),
          'Install failed — fix the error above and re-run.',
        );
        process.exit(1);
      }
    }
  }

  // 4. Theme import in root styles
  if (!ctx.rootStylesPath) {
    console.log(
      kleur.yellow('⚠'),
      kleur.dim(
        'No src/styles.css (or .scss/global) found. Add this line to your global stylesheet manually:',
      ),
    );
    console.log(kleur.cyan(`  ${THEME_IMPORT_LINE}`));
  } else {
    const stylesPath = join(cwd, ctx.rootStylesPath);
    const current = readFileSync(stylesPath, 'utf-8');
    if (current.includes("@gremorie/ng-core/theme.css")) {
      console.log(
        kleur.green('✓'),
        kleur.dim(`Theme import already in ${ctx.rootStylesPath}.`),
      );
    } else if (options.dryRun) {
      console.log(
        kleur.yellow('→'),
        kleur.dim(`would prepend to ${ctx.rootStylesPath}:`),
      );
      console.log(kleur.cyan(`  ${THEME_IMPORT_LINE}`));
    } else {
      const next = `${THEME_IMPORT_LINE}\n${current}`;
      writeFileSync(stylesPath, next);
      console.log(
        kleur.green('✓'),
        kleur.dim(
          `Added theme import to ${ctx.rootStylesPath} (top of file).`,
        ),
      );
    }
  }

  // 5. Done
  console.log();
  console.log(kleur.bold().green('✓ Setup complete.'));
  console.log();
  console.log(kleur.dim('Next step — install a component:'));
  console.log(`  ${kleur.cyan('gremorie add prompt-input')}`);
  console.log();

  if (existsSync(join(cwd, 'angular.json')) === false && !ctx.isAngular) {
    console.log(
      kleur.dim(
        'Note: theme.css uses Tailwind CSS v4. If your project does not have Tailwind installed, run:',
      ),
    );
    console.log(`  ${kleur.cyan(installCommand(pm, ['tailwindcss', '@tailwindcss/postcss'], { saveDev: true }))}`);
    console.log();
  }
}
