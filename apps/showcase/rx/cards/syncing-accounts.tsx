import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  FeaturedIcon,
} from '@gremorie/rx-display';
import { Spinner } from '@gremorie/rx-feedback';
import { Button } from '@gremorie/rx-forms';

/**
 * Showcase card: the blocking state while a budgeting app refreshes the
 * user's linked bank accounts.
 */
export function SyncingAccounts() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-6 py-4 text-center">
        <FeaturedIcon className="text-foreground" color="gray">
          <Spinner />
        </FeaturedIcon>
        <div className="flex flex-col gap-2">
          <CardTitle>Syncing your accounts</CardTitle>
          <CardDescription className="text-balance">
            Pulling in transactions from your 3 linked accounts. This usually
            takes a few seconds.
          </CardDescription>
        </div>
        <Button variant="outline">Cancel</Button>
      </CardContent>
    </Card>
  );
}
