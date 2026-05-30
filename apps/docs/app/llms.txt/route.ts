import { source } from "@/lib/source";

/**
 * /llms.txt — machine-readable index of the docs for LLM agents
 * (https://llmstxt.org). Leads with the npm install path so an assistant
 * can install and use Gremorie directly, then lists every doc page.
 */
export const revalidate = false;
export const dynamic = "force-static";

const ORIGIN = "https://gremorie.com";

export function GET() {
  const lines: string[] = [];

  lines.push("# Gremorie");
  lines.push("");
  lines.push(
    "> The AI-native design system for React and Angular. Copy-paste components served through a registry + MCP, and versioned npm packages for projects that want updates.",
  );
  lines.push("");

  lines.push("## Install");
  lines.push("");
  lines.push(
    "Two ways to consume Gremorie — choose per project:",
  );
  lines.push("");
  lines.push(
    "1. npm packages (versioned, get updates with `npm update`):",
  );
  lines.push("   - React, complete edition: `npm i @gremorie/react`");
  lines.push("     ```tsx");
  lines.push('     // 1. Import the pre-compiled stylesheet ONCE, in your app entry');
  lines.push('     //    (app/layout.tsx or src/main.tsx). It ships tokens + all');
  lines.push('     //    component styles — no Tailwind/@theme/@source needed.');
  lines.push('     import "@gremorie/react/styles.css";');
  lines.push('     // 2. Import components (Next.js App Router: file needs "use client").');
  lines.push('     import { Button, Card, CardHeader, CardTitle, Message } from "@gremorie/react";');
  lines.push("     ```");
  lines.push("   - Angular, complete edition: `npm i @gremorie/angular`");
  lines.push('     ```ts');
  lines.push('     // In src/styles.css: @import "tailwindcss"; @import "@gremorie/ng-core/styles/theme.css";');
  lines.push('     import { Badge, Carousel } from "@gremorie/angular";');
  lines.push("     ```");
  lines.push(
    "   - Optional artifacts (Artifact, CodeBlock, WebPreview): `npm i @gremorie/rx-artifacts`",
  );
  lines.push(
    "   - Or a single category: `@gremorie/rx-forms`, `@gremorie/rx-display`, `@gremorie/rx-overlays`, `@gremorie/rx-ai`, `@gremorie/rx-data` (React) / `@gremorie/ng-display`, `@gremorie/ng-ai` (Angular). React categories share the same pre-compiled `@gremorie/rx-core/styles/globals.css` stylesheet.",
  );
  lines.push(
    "   - React: components are interactive — in Next.js App Router add `\"use client\"` to files that render them.",
  );
  lines.push(
    "2. Copy-paste source via the registry (you own the code): `npx gremorie add <name>` (e.g. `rx-button`, `ng-carousel`, `ng-inline-citation`).",
  );
  lines.push("");

  lines.push("## Documentation");
  lines.push("");
  for (const page of source.getPages()) {
    const title = page.data.title ?? page.url;
    const desc = page.data.description ? `: ${page.data.description}` : "";
    lines.push(`- [${title}](${ORIGIN}${page.url})${desc}`);
  }
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
