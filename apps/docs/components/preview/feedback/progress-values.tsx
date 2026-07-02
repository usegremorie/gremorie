'use client';

import { Progress } from '@gremorie/rx-feedback';

export function ProgressValuesPreview() {
  return (
    <div className="flex max-w-md flex-col gap-4">
      {[0, 33, 66, 100].map((value) => (
        <div key={value} className="flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span>Step {value === 0 ? 'queued' : `${value}%`}</span>
            <span className="text-muted-foreground">{value}%</span>
          </div>
          <Progress value={value} />
        </div>
      ))}
    </div>
  );
}
