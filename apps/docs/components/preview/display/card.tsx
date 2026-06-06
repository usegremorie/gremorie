'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@gremorie/rx-display';
import { Button } from '@gremorie/rx-forms';

export function CardPreview() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Welcome to Gremorie</CardTitle>
        <CardDescription>
          AI-native design system, registry first.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Compose primitives directly. Skip the lock-in.
        </p>
      </CardContent>
      <CardFooter>
        <Button>Get started</Button>
      </CardFooter>
    </Card>
  );
}
