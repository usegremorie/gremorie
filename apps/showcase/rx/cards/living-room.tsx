import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gremorie/rx-display';
import { Slider, ToggleGroup, ToggleGroupItem } from '@gremorie/rx-forms';
import { useState } from 'react';

// Presets for the roller shades, as percent closed.
const PRESETS = [
  { value: 'open', label: 'Open', closed: 0 },
  { value: 'half', label: 'Half', closed: 50 },
  { value: 'closed', label: 'Closed', closed: 100 },
];

/** Showcase card: a smart-home roller shade with a slider and presets. */
export function LivingRoom() {
  const [closed, setClosed] = useState([50]);
  const value = closed[0] ?? 0;
  const preset = PRESETS.find((p) => p.closed === value)?.value ?? '';
  return (
    <Card>
      <CardHeader>
        <CardTitle>Living Room</CardTitle>
        <CardDescription>Roller shades, {value}% closed</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          aria-hidden="true"
          className="h-32 overflow-hidden rounded-lg border border-border bg-muted/50"
        >
          <div
            className="bg-muted-foreground/50 transition-all"
            style={{ height: `${value}%` }}
          />
        </div>
      </CardContent>
      <CardContent className="flex items-center gap-3">
        <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
          Open
        </span>
        <Slider
          max={100}
          onValueChange={setClosed}
          step={5}
          thumbAriaLabel="Shade position, percent closed"
          value={closed}
        />
        <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
          Close
        </span>
      </CardContent>
      <CardContent>
        <ToggleGroup
          aria-label="Shade presets"
          className="grid w-full grid-cols-3"
          onValueChange={(v) => {
            const p = PRESETS.find((x) => x.value === v);
            if (p) setClosed([p.closed]);
          }}
          spacing={2}
          type="single"
          value={preset}
          variant="outline"
        >
          {PRESETS.map((p) => (
            <ToggleGroupItem key={p.value} value={p.value}>
              {p.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CardContent>
    </Card>
  );
}
