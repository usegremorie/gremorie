'use client';

import { DatePicker } from '@gremorie/rx-overlays';
import { useState } from 'react';

export function DatePickerPreview() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <DatePicker
      value={date}
      onValueChange={setDate}
      placeholder="Pick a date"
    />
  );
}
