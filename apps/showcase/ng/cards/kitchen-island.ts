import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideDroplet,
  lucideSun,
  lucideThermometer,
  lucideTimer,
} from '@ng-icons/lucide';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@gremorie/ng-display';
import {
  Slider,
  Switch,
  ToggleGroup,
  ToggleGroupItem,
} from '@gremorie/ng-forms';

type Channel = 'brightness' | 'temperature' | 'saturation' | 'fade';
type Levels = Record<Channel, number>;

// Each scene is a preset of the four channels below.
const SCENES: { value: string; label: string; levels: Levels }[] = [
  {
    value: 'cooking',
    label: 'Cooking',
    levels: { brightness: 90, temperature: 4000, saturation: 20, fade: 0.5 },
  },
  {
    value: 'dining',
    label: 'Dining',
    levels: { brightness: 60, temperature: 2700, saturation: 35, fade: 1.5 },
  },
  {
    value: 'nightlight',
    label: 'Nightlight',
    levels: { brightness: 10, temperature: 2200, saturation: 60, fade: 3 },
  },
  {
    value: 'focus',
    label: 'Focus',
    levels: { brightness: 100, temperature: 5000, saturation: 0, fade: 0.5 },
  },
];

const CHANNELS: {
  key: Channel;
  label: string;
  icon: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}[] = [
  {
    key: 'brightness',
    label: 'Brightness',
    icon: 'lucideSun',
    min: 0,
    max: 100,
    step: 1,
    format: (v) => `${v}%`,
  },
  {
    key: 'temperature',
    label: 'Color Temp',
    icon: 'lucideThermometer',
    min: 2200,
    max: 6500,
    step: 100,
    format: (v) => `${v.toLocaleString('en-US')}K`,
  },
  {
    key: 'saturation',
    label: 'Saturation',
    icon: 'lucideDroplet',
    min: 0,
    max: 100,
    step: 1,
    format: (v) => `${v}%`,
  },
  {
    key: 'fade',
    label: 'Fade',
    icon: 'lucideTimer',
    min: 0,
    max: 5,
    step: 0.5,
    format: (v) => `${v}s`,
  },
];

const INITIAL = SCENES[0] as (typeof SCENES)[number];

/** Showcase card: one smart-home light group, its scenes and its channels. */
@Component({
  selector: 'showcase-kitchen-island',
  standalone: true,
  imports: [
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Item,
    ItemActions,
    ItemContent,
    ItemGroup,
    ItemMedia,
    ItemTitle,
    NgIcon,
    Slider,
    Switch,
    ToggleGroup,
    ToggleGroupItem,
  ],
  providers: [
    provideIcons({ lucideDroplet, lucideSun, lucideThermometer, lucideTimer }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-header>
        <gr-card-title>Kitchen Island</gr-card-title>
        <gr-card-description>3 color ambiance pendants</gr-card-description>
        <gr-card-action>
          <label class="sr-only" for="kitchen-island-power"
            >Kitchen Island lights</label
          >
          <gr-switch id="kitchen-island-power" [(checked)]="on" />
        </gr-card-action>
      </gr-card-header>
      <gr-card-content class="flex flex-col gap-4">
        <gr-toggle-group
          aria-label="Scene"
          class="flex-wrap"
          type="single"
          variant="outline"
          [disabled]="!on()"
          [spacing]="2"
          [value]="scene()"
          (valueChange)="applyScene($event)"
        >
          @for (s of scenes; track s.value) {
            <gr-toggle-group-item [value]="s.value">{{
              s.label
            }}</gr-toggle-group-item>
          }
        </gr-toggle-group>
        <gr-item-group class="gap-2">
          @for (c of rows(); track c.key) {
            <gr-item size="sm" variant="outline">
              <gr-item-media variant="icon">
                <ng-icon [name]="c.icon" aria-hidden="true" />
              </gr-item-media>
              <gr-item-content>
                <gr-item-title>{{ c.label }}</gr-item-title>
              </gr-item-content>
              <gr-item-actions class="gap-3">
                <gr-slider
                  class="w-28"
                  [disabled]="!on()"
                  [max]="c.max"
                  [min]="c.min"
                  [step]="c.step"
                  [thumbAriaLabel]="c.label"
                  [value]="[c.value]"
                  (valueChange)="setLevel(c.key, $event)"
                />
                <span
                  class="w-12 text-right text-muted-foreground text-xs tabular-nums"
                  >{{ c.display }}</span
                >
              </gr-item-actions>
            </gr-item>
          }
        </gr-item-group>
      </gr-card-content>
    </gr-card>
  `,
})
export class KitchenIsland {
  protected readonly scenes = SCENES;
  protected readonly on = signal(true);
  protected readonly scene = signal(INITIAL.value);
  protected readonly levels = signal<Levels>(INITIAL.levels);
  protected readonly rows = computed(() =>
    CHANNELS.map((c) => {
      const value = this.levels()[c.key];
      return { ...c, value, display: c.format(value) };
    }),
  );

  protected applyScene(value: unknown): void {
    const preset = SCENES.find((s) => s.value === value);
    if (!preset) return;
    this.scene.set(preset.value);
    this.levels.set(preset.levels);
  }

  protected setLevel(key: Channel, value: number[]): void {
    const next = value[0];
    if (next === undefined) return;
    this.levels.update((l) => ({ ...l, [key]: next }));
  }
}
