'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@gremorie/rx-navigation';
import { BellIcon, CreditCardIcon, UserIcon } from 'lucide-react';

export function TabsWithIconsPreview() {
  return (
    <Tabs defaultValue="profile" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="profile">
          <UserIcon />
          Profile
        </TabsTrigger>
        <TabsTrigger value="billing">
          <CreditCardIcon />
          Billing
        </TabsTrigger>
        <TabsTrigger value="alerts">
          <BellIcon />
          Alerts
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="profile"
        className="mt-4 text-sm text-muted-foreground"
      >
        Your public profile details.
      </TabsContent>
      <TabsContent
        value="billing"
        className="mt-4 text-sm text-muted-foreground"
      >
        Plan, invoices, and payment method.
      </TabsContent>
      <TabsContent value="alerts" className="mt-4 text-sm text-muted-foreground">
        Notification preferences.
      </TabsContent>
    </Tabs>
  );
}
