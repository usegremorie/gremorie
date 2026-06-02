'use client';

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gremorie/rx-display';

export function MarkdownDoc() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>weekly-status.md</CardTitle>
            <CardDescription>
              Rendered from streamed Markdown returned by the LLM.
            </CardDescription>
          </div>
          <Badge variant="outline">Markdown</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <article className="prose prose-sm max-w-none dark:prose-invert">
          <h2>Weekly status</h2>
          <p>
            The team shipped 2 major surfaces this week and unblocked 3
            long-standing issues. Velocity is steady and the team feels
            unblocked heading into next sprint.
          </p>
          <h3>Shipped</h3>
          <ul>
            <li>Auth flow with GitHub provider</li>
            <li>Dashboard analytics widget</li>
            <li>Settings page with sticky save bar</li>
          </ul>
          <h3>Blockers</h3>
          <p>Waiting on an API key for the analytics provider. ETA Monday.</p>
          <blockquote>
            Note: the empty-state pattern is now reusable across all zero-data
            surfaces.
          </blockquote>
        </article>
      </CardContent>
    </Card>
  );
}
