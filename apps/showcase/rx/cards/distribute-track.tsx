import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  FeaturedIcon,
} from '@gremorie/rx-display';
import { Button } from '@gremorie/rx-forms';
import { PlusIcon } from 'lucide-react';

/**
 * Showcase card: the empty state of a music distribution catalog, before
 * the artist has delivered a single master.
 */
export function DistributeTrack() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-6 py-4 text-center">
        <FeaturedIcon
          className="text-foreground"
          color="gray"
          icon={PlusIcon}
        />
        <div className="flex flex-col gap-2">
          <CardTitle>Distribute Track</CardTitle>
          <CardDescription className="text-balance">
            Upload your first master to start reaching listeners on more than
            150 streaming stores worldwide.
          </CardDescription>
        </div>
        <Button>Create Release</Button>
      </CardContent>
    </Card>
  );
}
