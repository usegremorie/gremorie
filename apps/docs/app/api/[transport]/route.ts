/**
 * Gremorie MCP server (Phase 4).
 *
 * Co-located with apps/docs as a Next.js route handler so the MCP shares
 * deployment, runtime, and filesystem with the docs site. Powered by
 * `mcp-handler` (the Vercel adapter) and the official `@modelcontextprotocol/sdk`.
 *
 * Tools exposed:
 *   - list_components(framework?)
 *   - search_components(query, framework?, category?)
 *   - get_component(name, framework?)
 *   - get_block(name)
 *   - get_guidelines(topic?)
 *
 * The MCP is fine: it only serves what the registry and the foundations
 * MDX already contain. No domain logic, no DB.
 */

import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

import { getGuidelines, listGuidelines } from "@/lib/mcp/guidelines";
import {
  filterRegistry,
  readRegistryIndex,
  readRegistryItem,
} from "@/lib/mcp/registry";

/*
 * The MCP SDK's `registerTool` has deeply nested generics (dual v3/v4 zod
 * compat) that exhaust TS when registering many tools in one file. We type
 * registration loosely; argument shapes inside each handler are narrowed
 * by the zod inputSchema at runtime.
 */
type ToolHandlerResult = {
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
};
type RegisterTool = <I extends Record<string, unknown>>(
  name: string,
  config: {
    title?: string;
    description?: string;
    inputSchema?: Record<string, unknown>;
  },
  cb: (input: I) => Promise<ToolHandlerResult>,
) => unknown;

