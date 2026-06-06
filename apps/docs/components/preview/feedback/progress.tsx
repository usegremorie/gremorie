'use client';

import { Progress } from '@gremorie/rx-feedback';
import { useEffect, useState } from 'react';

export function ProgressPreview() {
  const [value, setValue] = useState(13);
  useEffect(() => {
    const id = setTimeout(() => setValue(72), 500);
    return () => clearTimeout(id);
  }, []);
  return (
    <div className="flex max-w-md flex-col gap-3">
      <Progress value={value} />
      <Progress value={33} />
      <Progress value={88} />
    </div>
  );
}
