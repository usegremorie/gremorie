'use client';

import { Slider } from '@gremorie/rx-forms';

export function SliderDisabledPreview() {
  return (
    <div className="w-full max-w-sm">
      <Slider
        defaultValue={[40]}
        min={0}
        max={100}
        disabled
        thumbAriaLabel="Volume"
      />
    </div>
  );
}
