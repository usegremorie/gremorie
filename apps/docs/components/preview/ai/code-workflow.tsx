'use client';

import {
  Artifact,
  ArtifactActions,
  ArtifactClose,
  ArtifactContent,
  ArtifactDescription,
  ArtifactHeader,
  ArtifactTitle,
  CodeBlock,
  CodeBlockCopyButton,
  WebPreview,
  WebPreviewBody,
  WebPreviewConsole,
  WebPreviewNavigation,
  WebPreviewUrl,
} from '@gremorie/rx-artifacts';

// ---------- CodeBlock ----------

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

export function CodeBlockCopyPreview() {
  return (
    <CodeBlock code={SAMPLE} language="tsx">
      <CodeBlockCopyButton />
    </CodeBlock>
  );
}

// ---------- Artifact ----------

export function ArtifactPreview() {
  return (
    <Artifact className="max-w-2xl">
      <ArtifactHeader>
        <ArtifactTitle>Landing page hero</ArtifactTitle>
        <ArtifactDescription>
          Generated from your prompt - 3 sections.
        </ArtifactDescription>
        <ArtifactActions>
          <ArtifactClose />
        </ArtifactActions>
      </ArtifactHeader>
      <ArtifactContent>
        <p className="text-sm text-muted-foreground">
          Body content of the artifact - usually a CodeBlock, preview iframe, or
          composed view.
        </p>
      </ArtifactContent>
    </Artifact>
  );
}

// ---------- WebPreview ----------

export function WebPreviewPreview() {
  return (
    <WebPreview defaultUrl="https://gremorie.com" className="max-w-2xl">
      <WebPreviewNavigation>
        <WebPreviewUrl />
      </WebPreviewNavigation>
      <WebPreviewBody src="https://gremorie.com" className="h-[240px]" />
    </WebPreview>
  );
}

export function WebPreviewConsolePreview() {
  return (
    <WebPreview defaultUrl="https://gremorie.com" className="max-w-2xl">
      <WebPreviewNavigation>
        <WebPreviewUrl />
      </WebPreviewNavigation>
      <WebPreviewBody src="https://gremorie.com" className="h-[180px]" />
      <WebPreviewConsole
        logs={[
          {
            level: 'log',
            message: '[ready] dev server on :5020',
            timestamp: new Date(),
          },
          {
            level: 'warn',
            message: 'Slow render on /components/workflow/canvas',
            timestamp: new Date(),
          },
        ]}
      />
    </WebPreview>
  );
}
