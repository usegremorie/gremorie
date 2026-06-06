'use client';

import { CodeBlock } from '@gremorie/rx-artifacts';

const SAMPLE = `import { Message, MessageContent } from "@gremorie/rx-ai";

export function Demo() {
  return (
    <Message from="assistant">
      <MessageContent>Hi from Gremorie</MessageContent>
    </Message>
  );
}`;

export function CodeBlockPreview() {
  return <CodeBlock code={SAMPLE} language="tsx" showLineNumbers />;
}
