import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gremorie/ng-display';
import { Slider, ToggleGroup, ToggleGroupItem } from '@gremorie/ng-forms';

// Presets for the roller shades, as percent closed.
const PRESETS = [
  { value: 'open', label: 'Open', closed: 0 },
  { value: 'half', label: 'Half', closed: 50 },
  { value: 'closed', label: 'Closed', closed: 100 },
];

/** Showcase card: a smart-home roller shade with a slider and presets. */
@Component({
  selector: 'showcase-living-room',
  standalone: true,
  imports: [
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Slider,
    ToggleGroup,
    ToggleGroupItem,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-header>
        <gr-card-title>Living Room</gr-card-title>
        <gr-card-description
          >Roller shades, {{ value() }}% closed</gr-card-description
        >
      </gr-card-header>
      <gr-card-content>
        <div
          aria-hidden="true"
          class="h-32 overflow-hidden rounded-lg border border-border bg-muted/50"
        >
          <div
            class="bg-muted-foreground/50 transition-all"
            [style.height.%]="value()"
          ></div>
        </div>
      </gr-card-content>
      <gr-card-content class="flex items-center gap-3">
        <span
          class="font-medium text-muted-foreground text-xs uppercase tracking-wider"
          >Open</span
        >
        <gr-slider
          class="flex-1"
          [(value)]="closed"
          [max]="100"
          [step]="5"
          thumbAriaLabel="Shade position, percent closed"
        />
        <span
          class="font-medium text-muted-foreground text-xs uppercase tracking-wider"
          >Close</span
        >
      </gr-card-content>
      <gr-card-content>
        <gr-toggle-group
          aria-label="Shade presets"
          class="grid w-full grid-cols-3"
          [spacing]="2"
          type="single"
          variant="outline"
          [value]="preset()"
          (valueChange)="choose($event)"
        >
          @for (p of presets; track p.value) {
            <gr-toggle-group-item [value]="p.value">{{
              p.label
            }}</gr-toggle-group-item>
          }
        </gr-toggle-group>
      </gr-card-content>
    </gr-card>
  `,
})
export class LivingRoom {
  protected readonly presets = PRESETS;
  protected readonly closed = signal([50]);
  protected readonly value = computed(() => this.closed()[0] ?? 0);
  protected readonly preset = computed(
    () => PRESETS.find((p) => p.closed === this.value())?.value ?? '',
  );

  protected choose(v: unknown) {
    const p = PRESETS.find((x) => x.value === v);
    if (p) this.closed.set([p.closed]);
  }
}
