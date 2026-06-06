'use client';

import {
  Task,
  TaskContent,
  TaskItem,
  TaskItemFile,
  TaskTrigger,
} from '@gremorie/rx-ai';

export function TaskExpandedPreview() {
  return (
    <Task defaultOpen>
      <TaskTrigger title="Generate component scaffold" />
      <TaskContent>
        <TaskItem>Reading registry.json...</TaskItem>
        <TaskItem>
          Wrote <TaskItemFile>src/lib/my-component.tsx</TaskItemFile>
        </TaskItem>
        <TaskItem>
          Wrote <TaskItemFile>src/lib/my-component/index.ts</TaskItemFile>
        </TaskItem>
        <TaskItem>Updating package exports...</TaskItem>
      </TaskContent>
    </Task>
  );
}
