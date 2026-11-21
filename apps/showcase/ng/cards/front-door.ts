import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLock, lucideLockOpen, lucideVideo } from '@ng-icons/lucide';
import { AspectRatio } from '@gremorie/ng-containers';
import { Button } from '@gremorie/ng-core';
import {
  Badge,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gremorie/ng-display';

// A smart lock with its porch camera. The lock state is a status mark:
// locked takes the success slot of the data-viz palette, unlocked the
// warning slot. Tapping the state toggles the lock.
const STATE = {
  locked: {
    label: 'Locked',
    icon: 'lucideLock',
    color: 'var(--chart-status-success)',
  },
  unlocked: {
    label: 'Unlocked',
    icon: 'lucideLockOpen',
    color: 'var(--chart-status-warning)',
  },
};

/** Showcase card: a smart lock and the live feed of its door camera. */
@Component({
  selector: 'showcase-front-door',
  standalone: true,
  imports: [
    AspectRatio,
    Badge,
    Button,
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    NgIcon,
  ],
  providers: [provideIcons({ lucideLock, lucideLockOpen, lucideVideo })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-header>
        <gr-card-title>Front Door</gr-card-title>
        <gr-card-description>Smart Lock Pro · Battery 84%</gr-card-description>
        <gr-card-action>
          <ai-button
            variant="ghost"
            [pressed]="locked()"
            (pressedChange)="locked.set(!locked())"
          >
            {{ state().label }}
            <ng-icon
              [name]="state().icon"
              [color]="state().color"
              size="16"
              aria-hidden="true"
            />
          </ai-button>
        </gr-card-action>
      </gr-card-header>
      <gr-card-content>
        <gr-aspect-ratio [ratio]="16 / 9">
          <div
            class="relative flex size-full items-center justify-center rounded-lg bg-muted"
          >
            <ng-icon
              name="lucideVideo"
              size="32"
              color="var(--muted-foreground)"
              aria-hidden="true"
            />
            <gr-badge variant="destructive" class="absolute top-3 right-3"
              >Live</gr-badge
            >
            <span
              class="absolute bottom-3 left-3 text-muted-foreground text-xs tabular-nums"
              >Porch camera · 7:42 PM</span
            >
          </div>
        </gr-aspect-ratio>
      </gr-card-content>
    </gr-card>
  `,
})
export class FrontDoor {
  protected readonly locked = signal(true);
  protected readonly state = computed(() =>
    this.locked() ? STATE.locked : STATE.unlocked,
  );
}
