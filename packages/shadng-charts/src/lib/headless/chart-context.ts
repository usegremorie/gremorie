import { computed, Injectable, signal } from '@angular/core';
import { computeYDomain, type SeriesReg } from './domain';
import { linearScale, pointScale } from './scales';
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

  private readonly registry = signal<readonly SeriesReg[]>([]);

  register(reg: SeriesReg): void {
    this.registry.update((r) => [...r.filter((s) => s.key !== reg.key), reg]);
  }

  unregister(key: string): void {
    this.registry.update((r) => r.filter((s) => s.key !== key));
  }

  readonly innerWidth = computed(() =>
    Math.max(0, this.width() - this.margin().left - this.margin().right),
  );
  readonly innerHeight = computed(() =>
    Math.max(0, this.height() - this.margin().top - this.margin().bottom),
  );

  readonly yDomain = computed(() => computeYDomain(this.registry()));

  readonly yScale = computed(() => linearScale(this.yDomain(), [this.innerHeight(), 0]));

  readonly xScale = computed(() =>
    pointScale(
      this.data().map((d) => String(d[this.xKey()])),
      [0, this.innerWidth()],
    ),
  );
}
