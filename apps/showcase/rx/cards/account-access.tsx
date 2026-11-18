import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@gremorie/rx-display';
import { Button, Input, Label } from '@gremorie/rx-forms';
import { ArrowRightIcon, CircleAlertIcon, LockKeyholeIcon } from 'lucide-react';

/** shadcn reference card (column 4): credentials and the danger zone. */
export function AccountAccess() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Access</CardTitle>
        <CardDescription>
          Update your credentials or re-authenticate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Label htmlFor="email-address">Email Address</Label>
            <Input
              defaultValue="artist@studio.inc"
              id="email-address"
              type="email"
            />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="current-password">Current Password</Label>
              <a
                className="font-medium text-muted-foreground text-xs uppercase tracking-wider hover:text-foreground"
                href="#forgot"
              >
                Forgot?
              </a>
            </div>
            <Input
              defaultValue="password123"
              id="current-password"
              type="password"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <Button className="w-full">
          <LockKeyholeIcon />
          Update Security
        </Button>
        <Item asChild className="w-full" variant="muted">
          <a href="#danger-zone">
            <ItemMedia variant="icon">
              <CircleAlertIcon className="text-destructive" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Danger Zone</ItemTitle>
              <ItemDescription>
                Archive account and remove catalog
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <ArrowRightIcon className="size-4" />
            </ItemActions>
          </a>
        </Item>
      </CardFooter>
    </Card>
  );
}
