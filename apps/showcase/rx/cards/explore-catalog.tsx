import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  FeaturedIcon,
} from '@gremorie/rx-display';
import { Button } from '@gremorie/rx-forms';
import { AudioWaveformIcon } from 'lucide-react';

/**
 * Showcase card: a music-distribution nudge before release day. Centered
 * empty-state layout: icon, title, one line of guidance, one action.
 */
export function ExploreCatalog() {
  return (
    <Card>
      <CardHeader className="justify-items-center gap-2 text-center">
        <FeaturedIcon
          className="mb-4"
          color="gray"
          icon={AudioWaveformIcon}
          size="lg"
        />
        <CardTitle>Explore Catalog</CardTitle>
        <CardDescription className="text-balance">
          Check ISRC codes, metadata and artwork for all 12 tracks before
          release day on Dec 4.
        </CardDescription>
      </CardHeader>
      <CardFooter className="justify-center">
        <Button>View Catalog</Button>
      </CardFooter>
    </Card>
  );
}
