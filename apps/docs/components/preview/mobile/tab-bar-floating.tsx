'use client';

import { TabBar, TabBarItem } from '@gremorie/rx-navigation';
import {
  BellIcon,
  HouseIcon,
  LibraryIcon,
  SearchIcon,
  UserIcon,
} from 'lucide-react';
import { useState } from 'react';

import { PhoneFrame } from './phone-frame';

export function TabBarFloatingPreview() {
  const [tab, setTab] = useState('home');
  return (
    <PhoneFrame>
      <TabBar
        aria-label="Example"
        className="absolute"
        onValueChange={setTab}
        value={tab}
        variant="floating"
      >
        <TabBarItem icon={HouseIcon} label="Home" value="home" />
        <TabBarItem icon={SearchIcon} label="Search" value="search" />
        <TabBarItem icon={LibraryIcon} label="Library" value="library" />
        <TabBarItem badge={3} icon={BellIcon} label="Inbox" value="inbox" />
        <TabBarItem icon={UserIcon} label="Profile" value="profile" />
      </TabBar>
    </PhoneFrame>
  );
}
