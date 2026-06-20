'use client';

import {
  Badge,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gremorie/rx-display';

export function CardWithActionPreview() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Monthly revenue</CardTitle>
        <CardDescription>Across all active workspaces.</CardDescription>
        <CardAction>
          <Badge variant="secondary">+12.4%</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">$48,210</p>
      </CardContent>
    </Card>
  );
}
