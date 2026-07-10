'use client';

import { Spinner } from '@gremorie/rx-feedback';

export function SpinnerPreview() {
  return (
    <div className="flex items-center gap-6">
      <Spinner size="sm" />
      <Spinner />
      <Spinner size="lg" />
    </div>
  );
}
