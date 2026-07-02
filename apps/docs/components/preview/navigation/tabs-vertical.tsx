'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@gremorie/rx-navigation';

export function TabsVerticalPreview() {
  return (
    <Tabs
      defaultValue="account"
      orientation="vertical"
      className="w-full max-w-md flex-row"
    >
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="text-sm text-muted-foreground">
        Update your name, email, and avatar.
      </TabsContent>
      <TabsContent value="security" className="text-sm text-muted-foreground">
        Manage password and two-factor authentication.
      </TabsContent>
      <TabsContent
        value="notifications"
        className="text-sm text-muted-foreground"
      >
        Choose which emails and alerts you receive.
      </TabsContent>
    </Tabs>
  );
}
