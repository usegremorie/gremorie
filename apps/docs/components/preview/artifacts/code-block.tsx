'use client';

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gremorie/rx-display';
import { CodeBlock, CodeBlockCopyButton } from '@gremorie/rx-artifacts';

const CODE = `import { Button } from "@gremorie/rx-forms";

export function SaveBar() {
  return (
    <div className="sticky bottom-0 flex justify-end gap-3 border-t bg-background/90 p-3 backdrop-blur">
      <Button variant="ghost">Cancel</Button>
      <Button>Save changes</Button>
    </div>
  );
}`;

export function CodeBlockArtifact() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>SaveBar.tsx</CardTitle>
            <CardDescription>
              Streamed code emitted by the model with Shiki highlighting.
            </CardDescription>
          </div>
          <Badge variant="outline">TSX + Shiki</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <CodeBlock code={CODE} language="tsx">
          <CodeBlockCopyButton />
        </CodeBlock>
      </CardContent>
    </Card>
  );
}
