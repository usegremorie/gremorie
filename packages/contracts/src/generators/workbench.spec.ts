import { describe, it, expect } from 'vitest';
import { toWorkbenchEntry } from './workbench';
import { chartArtifact } from '../index';

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
    expect(entry.preview.ng).toBe('artifacts-chartartifact--bar');
    expect(entry.commands.rx.registry).toContain('rx-chart-artifact');
    expect(entry.commands.ng.npm).toContain('@gremorie/ng-artifacts');
  });

  it('includes the prop rows and guidance', () => {
    expect(entry.props.length).toBe(chartArtifact.props.length);
    expect(entry.guidance.whenNotToUse?.length).toBeGreaterThan(0);
  });
});
