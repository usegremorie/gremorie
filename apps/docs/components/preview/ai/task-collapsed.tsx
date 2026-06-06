'use client';

import {
  Task,
  TaskContent,
  TaskItem,
  TaskItemFile,
  TaskTrigger,
} from '@gremorie/rx-ai';

export function TaskCollapsedPreview() {
  return (
    <Task defaultOpen={false}>
      <TaskTrigger title="Generate component scaffold" />
      <TaskContent>
        <TaskItem>Reading registry.json...</TaskItem>
        <TaskItem>
          Wrote <TaskItemFile>src/lib/my-component.tsx</TaskItemFile>
        </TaskItem>
        <TaskItem>
          Wrote <TaskItemFile>src/lib/my-component/index.ts</TaskItemFile>
        </TaskItem>
      </TaskContent>
    </Task>
  );
}
