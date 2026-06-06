'use client';

import { Slider } from '@gremorie/rx-forms';

export function SliderPreview() {
  return (
    <div className="max-w-sm">
      <Slider defaultValue={[40]} max={100} step={1} />
    </div>
  );
}