const handler = createMcpHandler(
  (server) => {
    // Cast once; subsequent calls type-check the zod schemas as the SDK does at runtime.
    const registerTool = server.registerTool.bind(server) as unknown as RegisterTool;
    /*
     * ─── list_components ────────────────────────────────────────────
     * Lists every registry item (lightweight catalogue, no source).
     * Filterable by framework. Use this when an agent wants to know
     * "what's available?" without paying for the full source payload.
     */
    registerTool(
      "list_components",
      {
        title: "List components",
        description:
          "List every Gremorie registry item (name, title, description, categories, framework). " +
          "Optionally filter by framework (e.g. 'ng', 'rx'). Returns only the index, not source. " +
          "Use get_component for the full item.",
        inputSchema: {
          framework: z
            .string()
            .optional()
            .describe("Framework filter, e.g. 'ng' or 'rx'."),
        },
      },
      async ({ framework }: { framework?: string }) => {
        const index = await readRegistryIndex();
        const items = filterRegistry(index.items, { framework });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  registry: index.name,
                  count: items.length,
                  items,
                },
                null,
                2,
              ),
            },
          ],
        };
      },
    );

    /*
     * ─── search_components ──────────────────────────────────────────
     * Categorical + substring search.
     *  - query    -> case-insensitive substring against name/title/description
     *  - category -> exact match against the item's categories array
     *  - framework-> exact match
     * Combined with AND. Returns the same shape as list_components.
     */
    registerTool(
      "search_components",
      {
        title: "Search components",
        description:
          "Search Gremorie registry items by substring (name + title + description) and / or category. " +
          "All filters combine with AND. Use this to find candidates before calling get_component for full source.",
        inputSchema: {
          query: z
            .string()
            .optional()
            .describe(
              "Free-text substring matched case-insensitively against name, title, and description.",
            ),
          framework: z
            .string()
            .optional()
            .describe("Framework filter, e.g. 'ng' or 'rx'."),
          category: z
            .string()
            .optional()
            .describe(
              "Category filter (exact match in the item's categories array). Examples: 'ai', 'forms', 'primitives'.",
            ),
        },
      },
      async ({
        query,
        framework,
        category,
      }: {
        query?: string;
        framework?: string;
        category?: string;
      }) => {
        const index = await readRegistryIndex();
        const items = filterRegistry(index.items, { query, framework, category });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  registry: index.name,
                  filters: { query, framework, category },
                  count: items.length,
                  items,
                },
                null,
                2,
              ),
            },
          ],
        };
      },
    );

    /*
     * ─── get_component ──────────────────────────────────────────────
     * Returns the full registry item: source files + cssVars + usage
     * (whenToUse, whenNotToUse, bestPractices, antipatterns, examples).
     * This is the payload an agent uses to generate code correctly.
     */
    registerTool(
      "get_component",
      {
        title: "Get component",
        description:
          "Return the full registry item for a Gremorie component: source files, dependencies, cssVars, and the usage doc " +
          "(whenToUse, whenNotToUse, bestPractices, antipatterns, API, examples). This is what an AI agent needs to generate " +
          "code that uses the component correctly.",
        inputSchema: {
          name: z
            .string()
            .describe(
              "Registry item name, e.g. 'ng-prompt-input' or 'ng-charts'. Run list_components to discover names.",
            ),
          framework: z
            .string()
            .optional()
            .describe(
              "Framework hint, e.g. 'ng' or 'rx'. Optional — the server scans all frameworks if omitted.",
            ),
        },
      },
      async ({ name, framework }: { name: string; framework?: string }) => {
        const item = await readRegistryItem(name, framework);
        if (!item) {
          return {
            content: [
              {
                type: "text",
                text: `Component "${name}" not found in registry. Try list_components to see available items.`,
              },
            ],
            isError: true,
          };
        }
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(item, null, 2),
            },
          ],
        };
      },
    );

    /*
     * ─── get_block ──────────────────────────────────────────────────
     * Same payload as get_component, but constrained to items with
     * `type: registry:block`. Today every Gremorie item is a block;
     * this tool just makes the intent explicit so an agent searching
     * for "blocks" (composed, ready-to-paste sections) gets a clear
     * surface.
     */
    registerTool(
      "get_block",
      {
        title: "Get block",
        description:
          "Return the full registry item for a Gremorie block (registry:block). Blocks are composed, ready-to-paste sections " +
          "(versus single primitives). Same payload shape as get_component.",
        inputSchema: {
          name: z
            .string()
            .describe("Registry block name, e.g. 'ng-prompt-input'."),
          framework: z
            .string()
            .optional()
            .describe("Framework hint. Optional."),
        },
      },
      async ({ name, framework }: { name: string; framework?: string }) => {
        const item = await readRegistryItem(name, framework);
        if (!item) {
          return {
            content: [
              {
                type: "text",
                text: `Block "${name}" not found in registry.`,
              },
            ],
            isError: true,
          };
        }
        if (item.type !== "registry:block") {
          return {
            content: [
              {
                type: "text",
                text: `Item "${name}" exists but is type "${item.type}", not "registry:block". Use get_component instead.`,
              },
            ],
            isError: true,
          };
        }
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(item, null, 2),
            },
          ],
        };
      },
    );

    /*
     * ─── get_guidelines ─────────────────────────────────────────────
     * Returns foundation MDX from content/foundations/. The MCP's
     * "explanation layer": when to use button vs link, the doc
     * standard, the storybook structure, etc.
     *
     * With a topic, returns matching docs (exact slug or substring).
     * Without a topic, returns the index (all docs, header only).
     */
    registerTool(
      "get_guidelines",
      {
        title: "Get guidelines",
        description:
          "Return Gremorie foundation guidelines (MDX) from content/foundations/. Covers principles, architecture, " +
          "storybook structure, documentation standard, component catalog, accessibility, layout stability, contributing, " +
          "and the UX corpus. Pass a topic (slug or substring) to narrow; omit to get the index of all guidelines.",
        inputSchema: {
          topic: z
            .string()
            .optional()
            .describe(
              "Slug (e.g. 'storybook-structure') or substring (e.g. 'accessibility'). Omit to list every guideline.",
            ),
        },
      },
      async ({ topic }: { topic?: string }) => {
        if (!topic) {
          const index = await listGuidelines();
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    count: index.length,
                    guidelines: index,
                    hint: "Call get_guidelines with a topic (slug or substring) to fetch the full MDX.",
                  },
                  null,
                  2,
                ),
              },
            ],
          };
        }

        const docs = await getGuidelines(topic);
        if (docs.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: `No guideline matches "${topic}". Call get_guidelines with no topic to see the index.`,
              },
            ],
            isError: true,
          };
        }
        // One match -> return the full MDX directly.
        // Many matches -> return them all (LLM picks).
        return {
          content: docs.map((doc) => ({
            type: "text" as const,
            text: `# ${doc.title} (${doc.slug})\n\n_source: ${doc.path}_\n\n${doc.content}`,
          })),
        };
      },
    );
  },
  // Server options (second arg). Most metadata is on the tools themselves;
  // mcp-handler / the MCP SDK derives capabilities from registered tools.
  {},
  // adapter config — must match the [transport] route position
  {
    basePath: "/api",
    maxDuration: 60,
    verboseLogs: process.env.NODE_ENV !== "production",
  },
);

export { handler as GET, handler as POST, handler as DELETE };
