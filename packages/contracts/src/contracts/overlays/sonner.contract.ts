import { defineContract } from '../../types';

/**
 * Sonner (Toaster) - app-root mount for transient toast notifications,
 * fired imperatively via `toast()`.
 * React: `@gremorie/rx-overlays` (sonner). Angular: `@gremorie/ng-overlays`
 * (spartan brain `BrnSonnerToaster`).
 */
export const sonner = defineContract({
  name: 'sonner',
  category: 'overlays',
  status: 'stable',
  anatomy: `
    <sonner>
    └─ Toaster (single app-root mount; no consumer sub-components)
       └─ (toasts stacked by position)
          ├─ icon (success | info | warning | error | loading)
          ├─ title + description
          └─ action / cancel button
    toast(message, options) - imperative API (toast.success/error/warning/info/loading/promise)`,
  props: [
    {
      name: 'theme',
      type: "'light' | 'dark' | 'system'",
      default: 'system',
      options: ['light', 'dark', 'system'],
      desc: 'Toaster: color theme; system resolves against the .dark class (RX) / OS preference (NG).',
    },
    {
      name: 'position',
      type: "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'",
      default: 'bottom-right',
      desc: 'Toaster: where toasts stack on screen.',
    },
    {
      name: 'richColors',
      type: 'boolean',
      default: false,
      desc: 'Toaster: use saturated per-status colors.',
    },
    {
      name: 'expand',
      type: 'boolean',
      default: false,
      desc: 'Toaster: keep the stack expanded instead of collapsed.',
    },
    {
      name: 'closeButton',
      type: 'boolean',
      default: false,
      desc: 'Toaster: render a close button on each toast.',
    },
  ],
  guidance: {
    summary:
      'A single app-root Toaster mount; any descendant fires transient toasts via the imperative toast() API.',
    whenToUse: [
      'Brief, non-blocking feedback after an action: "Saved", "Invite sent", "Failed - retry". Use toast.promise for async flows.',
    ],
    whenNotToUse: [
      {
        text: 'A persistent in-flow status message that stays on the page',
        use: 'alert',
      },
      {
        text: 'A critical error that requires acknowledgment',
        use: 'alert-dialog',
      },
    ],
    rules: [
      'Mount Toaster exactly once at the app root (e.g. layout); do not place it per-page.',
      'Trigger toasts imperatively with toast()/toast.success()/toast.error()/toast.promise() - there is no per-toast component to render.',
      'Theme follows the document .dark class in React (MutationObserver); the Angular brain resolves system against OS prefers-color-scheme, so pass an explicit theme to pin to the KDS .dark convention. Status icons are an icons prop object in React vs `<ng-template>` slot projection in Angular.',
    ],
    example:
      '// app root\n<Toaster position="bottom-right" />\n// anywhere\ntoast.success("Saved");',
  },
  preview: {
    rx: 'interaction-overlays-sonner--workbench',
    ng: 'interaction-overlays-sonner--workbench',
  },
  tag: { rx: 'Toaster', ng: 'gn-sonner' },
  example: {
    theme: 'system',
    position: 'bottom-right',
    richColors: false,
    expand: false,
    closeButton: false,
  },
  figma: { nodeId: null },
});
