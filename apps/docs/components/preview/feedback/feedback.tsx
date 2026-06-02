'use client';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Progress,
  Skeleton,
} from '@gremorie/rx-feedback';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

// ---------- Alert ----------

export function AlertPreview() {
  return (
    <div className="flex flex-col gap-3">
      <Alert>
        <Info className="size-4" />
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>
          The registry rebuilds on every commit to the main branch.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTriangle className="size-4" />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>
          Could not reach the upstream registry. Retry shortly.
        </AlertDescription>
      </Alert>
      <Alert>
        <CheckCircle2 className="size-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Primitive added to your project.</AlertDescription>
      </Alert>
    </div>
  );
}

// ---------- Progress ----------

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

// ---------- Skeleton ----------

export function SkeletonPreview() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[160px]" />
      </div>
    </div>
  );
}
