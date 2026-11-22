import { Card, CardContent } from '@gremorie/rx-display';
import {
  Dropzone,
  DropzoneAction,
  DropzoneDescription,
  DropzoneIcon,
  DropzoneTitle,
} from '@gremorie/rx-forms';
import { PlusIcon } from 'lucide-react';

/**
 * Showcase card: the empty state of a music distribution catalog, before
 * the artist has delivered a single master. The whole area takes the drop.
 */
export function DistributeTrack() {
  return (
    <Card>
      <CardContent>
        <Dropzone
          accept={{ 'audio/*': ['.wav', '.flac', '.mp3'] }}
          className="gap-6 py-6"
        >
          <DropzoneIcon className="text-foreground">
            <PlusIcon />
          </DropzoneIcon>
          <div className="flex flex-col gap-2">
            <DropzoneTitle className="text-base">
              Distribute Track
            </DropzoneTitle>
            <DropzoneDescription>
              Upload your first master to start reaching listeners on more than
              150 streaming stores worldwide.
            </DropzoneDescription>
          </div>
          <DropzoneAction variant="default" size="default">
            Create Release
          </DropzoneAction>
        </Dropzone>
      </CardContent>
    </Card>
  );
}
