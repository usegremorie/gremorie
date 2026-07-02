import { describe, it, expect } from 'vitest';
import { toPropRows } from './props-table';
import { chartArtifact } from '../index';

describe('toPropRows', () => {
  it('maps props to display rows with defaults and enum options', () => {
    const rows = toPropRows(chartArtifact);
    const type = rows.find((r) => r.name === 'type')!;
    expect(type.type).toContain("'bar'");
    expect(type.type).toContain('|');
    expect(type.default).toBe("'bar'");

    const data = rows.find((r) => r.name === 'data')!;
    expect(data.required).toBe(true);
    expect(data.default).toBe('-');

    const fileName = rows.find((r) => r.name === 'fileName')!;
    expect(fileName.default).toBe("'chart'");
  });
});
