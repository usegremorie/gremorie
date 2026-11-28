import { TooltipProvider } from '@gremorie/rx-overlays';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

// The saved theme is already dark when React renders on the client, but the
// server never knows it: the first render must not depend on it, or hydration
// fails and React redraws <html>, dropping the appearance attributes.
vi.mock('next-themes', () => ({
  useTheme: () => ({ resolvedTheme: 'dark', setTheme: () => undefined }),
}));

import { AppearanceControls } from './appearance-controls';

describe('AppearanceControls first render', () => {
  it('does not depend on the resolved theme', () => {
    const html = renderToString(
      <TooltipProvider>
        <AppearanceControls lang="en" />
      </TooltipProvider>,
    );
    expect(html).toContain('aria-label="Dark theme"');
    expect(html).not.toContain('aria-label="Light theme"');
  });
});
