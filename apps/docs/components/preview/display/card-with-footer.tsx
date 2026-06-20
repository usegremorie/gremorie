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

export function CardWithFooterPreview() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Invite teammates</CardTitle>
        <CardDescription>
          They will get an email with a join link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Up to 10 seats are included on the Pro plan.
        </p>
      </CardContent>
      <CardFooter className="border-t">
        <Button variant="outline" className="w-full">
          Send invites
        </Button>
      </CardFooter>
    </Card>
  );
}
