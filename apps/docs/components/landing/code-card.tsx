'use client';

import { CodeBlock, CodeBlockCopyButton } from '@gremorie/rx-artifacts';
import { cn } from '@gremorie/rx-core';
import { Card, CardHeader } from '@gremorie/rx-display';

import type { ComponentProps } from 'react';

import { CommandLine } from '@/components/landing/command-line';
import {
  FrameworkTabs,
  type Framework,
} from '@/components/landing/framework-tabs';

type Language = ComponentProps<typeof CodeBlock>['language'];

/**
 * The home's code card: the React | Angular tabs head a DS Card; the body
 * holds an optional install command and the code for the active edition, in
 * the DS CodeBlock (copy button, scrollbars on hover).
 *
 *   Card
 *   ├─ CardHeader   FrameworkTabs (line variant, underline on the border)
 *   └─ body         CommandLine? + CodeBlock (+ CodeBlockCopyButton)
 *
 * `codeClassName` sizes the code box: the Assistant showcase pins it to a
 * fixed height so the section keeps its size; the artifacts spotlight lets it
 * fill the card beside the artifact.
 */
export function CodeCard({
  edition,
  onEditionChange,
  code,
  command,
  className,
  codeClassName,
}: {
  edition: Framework;
  onEditionChange: (edition: Framework) => void;
  code: Record<Framework, { code: string; language: Language }>;
  command?: Record<Framework, string>;
  className?: string;
  codeClassName?: string;
}) {
  return (
    <Card className={cn('gap-0 overflow-hidden py-0', className)}>
      <CardHeader className="block border-b px-4 [.border-b]:pb-0">
        <FrameworkTabs onValueChange={onEditionChange} value={edition} />
      </CardHeader>
      <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
        {command && (
          <CommandLine command={command[edition]} label="install command" />
        )}
        <CodeBlock
          className={codeClassName}
          code={code[edition].code}
          language={code[edition].language}
        >
          {/* Backdrop like the install command's copy: code scrolling under
              the button stays out of the icon's way. */}
          <CodeBlockCopyButton className="bg-background/80 backdrop-blur-lg" />
        </CodeBlock>
      </div>
    </Card>
  );
}
