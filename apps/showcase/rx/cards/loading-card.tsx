import { Card, CardContent, CardHeader } from '@gremorie/rx-display';
import { Skeleton } from '@gremorie/rx-feedback';

/**
 * Showcase card: the loading state of a report card, drawn with skeletons
 * in the shape of the content that is about to arrive.
 */
export function LoadingCard() {
  return (
    <Card aria-busy="true" aria-label="Loading report">
      <CardHeader>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
      <CardContent className="grid grid-cols-2 gap-2">
        <Skeleton className="h-9 rounded-lg" />
        <Skeleton className="h-9 rounded-lg" />
      </CardContent>
    </Card>
  );
}
