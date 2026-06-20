import {
  lucideBookmark,
  lucideChartColumn,
  lucideChartLine,
  lucideChartPie,
  lucideChartScatter,
  lucideCopy,
  lucideDownload,
  lucideEllipsis,
  lucideImageDown,
  lucideRefreshCw,
  lucideSheet,
  lucideTable,
} from '@ng-icons/lucide';

/**
 * The lucide glyph set the artifact surfaces register with `@ng-icons`. Both the
 * shell (`ArtifactFeaturedIcon`, `ArtifactMenu`, `ArtifactViewToggle`) and the
 * `ChartArtifact` preset provide this so any of these names can be passed to an
 * `icon` input. Consumers can register additional icons on their own host.
 */
export const ARTIFACT_ICONS = {
  lucideChartColumn,
  lucideChartLine,
  lucideChartPie,
  lucideChartScatter,
  lucideTable,
  lucideDownload,
  lucideImageDown,
  lucideSheet,
  lucideCopy,
  lucideBookmark,
  lucideRefreshCw,
  lucideEllipsis,
} as const;
