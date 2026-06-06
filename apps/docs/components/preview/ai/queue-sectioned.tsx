'use client';

import {
  Queue,
  QueueItem,
  QueueItemContent,
  QueueItemIndicator,
} from '@gremorie/rx-ai';

export function QueueSectionedPreview() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium">Backend</p>
        <Queue>
          <QueueItem>
            <QueueItemIndicator completed />
            <QueueItemContent>Migrate schema</QueueItemContent>
          </QueueItem>
          <QueueItem>
            <QueueItemIndicator />
            <QueueItemContent>Seed test data</QueueItemContent>
          </QueueItem>
        </Queue>
      </div>
      <div>
        <p className="text-sm font-medium">Frontend</p>
        <Queue>
          <QueueItem>
            <QueueItemIndicator />
            <QueueItemContent>Update routing</QueueItemContent>
          </QueueItem>
        </Queue>
      </div>
    </div>
  );
}
