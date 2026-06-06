'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@gremorie/rx-navigation';

export function TabsPreview() {
  return (
    <Tabs defaultValue="react" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="react">React</TabsTrigger>
        <TabsTrigger value="angular">Angular</TabsTrigger>
        <TabsTrigger value="tokens">Tokens</TabsTrigger>
      </TabsList>
      <TabsContent value="react">
        <p className="mt-4 text-sm text-muted-foreground">
          Install: <code>npx gremorie add rx-tabs</code>
        </p>
      </TabsContent>
      <TabsContent value="angular">
        <p className="mt-4 text-sm text-muted-foreground">
          Install: <code>npx gremorie add ng-tabs</code>
        </p>
      </TabsContent>
      <TabsContent value="tokens">
        <p className="mt-4 text-sm text-muted-foreground">
          Tokens are framework-agnostic - see the Tokens tab.
        </p>
      </TabsContent>
    </Tabs>
  );
}
