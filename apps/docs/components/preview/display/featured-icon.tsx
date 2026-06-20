'use client';

import { FeaturedIcon } from '@gremorie/rx-display';
import {
  CheckIcon,
  CircleAlertIcon,
  RocketIcon,
  SparklesIcon,
} from 'lucide-react';

export function FeaturedIconPreview() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs">color × theme</span>
        <div className="flex flex-wrap items-center gap-3">
          <FeaturedIcon color="primary" theme="light" icon={SparklesIcon} />
          <FeaturedIcon color="primary" theme="solid" icon={SparklesIcon} />
          <FeaturedIcon color="primary" theme="outline" icon={SparklesIcon} />
          <FeaturedIcon color="success" theme="light" icon={CheckIcon} />
          <FeaturedIcon color="error" theme="light" icon={CircleAlertIcon} />
          <FeaturedIcon color="gray" theme="light" icon={RocketIcon} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs">size</span>
        <div className="flex flex-wrap items-center gap-3">
          <FeaturedIcon size="sm" icon={RocketIcon} />
          <FeaturedIcon size="md" icon={RocketIcon} />
          <FeaturedIcon size="lg" icon={RocketIcon} />
          <FeaturedIcon size="xl" icon={RocketIcon} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs">shape</span>
        <div className="flex flex-wrap items-center gap-3">
          <FeaturedIcon shape="square" icon={SparklesIcon} />
          <FeaturedIcon shape="circle" icon={SparklesIcon} />
        </div>
      </div>
    </div>
  );
}
