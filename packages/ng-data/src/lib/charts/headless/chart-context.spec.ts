import { ChartContext } from './chart-context';

function makeCtx(): ChartContext {
  const ctx = new ChartContext();
  ctx.width.set(420); // 420 - left(40) - right(8) = 372 inner width
  ctx.height.set(232); // 232 - top(8) - bottom(24) = 200 inner height
  ctx.data.set([
    { month: 'Jan', sales: 0 },
    { month: 'Feb', sales: 50 },
    { month: 'Mar', sales: 100 },
  ]);
  ctx.xKey.set('month');
  return ctx;
}

describe('ChartContext', () => {
  it('computes inner dimensions from size minus margins', () => {
    const ctx = makeCtx();
    expect(ctx.innerWidth()).toBe(372);
    expect(ctx.innerHeight()).toBe(200);
  });

  it('computes plot bounds offset by the margins (left/top gutters)', () => {
    const ctx = makeCtx();
    expect(ctx.plotLeft()).toBe(40); // left margin gutter for Y labels
    expect(ctx.plotRight()).toBe(412); // 420 - right(8)
    expect(ctx.plotTop()).toBe(8);
    expect(ctx.plotBottom()).toBe(208); // 232 - bottom(24)
  });

  it('builds a Y scale mapped into the plot band (0 at plotBottom, max at plotTop)', () => {
    const ctx = makeCtx();
    ctx.register({ key: 'sales', values: () => ctx.data().map((d) => Number(d['sales'])) });
    const y = ctx.yScale();
    expect(y(0)).toBe(208); // bottom of plot band
    expect(y(100)).toBe(8); // top of plot band
  });

  it('builds an X point scale across categories within the left/right gutters', () => {
    const ctx = makeCtx();
    const x = ctx.xScale();
    expect(x('Jan')).toBe(40); // starts at plotLeft, not 0
    expect(x('Mar')).toBe(412); // ends at plotRight, not innerWidth
  });

  it('unregister removes a series from the domain', () => {
    const ctx = makeCtx();
    ctx.register({ key: 'sales', values: () => ctx.data().map((d) => Number(d['sales'])) });
    expect(ctx.yScale()(100)).toBe(8); // top of plot band
    ctx.unregister('sales');
    // no series -> domain [0,1] -> y(1) is at plotTop
    expect(ctx.yScale()(1)).toBe(8);
  });
});
