'use client';

import {
  WebPreview,
  WebPreviewBody,
  WebPreviewConsole,
  WebPreviewNavigation,
  WebPreviewUrl,
} from '@gremorie/rx-artifacts';

export function WebPreviewConsolePreview() {
  return (
    <WebPreview defaultUrl="https://gremorie.com" className="max-w-2xl">
      <WebPreviewNavigation>
        <WebPreviewUrl />
      </WebPreviewNavigation>
      <WebPreviewBody src="https://gremorie.com" className="h-[180px]" />
      <WebPreviewConsole
        logs={[
          {
            level: 'log',
            message: '[ready] dev server on :5020',
            timestamp: new Date(),
          },
          {
            level: 'warn',
            message: 'Slow render on /components/workflow/canvas',
            timestamp: new Date(),
          },
        ]}
      />
    </WebPreview>
  );
}
