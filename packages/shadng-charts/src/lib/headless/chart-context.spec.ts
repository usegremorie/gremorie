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

  it('builds a Y scale from registered series (0 at bottom)', () => {
    const ctx = makeCtx();
    ctx.register({ key: 'sales', values: () => ctx.data().map((d) => Number(d['sales'])) });
    const y = ctx.yScale();
    expect(y(0)).toBe(200); // bottom
    expect(y(100)).toBe(0); // top
  });

  it('builds an X point scale across categories', () => {
    const ctx = makeCtx();
    const x = ctx.xScale();
    expect(x('Jan')).toBe(0);
    expect(x('Mar')).toBe(372);
  });

  it('unregister removes a series from the domain', () => {
    const ctx = makeCtx();
    ctx.register({ key: 'sales', values: () => ctx.data().map((d) => Number(d['sales'])) });
    expect(ctx.yScale()(100)).toBe(0);
    ctx.unregister('sales');
    // no series -> domain [0,1] -> y(1) is at the top (0)
    expect(ctx.yScale()(1)).toBe(0);
  });
});
