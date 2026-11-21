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
} from '@gremorie/rx-display';
import {
  Slider,
  Switch,
  ToggleGroup,
  ToggleGroupItem,
} from '@gremorie/rx-forms';
import {
  DropletIcon,
  type LucideIcon,
  SunIcon,
  ThermometerIcon,
  TimerIcon,
} from 'lucide-react';
import { useState } from 'react';

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
  icon: LucideIcon;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}[] = [
  {
    key: 'brightness',
    label: 'Brightness',
    icon: SunIcon,
    min: 0,
    max: 100,
    step: 1,
    format: (v) => `${v}%`,
  },
  {
    key: 'temperature',
    label: 'Color Temp',
    icon: ThermometerIcon,
    min: 2200,
    max: 6500,
    step: 100,
    format: (v) => `${v.toLocaleString('en-US')}K`,
  },
  {
    key: 'saturation',
    label: 'Saturation',
    icon: DropletIcon,
    min: 0,
    max: 100,
    step: 1,
    format: (v) => `${v}%`,
  },
  {
    key: 'fade',
    label: 'Fade',
    icon: TimerIcon,
    min: 0,
    max: 5,
    step: 0.5,
    format: (v) => `${v}s`,
  },
];

const INITIAL = SCENES[0] as (typeof SCENES)[number];

/** Showcase card: one smart-home light group, its scenes and its channels. */
export function KitchenIsland() {
  const [on, setOn] = useState(true);
  const [scene, setScene] = useState(INITIAL.value);
  const [levels, setLevels] = useState<Levels>(INITIAL.levels);

  const applyScene = (value: string) => {
    const preset = SCENES.find((s) => s.value === value);
    if (!preset) return;
    setScene(value);
    setLevels(preset.levels);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kitchen Island</CardTitle>
        <CardDescription>3 color ambiance pendants</CardDescription>
        <CardAction>
          <label className="sr-only" htmlFor="kitchen-island-power">
            Kitchen Island lights
          </label>
          <Switch
            checked={on}
            id="kitchen-island-power"
            onCheckedChange={setOn}
          />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ToggleGroup
          aria-label="Scene"
          className="flex-wrap"
          disabled={!on}
          onValueChange={applyScene}
          spacing={2}
          type="single"
          value={scene}
          variant="outline"
        >
          {SCENES.map((s) => (
            <ToggleGroupItem key={s.value} value={s.value}>
              {s.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <ItemGroup className="gap-2">
          {CHANNELS.map((c) => (
            <Item key={c.key} size="sm" variant="outline">
              <ItemMedia variant="icon">
                <c.icon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{c.label}</ItemTitle>
              </ItemContent>
              <ItemActions className="gap-3">
                <Slider
                  className="w-28"
                  disabled={!on}
                  max={c.max}
                  min={c.min}
                  onValueChange={([v]) =>
                    setLevels((l) => ({ ...l, [c.key]: v ?? l[c.key] }))
                  }
                  step={c.step}
                  thumbAriaLabel={c.label}
                  value={[levels[c.key]]}
                />
                <span className="w-12 text-right text-muted-foreground text-xs tabular-nums">
                  {c.format(levels[c.key])}
                </span>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
