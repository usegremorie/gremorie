'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@gremorie/rx-navigation';

export function TabsDisabledPreview() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics" disabled>
          Analytics
        </TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent
        value="overview"
        className="mt-4 text-sm text-muted-foreground"
      >
        High-level summary of the workspace.
      </TabsContent>
      <TabsContent
        value="reports"
        className="mt-4 text-sm text-muted-foreground"
      >
        Scheduled and saved reports.
      </TabsContent>
    </Tabs>
  );
}
