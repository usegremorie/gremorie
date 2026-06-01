import { describe, it, expect } from 'vitest';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Project } from 'ts-morph';
import { extractCvaFromFile } from './cva.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('extractCvaFromFile', () => {
  it('extracts variants, defaults, base classes, and classes per variant', () => {
    const project = new Project({ useInMemoryFileSystem: false });
    const file = project.addSourceFileAtPath(
      join(__dirname, '__fixtures__/button.tsx'),
    );
    const result = extractCvaFromFile(file, 'Button');

    expect(result).toBeDefined();
    expect(result!.baseClasses).toContain('inline-flex');
    expect(result!.variants.variant).toEqual(['default', 'outline', 'ghost']);
    expect(result!.variants.size).toEqual(['default', 'sm', 'lg']);
    expect(result!.defaultVariants).toEqual({
      variant: 'default',
      size: 'default',
    });
    expect(result!.classesByVariant['variant']!['default']).toContain(
      'bg-primary',
    );
    expect(result!.classesByVariant['size']!['sm']).toContain('h-8');
  });
});
