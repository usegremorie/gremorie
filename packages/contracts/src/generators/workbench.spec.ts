import { describe, it, expect } from 'vitest';
import { toWorkbenchEntry, workbenchManifest } from './workbench';
import { chartArtifact } from '../index';
import type { ComponentContract } from '../types';

describe('toWorkbenchEntry', () => {
  const entry = toWorkbenchEntry(chartArtifact);

  it('derives controls from props (enum->select, string->text), excluding complex/adapts', () => {
    const type = entry.controls.find((c) => c.name === 'type');
    expect(type?.kind).toBe('select');
    expect(type?.options).toContain('bar');

    const title = entry.controls.find((c) => c.name === 'title');
    expect(title?.kind).toBe('text');

    // Complex data props and adapts props are not controls.
    expect(entry.controls.find((c) => c.name === 'data')).toBeUndefined();
    expect(entry.controls.find((c) => c.name === 'valueKey')).toBeUndefined();
    expect(entry.controls.find((c) => c.name === 'className')).toBeUndefined();
  });

  it('carries preview ids and per-framework commands', () => {
    expect(entry.preview.ng).toBe('ai-code-chart--workbench');
    expect(entry.commands.rx.registry).toContain('rx-chart-artifact');
    expect(entry.commands.ng.npm).toContain('@gremorie/ng-artifacts');
  });

  it('includes the prop rows and guidance', () => {
    expect(entry.props.length).toBe(chartArtifact.props.length);
    expect(entry.guidance.whenNotToUse?.length).toBeGreaterThan(0);
  });
});

describe('buildCommands category-to-package mapping', () => {
  const base: Omit<ComponentContract, 'name' | 'category'> = {
    anatomy: '<x>',
    props: [],
    guidance: { summary: 'x', whenToUse: [] },
  };
  const entryFor = (category: string) =>
    toWorkbenchEntry({ ...base, name: 'x', category } as ComponentContract);

  it('maps every category to the real bundle package that exports it', () => {
    const cases: Record<string, { rx: string; ng: string }> = {
      artifacts: { rx: '@gremorie/rx-artifacts', ng: '@gremorie/ng-artifacts' },
      data: { rx: '@gremorie/rx-data', ng: '@gremorie/ng-data' },
      chatbot: { rx: '@gremorie/rx-ai', ng: '@gremorie/ng-ai' },
      display: { rx: '@gremorie/rx-display', ng: '@gremorie/ng-display' },
      feedback: { rx: '@gremorie/rx-feedback', ng: '@gremorie/ng-feedback' },
      forms: { rx: '@gremorie/rx-forms', ng: '@gremorie/ng-forms' },
      containers: {
        rx: '@gremorie/rx-containers',
        ng: '@gremorie/ng-containers',
      },
      overlays: { rx: '@gremorie/rx-overlays', ng: '@gremorie/ng-overlays' },
      navigation: {
        rx: '@gremorie/rx-navigation',
        ng: '@gremorie/ng-navigation',
      },
      utilities: { rx: '@gremorie/rx-ai', ng: '@gremorie/ng-ai' },
    };
    for (const [category, pkgs] of Object.entries(cases)) {
      const entry = entryFor(category);
      expect(entry.commands.rx.npm).toBe(`npm i ${pkgs.rx}`);
      expect(entry.commands.ng.npm).toBe(`npm i ${pkgs.ng}`);
    }
  });

  it('blocks use the registry block-* item for React and the ng-ai package for Angular', () => {
    const entry = entryFor('blocks');
    expect(entry.commands.rx.registry).toBe('npx gremorie add block-x');
    expect(entry.commands.rx.npm).toBe('npm i @gremorie/rx-ai');
    expect(entry.commands.ng.registry).toBe('npm i @gremorie/ng-ai');
  });
});

