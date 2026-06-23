import {
  Bot,
  Calendar,
  ChartColumnBig,
  type LucideIcon,
  Layers,
  LayoutGrid,
  ListChecks,
  MessageCircle,
  Navigation,
  PanelsTopLeft,
  Sparkles,
  SquareMousePointer,
  SquarePen,
  Type,
  Wrench,
} from 'lucide-react';

/**
 * The component catalog, mirroring the docs information architecture
 * (apps/docs/content/components/meta.json) - the hierarchy we already defined.
 * Categories collapse/expand in the sidebar; a category with a single item
 * renders as a direct link (a leaf, e.g. Form). Only components that have a
 * workbench contract are interactive; the rest are shown as the roadmap.
 */
export interface NavCategory {
  /** Stable key. */
  key: string;
  /** Display label. */
  label: string;
  /** Sidebar icon. */
  icon: LucideIcon;
  /** Component names (must match contract names to be interactive). */
  items: string[];
}

export interface NavSection {
  title: string;
  categories: NavCategory[];
}

export const NAV: NavSection[] = [
  {
    title: 'AI',
    categories: [
      {
        key: 'chatbot',
        label: 'Chatbot',
        icon: Bot,
        items: [
          'chain-of-thought',
          'checkpoint',
          'confirmation',
          'context',
          'conversation',
          'inline-citation',
          'message',
          'model-selector',
          'plan',
          'prompt-input',
          'queue',
          'reasoning',
          'shimmer',
          'sources',
          'suggestion',
          'task',
          'tool',
        ],
      },
      {
        key: 'artifact',
        label: 'Artifact',
        icon: Sparkles,
        items: ['artifact', 'chart-artifact', 'code-block', 'web-preview'],
      },
      {
        key: 'utilities',
        label: 'Utilities',
        icon: Wrench,
        items: ['image', 'open-in-chat'],
      },
    ],
  },
  {
    title: 'Inputs',
    categories: [
      { key: 'form', label: 'Form', icon: SquarePen, items: ['form'] },
      {
        key: 'buttons',
        label: 'Buttons',
        icon: SquareMousePointer,
        items: ['button', 'button-group', 'toggle', 'toggle-group'],
      },
      {
        key: 'text',
        label: 'Text',
        icon: Type,
        items: ['input', 'input-group', 'input-otp', 'textarea', 'label'],
      },
      {
        key: 'selection',
        label: 'Selection',
        icon: ListChecks,
        items: ['checkbox', 'radio-group', 'select', 'slider', 'switch'],
      },
      {
        key: 'date',
        label: 'Date',
        icon: Calendar,
        items: ['calendar', 'date-picker'],
      },
    ],
  },
  {
    title: 'Layout & display',
    categories: [
      {
        key: 'display',
        label: 'Display',
        icon: LayoutGrid,
        items: [
          'accordion',
          'avatar',
          'badge',
          'card',
          'carousel',
          'collapsible',
          'separator',
          'table',
        ],
      },
      {
        key: 'data',
        label: 'Data',
        icon: ChartColumnBig,
        items: [
          'area-chart',
          'bar-chart',
          'line-chart',
          'pie-chart',
          'radar-chart',
          'radial-chart',
          'scatter-chart',
        ],
      },
      {
        key: 'containers',
        label: 'Containers',
        icon: PanelsTopLeft,
        items: ['aspect-ratio', 'resizable', 'scroll-area', 'stack'],
      },
    ],
  },
  {
    title: 'Interaction',
    categories: [
      {
        key: 'overlays',
        label: 'Overlays',
        icon: Layers,
        items: [
          'alert-dialog',
          'command',
          'context-menu',
          'dialog',
          'drawer',
          'dropdown-menu',
          'hover-card',
          'popover',
          'sheet',
          'sonner',
          'tooltip',
        ],
      },
      {
        key: 'navigation',
        label: 'Navigation',
        icon: Navigation,
        items: [
          'breadcrumb',
          'menubar',
          'navigation-menu',
          'pagination',
          'sidebar',
          'tabs',
        ],
      },
      {
        key: 'feedback',
        label: 'Feedback',
        icon: MessageCircle,
        items: ['alert', 'progress', 'skeleton'],
      },
    ],
  },
];

/** The category key that contains a given component (for auto-expanding). */
export function categoryOf(name: string): string | undefined {
  for (const section of NAV) {
    for (const cat of section.categories) {
      if (cat.items.includes(name)) return cat.key;
    }
  }
  return undefined;
}
