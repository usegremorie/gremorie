import type { Metadata } from 'next';

import { WorkbenchClient } from '@/components/workbench/workbench-client';
import { i18n } from '@/lib/i18n';

/**
 * The dual-framework component workbench at `/workbench`. Renders the
 * contract-driven 4-column surface (anatomy, controls, React preview, Angular
 * preview) as a client island; the contract manifest is browser-safe so the
 * client imports it directly.
 */
export const metadata: Metadata = {
  title: 'Workbench',
  description:
    'Audit React and Angular components side by side, driven by the agnostic component contract.',
};

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export default function WorkbenchPage() {
  return <WorkbenchClient />;
}
