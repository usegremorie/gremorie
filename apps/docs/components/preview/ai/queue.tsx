'use client';

import {
  Queue,
  QueueItem,
  QueueItemContent,
  QueueItemDescription,
  QueueItemIndicator,
} from '@gremorie/rx-ai';

export function QueuePreview() {
  return (
    <Queue>
      <QueueItem>
        <QueueItemIndicator completed />
        <QueueItemContent>Generate component scaffold</QueueItemContent>
        <QueueItemDescription>Done</QueueItemDescription>
      </QueueItem>
      <QueueItem>
        <QueueItemIndicator completed />
        <QueueItemContent>Wire MDX preview</QueueItemContent>
        <QueueItemDescription>Done</QueueItemDescription>
      </QueueItem>
      <QueueItem>
        <QueueItemIndicator />
        <QueueItemContent>Run smoke tests</QueueItemContent>
        <QueueItemDescription>Pending</QueueItemDescription>
      </QueueItem>
    </Queue>
  );
}