describe('ng registry gate (ngRegistryItems)', () => {
  const contractFor = (name: string, category = 'forms'): ComponentContract =>
    ({
      name,
      category,
      anatomy: `<${name}>`,
      props: [],
      guidance: { summary: 'x', whenToUse: [] },
    }) as ComponentContract;

  it('without the option, always emits the ng registry command (historical behavior)', () => {
    const entry = toWorkbenchEntry(contractFor('button'));
    expect(entry.commands.ng.registry).toBe('npx gremorie add ng-button');
  });

  it('emits the ng registry command when the item exists in the set', () => {
    const entry = toWorkbenchEntry(contractFor('button'), {
      ngRegistryItems: new Set(['ng-button', 'ng-badge']),
    });
    expect(entry.commands.ng.registry).toBe('npx gremorie add ng-button');
    expect(entry.commands.ng.npm).toBe('npm i @gremorie/ng-forms');
  });

  it('degrades to the npm install when the ng item is missing from the set', () => {
    const entry = toWorkbenchEntry(contractFor('button'), {
      ngRegistryItems: new Set(['ng-badge']),
    });
    // Registry command replaced by the npm command: the workbench UI collapses
    // the two equal lines into a single npm line.
    expect(entry.commands.ng.registry).toBe('npm i @gremorie/ng-forms');
    expect(entry.commands.ng.registry).toBe(entry.commands.ng.npm);
  });

  it('never gates the React registry command', () => {
    const entry = toWorkbenchEntry(contractFor('button'), {
      ngRegistryItems: new Set<string>(),
    });
    expect(entry.commands.rx.registry).toBe('npx gremorie add rx-button');
  });

  it('leaves blocks untouched (ng already ships via the package)', () => {
    const entry = toWorkbenchEntry(contractFor('assistant', 'blocks'), {
      ngRegistryItems: new Set<string>(),
    });
    expect(entry.commands.ng.registry).toBe('npm i @gremorie/ng-ai');
  });

  it('workbenchManifest forwards the options to every entry', () => {
    const entries = workbenchManifest(
      [contractFor('button'), contractFor('input')],
      { ngRegistryItems: new Set(['ng-input']) },
    );
    expect(entries[0]?.commands.ng.registry).toBe('npm i @gremorie/ng-forms');
    expect(entries[1]?.commands.ng.registry).toBe('npx gremorie add ng-input');
  });
});

describe('toWorkbenchEntry control overrides and demo controls', () => {
  const contract: ComponentContract = {
    name: 'sample',
    category: 'forms',
    anatomy: '<sample>',
    props: [
      {
        name: 'state',
        type: 'string',
        options: ['ready', 'streaming'],
        default: 'ready',
        adapts: { rx: 'status on submit' },
        control: true,
      },
      { name: 'disabled', type: 'boolean', default: false, control: false },
      { name: 'label', type: 'string', default: 'hi' },
    ],
    guidance: { summary: 'sample', whenToUse: [] },
    demo: [
      {
        name: 'voice',
        type: 'boolean',
        default: true,
        desc: 'Composition demo toggle: show the voice button.',
      },
      {
        name: 'note',
        type: 'string',
        default: 'demo',
        desc: 'Composition demo text.',
      },
    ],
  };
  const entry = toWorkbenchEntry(contract);

  it('control: true includes a prop even when adapts is present', () => {
    const state = entry.controls.find((c) => c.name === 'state');
    expect(state?.kind).toBe('select');
    expect(state?.options).toContain('streaming');
    expect(state?.demo).toBeUndefined();
  });

  it('control: false always excludes the prop', () => {
    expect(entry.controls.find((c) => c.name === 'disabled')).toBeUndefined();
  });

  it('appends demo controls after the prop controls, flagged as demo', () => {
    const names = entry.controls.map((c) => c.name);
    expect(names).toEqual(['state', 'label', 'voice', 'note']);

    const voice = entry.controls.find((c) => c.name === 'voice');
    expect(voice?.kind).toBe('toggle');
    expect(voice?.default).toBe(true);
    expect(voice?.demo).toBe(true);
    expect(voice?.desc).toContain('demo toggle');

    const note = entry.controls.find((c) => c.name === 'note');
    expect(note?.kind).toBe('text');
    expect(note?.demo).toBe(true);
  });

  it('keeps demo controls out of the docs prop rows', () => {
    expect(entry.props.map((p) => p.name)).toEqual([
      'state',
      'disabled',
      'label',
    ]);
  });
});
