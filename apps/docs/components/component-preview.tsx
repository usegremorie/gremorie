import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { type ReactNode } from 'react';

/**
 * Tabbed Preview / Code surface for component docs, matching the AI Elements
 * and shadcn/ui reference pattern.
 *
 * `name` is the path of the example under `components/preview` (without the
 * extension), e.g. `ai/prompt-input`. The Code tab shows the REAL source of
 * that file, read from disk at build time (the docs are statically generated),
 * so the rendered preview and the copyable code never drift apart. `children`
 * is the live example, imported from the same file in the MDX page.
 *
 * This is a server component (it reads the filesystem); the live preview it
 * wraps stays a client component.
 */
export function ComponentPreview({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  const source = readFileSync(
    join(process.cwd(), 'components', 'preview', `${name}.tsx`),
    'utf8',
  );

  return (
    <Tabs className="not-prose" items={['Preview', 'Code']}>
      <Tab value="Preview">
        <div className="rounded-lg border p-6">{children}</div>
      </Tab>
      <Tab className="my-0 [&_figure]:my-0" value="Code">
        <DynamicCodeBlock code={source.trimEnd()} lang="tsx" />
      </Tab>
    </Tabs>
  );
}
