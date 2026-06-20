import { computed, Injectable, signal } from '@angular/core';
import {
  computeStackedYDomain,
  computeYDomain,
  type SeriesReg,
} from './domain';
import { linearScale, niceMax, pointScale } from './scales';
import { DEFAULT_MARGIN, type Datum, type Margin } from './types';

/**
 * Reactive hub shared by a chart frame and its child series/axes via DI.
 * The frame writes dimensions + data; series self-register their values so
 * the frame can compute a shared domain; scales are derived `computed`s.
 */
@Injectable()
export class ChartContext {
  readonly width = signal(0);
  readonly height = signal(0);
  readonly margin = signal<Margin>(DEFAULT_MARGIN);
  readonly data = signal<readonly Datum[]>([]);
  readonly xKey = signal<string>('');

  /** When true, the Y domain covers per-row stacked sums (bar/area stacking). */
  readonly stacked = signal(false);

  private readonly registry = signal<readonly SeriesReg[]>([]);

  register(reg: SeriesReg): void {
    this.registry.update((r) => [...r.filter((s) => s.key !== reg.key), reg]);
  }

  unregister(key: string): void {
    this.registry.update((r) => r.filter((s) => s.key !== key));
  }

  /** Registered series keys in registration order — used for grouped layouts. */
  readonly seriesKeys = computed(() => this.registry().map((s) => s.key));

  readonly innerWidth = computed(() =>
    Math.max(0, this.width() - this.margin().left - this.margin().right),
  );
  readonly innerHeight = computed(() =>
    Math.max(0, this.height() - this.margin().top - this.margin().bottom),
  );

  // Plot bounds in absolute SVG coordinates. Scales map into these so the
  // margins become real gutters (Y labels on the left, X labels below) instead
  // of dead space — without needing a `<g transform="translate(...)">` wrapper.
  readonly plotLeft = computed(() => this.margin().left);
  readonly plotRight = computed(() =>
    Math.max(this.margin().left, this.width() - this.margin().right),
  );
  readonly plotTop = computed(() => this.margin().top);
  readonly plotBottom = computed(() =>
    Math.max(this.margin().top, this.height() - this.margin().bottom),
  );

  readonly yDomain = computed<[number, number]>(() => {
    const [min, rawMax] = this.stacked()
      ? computeStackedYDomain(this.registry())
      : computeYDomain(this.registry());
    // Round the upper bound to a readable value so axis ticks land on
    // clean numbers (e.g. 305 -> 500 -> ticks 0/125/250/375/500).
    return [min, niceMax(rawMax)];
  });

  /**
   * Cumulative base value for `key` at each row when stacking — the sum of all
   * series registered *before* it. Series register in template/config order, so
   * this is the stack order. Returns zeros when not stacking.
   */
  stackBaseFor(key: string): readonly number[] {
    const keys = this.seriesKeys();
    const idx = keys.indexOf(key);
    const data = this.data();
    if (!this.stacked() || idx <= 0) return data.map(() => 0);
    const below = keys.slice(0, idx);
    return data.map((row) =>
      below.reduce((sum, k) => sum + Number(row[k] ?? 0), 0),
    );
  }

  readonly yScale = computed(() =>
    linearScale(this.yDomain(), [this.plotBottom(), this.plotTop()]),
  );

  readonly xScale = computed(() =>
    pointScale(
      this.data().map((d) => String(d[this.xKey()])),
      [this.plotLeft(), this.plotRight()],
    ),
  );
}
