'use client';

import { Slider } from '@gremorie/rx-forms';

export function SliderStepsPreview() {
  return (
    <div className="w-full max-w-sm">
      <Slider
        defaultValue={[50]}
        min={0}
        max={100}
        step={10}
        thumbAriaLabel="Quantity"
      />
    </div>
  );
}
