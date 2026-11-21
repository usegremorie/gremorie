import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  FeaturedIcon,
} from '@gremorie/rx-display';
import { Button } from '@gremorie/rx-forms';
import { LandmarkIcon } from 'lucide-react';

/** Showcase card: the empty state that asks an artist to add a payout bank. */
export function ConnectBank() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-2 text-center">
        <FeaturedIcon className="mb-2" color="gray" theme="light">
          <LandmarkIcon aria-hidden="true" />
        </FeaturedIcon>
        <CardTitle>Connect Bank</CardTitle>
        <CardDescription className="text-balance">
          Link a bank account to receive your monthly royalty payouts
          automatically.
        </CardDescription>
        <Button className="mt-2" size="sm">
          Set Up Payouts
        </Button>
      </CardContent>
    </Card>
  );
}
