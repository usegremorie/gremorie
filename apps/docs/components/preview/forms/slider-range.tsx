'use client';

import { Slider } from '@gremorie/rx-forms';

export function SliderRangePreview() {
  return (
    <div className="w-full max-w-sm">
      <Slider
        defaultValue={[25, 75]}
        min={0}
        max={100}
        thumbAriaLabel={['Minimum price', 'Maximum price']}
      />
    </div>
  );
}
