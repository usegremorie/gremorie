'use client';

import { Calendar } from '@gremorie/rx-forms';
import { useState } from 'react';

export function CalendarPreview() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return <Calendar mode="single" selected={date} onSelect={setDate} />;
}
