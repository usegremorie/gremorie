'use client';

import { CodeBlock } from '@gremorie/rx-artifacts';
import { Card } from '@gremorie/rx-display';
import { Button } from '@gremorie/rx-forms';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@gremorie/rx-navigation';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

/**
 * Registry + MCP - the concrete AI-native proof (home redesign, section 9).
 * The features grid states the pillar; this section shows the working setup.
 *
 * The command and config mirror apps/docs/content/platform/mcp.mdx exactly
 * (same endpoint, same client tabs), so the landing and the docs can never
 * disagree about how to connect. Endpoint: https://www.gremorie.com/api/mcp,
 * served by apps/docs/app/api/[transport]/route.ts on the same domain.
 *
 * Dogfood: rx Tabs + Card + Button and the rx-artifacts CodeBlock.
 */

const CLAUDE_CODE_SNIPPET =
  'claude mcp add --transport http gremorie https://www.gremorie.com/api/mcp';

const JSON_SNIPPET = `{
  "mcpServers": {
    "gremorie": {
      "url": "https://www.gremorie.com/api/mcp"
    }
  }
}`;

export function McpSection() {
  return (
    <section className="border-y border-border/60 bg-muted/20 py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-2 lg:gap-16">
        {/* Copy column */}
        <div className="max-w-xl">
          <p className="font-medium text-primary text-sm">Registry + MCP</p>
          <h2 className="mt-2 font-bold text-3xl text-foreground tracking-tight sm:text-4xl">
            Your AI tools already know this system
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Point Claude Code, Cursor, or Codex at the Gremorie MCP server and
            they can list every component, read every contract, and generate UI
            that matches what you ship: same tokens, same anatomy, both
            frameworks.
          </p>
          <div className="mt-6">
            <Button variant="outline" asChild>
              <Link href="/platform/mcp">
                Set up the MCP server
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Config column - the working setup, per client */}
        <Card className="gap-0 overflow-hidden p-0">
          <Tabs defaultValue="claude-code" className="gap-0">
            <div className="flex h-11 items-center justify-between border-b border-border/60 px-4">
              <span className="font-medium text-muted-foreground text-xs">
                Connect a client
              </span>
              <TabsList className="h-8">
                <TabsTrigger value="claude-code" className="text-xs">
                  Claude Code
                </TabsTrigger>
                <TabsTrigger value="cursor" className="text-xs">
                  Cursor
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="claude-code" className="m-0">
              <CodeBlock
                code={CLAUDE_CODE_SNIPPET}
                language="bash"
                className="rounded-none border-0"
              />
            </TabsContent>
            <TabsContent value="cursor" className="m-0">
              <CodeBlock
                code={JSON_SNIPPET}
                language="json"
                className="rounded-none border-0"
              />
            </TabsContent>
          </Tabs>
          <p className="border-t border-border/60 px-4 py-3 text-muted-foreground text-xs">
            The server runs at{' '}
            <code className="font-mono text-foreground">
              https://www.gremorie.com/api/mcp
            </code>{' '}
            and exposes the registry and corpus as MCP tools.
          </p>
        </Card>
      </div>
    </section>
  );
}
