import { AspectRatio } from '@gremorie/rx-containers';
import {
  Badge,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gremorie/rx-display';
import { Button } from '@gremorie/rx-forms';
import { LockIcon, LockOpenIcon, VideoIcon } from 'lucide-react';
import { useState } from 'react';

// A smart lock with its porch camera. The lock state is a status mark:
// locked takes the success slot of the data-viz palette, unlocked the
// warning slot. Tapping the state toggles the lock.
const STATE = {
  locked: {
    label: 'Locked',
    icon: LockIcon,
    color: 'var(--chart-status-success)',
  },
  unlocked: {
    label: 'Unlocked',
    icon: LockOpenIcon,
    color: 'var(--chart-status-warning)',
  },
};

/** Showcase card: a smart lock and the live feed of its door camera. */
export function FrontDoor() {
  const [locked, setLocked] = useState(true);
  const state = locked ? STATE.locked : STATE.unlocked;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Front Door</CardTitle>
        <CardDescription>Smart Lock Pro · Battery 84%</CardDescription>
        <CardAction>
          <Button
            aria-pressed={locked}
            onClick={() => setLocked((l) => !l)}
            variant="ghost"
          >
            {state.label}
            <state.icon style={{ color: state.color }} />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <AspectRatio ratio={16 / 9}>
          <div className="relative flex size-full items-center justify-center rounded-lg bg-muted">
            <VideoIcon
              aria-hidden="true"
              className="size-8 text-muted-foreground"
            />
            <Badge className="absolute top-3 right-3" variant="destructive">
              Live
            </Badge>
            <span className="absolute bottom-3 left-3 text-muted-foreground text-xs tabular-nums">
              Porch camera · 7:42 PM
            </span>
          </div>
        </AspectRatio>
      </CardContent>
    </Card>
  );
}
