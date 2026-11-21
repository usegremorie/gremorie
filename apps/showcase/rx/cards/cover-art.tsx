import { AspectRatio } from '@gremorie/rx-containers';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@gremorie/rx-display';
import { Button } from '@gremorie/rx-forms';
import { ImageIcon } from 'lucide-react';

/** Showcase card: the artwork slot of a single being prepared for release. */
export function CoverArt() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="block font-medium text-muted-foreground text-xs uppercase tracking-wider">
            Cover Art
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AspectRatio
          className="flex items-center justify-center rounded-xl border border-border border-dashed bg-muted/30 text-muted-foreground"
          ratio={1}
        >
          <ImageIcon aria-hidden="true" className="size-9" />
          <span className="sr-only">No artwork uploaded yet</span>
        </AspectRatio>
      </CardContent>
      <CardFooter className="flex-col gap-3">
        <Button className="w-full" variant="secondary">
          Upload Artwork
        </Button>
        <p className="text-center text-muted-foreground text-xs">
          Square, at least 3000 × 3000 px
          <br />
          JPEG or PNG, up to 10 MB
        </p>
      </CardFooter>
    </Card>
  );
}
