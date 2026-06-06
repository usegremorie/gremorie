'use client';

import {
  WebPreview,
  WebPreviewBody,
  WebPreviewNavigation,
  WebPreviewUrl,
} from '@gremorie/rx-artifacts';

export function WebPreviewPreview() {
  return (
    <WebPreview defaultUrl="https://gremorie.com" className="max-w-2xl">
      <WebPreviewNavigation>
        <WebPreviewUrl />
      </WebPreviewNavigation>
      <WebPreviewBody src="https://gremorie.com" className="h-[240px]" />
    </WebPreview>
  );
}
