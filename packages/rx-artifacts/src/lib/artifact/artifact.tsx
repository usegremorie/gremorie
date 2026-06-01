"use client";

import { cn } from "@gremorie/rx-core";
import { FeaturedIcon } from "@gremorie/rx-display";
import { Button, ToggleGroup, ToggleGroupItem } from "@gremorie/rx-forms";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@gremorie/rx-overlays";
import { type LucideIcon, XIcon } from "lucide-react";
import type { ComponentProps, HTMLAttributes, ReactNode } from "react";

/**
 * Artifact — the generic shell that wraps a piece of styled content (a chart,
 * a table, markdown, …) as a card with a header (featured icon · title ·
 * description · actions) and a content area.
 *
 * The shell is **content-agnostic**: it never knows what it holds. Typed
 * presets (`ChartArtifact`, `MarkdownArtifact`, …) compose it, filling the
 * actions slot with content-appropriate controls and dropping the styled
 * component into `ArtifactContent`.
 */

export type ArtifactProps = HTMLAttributes<HTMLDivElement>;

export const Artifact = ({ className, ...props }: ArtifactProps) => (
  <div
    className={cn(
      // `@container/artifact` lets the header adapt to the CARD's own width
      // (not the viewport), so actions collapse/expand based on how much room
      // the card actually has. `min-w-[280px]` keeps icon + truncated title +
      // a menu button always legible.
      "@container/artifact flex min-w-[280px] flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
);

export type ArtifactHeaderProps = HTMLAttributes<HTMLDivElement>;

export const ArtifactHeader = ({
  className,
  ...props
}: ArtifactHeaderProps) => (
  <div
    className={cn(
      // Header shares the card surface (white on light); only the bottom
      // border separates it from the content. `items-stretch` lets the
      // featured icon match the height of the title + description block.
      "flex items-stretch gap-3 border-b px-4 py-3",
      className
    )}
    {...props}
  />
);

/**
 * The featured icon that anchors the header (optional). A fixed 40px square
 * (`size="md"`), aligned to the top of the title + description block.
 *
 * (An earlier version tried to stretch the icon to the heading's height via
 * `self-stretch` + `aspect-square`, but a flex-stretched item's height isn't a
 * "definite" size, so `aspect-square` couldn't derive a width — the icon
 * overflowed its zero-width track and overlapped the title. A fixed 40px square
 * is the title+description height anyway, and avoids that bug.)
 */
export type ArtifactFeaturedIconProps = ComponentProps<typeof FeaturedIcon>;

export const ArtifactFeaturedIcon = ({
  className,
  ...props
}: ArtifactFeaturedIconProps) => (
  <FeaturedIcon
    color="brand"
    size="md"
    className={cn("shrink-0 self-start", className)}
    {...props}
  />
);

/** Title + description block; flexes to fill so actions sit on the right. */
export type ArtifactHeadingProps = HTMLAttributes<HTMLDivElement>;

export const ArtifactHeading = ({
  className,
  ...props
}: ArtifactHeadingProps) => (
  <div className={cn("min-w-0 flex-1", className)} {...props} />
);

export type ArtifactTitleProps = HTMLAttributes<HTMLParagraphElement>;

export const ArtifactTitle = ({ className, ...props }: ArtifactTitleProps) => (
  <p
    className={cn("truncate font-medium text-foreground text-sm", className)}
    {...props}
  />
);

export type ArtifactDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const ArtifactDescription = ({
  className,
  ...props
}: ArtifactDescriptionProps) => (
  <p
    className={cn("truncate text-muted-foreground text-sm", className)}
    {...props}
  />
);

export type ArtifactActionsProps = HTMLAttributes<HTMLDivElement>;

export const ArtifactActions = ({
  className,
  ...props
}: ArtifactActionsProps) => (
  <div className={cn("flex shrink-0 items-center gap-1", className)} {...props} />
);

/**
 * Header actions shown ONLY when the card is wide enough (≥ 448px / `@28rem`,
 * via the `@container/artifact` on `Artifact`). Put the **primary** actions
 * here (e.g. the Download menu); on a narrow card they hide and you surface the
 * same actions through the collapsed More menu instead.
 *
 * Note: the view toggle is intentionally NOT wrapped in this — it stays visible
 * at every width.
 */
export const ArtifactActionsExpanded = ({
  className,
  ...props
}: ArtifactActionsProps) => (
  <div
    className={cn(
      "hidden shrink-0 items-center gap-1 @[28rem]/artifact:flex",
      className
    )}
    {...props}
  />
);

/**
 * Header action shown ONLY when the card is narrow (< 448px). Put the single
 * collapsed **More** menu here — it carries every action (primary + secondary)
 * when there's no room to expand them.
 */
export const ArtifactActionsCollapsed = ({
  className,
  ...props
}: ArtifactActionsProps) => (
  <div
    className={cn(
      "flex shrink-0 items-center gap-1 @[28rem]/artifact:hidden",
      className
    )}
    {...props}
  />
);

export type ArtifactActionProps = ComponentProps<typeof Button> & {
  tooltip?: string;
  label?: string;
  icon?: LucideIcon;
};

export const ArtifactAction = ({
  tooltip,
  label,
  icon: Icon,
  children,
  className,
  size = "icon-sm",
  variant = "ghost",
  ...props
}: ArtifactActionProps) => {
  const button = (
    <Button
      className={cn("text-muted-foreground hover:text-foreground", className)}
      size={size}
      type="button"
      variant={variant}
      {...props}
    >
      {Icon ? <Icon className="size-4" /> : children}
      <span className="sr-only">{label || tooltip}</span>
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};

export type ArtifactCloseProps = ComponentProps<typeof Button>;

export const ArtifactClose = ({
  className,
  children,
  size = "icon-sm",
  variant = "ghost",
  ...props
}: ArtifactCloseProps) => (
  <Button
    className={cn("text-muted-foreground hover:text-foreground", className)}
    size={size}
    type="button"
    variant={variant}
    {...props}
  >
    {children ?? <XIcon className="size-4" />}
    <span className="sr-only">Close</span>
  </Button>
);

/** One option in an `ArtifactViewToggle`. */
export interface ArtifactViewOption {
  value: string;
  icon: LucideIcon;
  label: string;
}

export interface ArtifactViewToggleProps {
  value: string;
  onValueChange: (value: string) => void;
  options: ArtifactViewOption[];
  className?: string;
}

/**
 * Segmented view switch for the header (chart ⇄ table, preview ⇄ raw, …).
 * Generic — each preset passes its own `options`.
 */
export const ArtifactViewToggle = ({
  value,
  onValueChange,
  options,
  className,
}: ArtifactViewToggleProps) => (
  <ToggleGroup
    type="single"
    value={value}
    onValueChange={(v) => v && onValueChange(v)}
    variant="outline"
    size="sm"
    className={cn("mr-1", className)}
  >
    {options.map((o) => (
      <ToggleGroupItem key={o.value} value={o.value} aria-label={o.label}>
        <o.icon className="size-4" />
      </ToggleGroupItem>
    ))}
  </ToggleGroup>
);

/** One row in an `ArtifactMenu` (or the literal `"separator"`). */
export interface ArtifactMenuItem {
  label: ReactNode;
  icon?: LucideIcon;
  onSelect?: () => void;
}

export interface ArtifactMenuProps {
  icon: LucideIcon;
  label: string;
  items: (ArtifactMenuItem | "separator")[];
  align?: "start" | "end";
  className?: string;
}

/**
 * Icon-triggered dropdown for header actions (Download, More, …). Generic —
 * the trigger icon and items are passed in. No heading: just the options.
 */
export const ArtifactMenu = ({
  icon: Icon,
  label,
  items,
  align = "end",
  className,
}: ArtifactMenuProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={cn("text-muted-foreground hover:text-foreground", className)}
        aria-label={label}
      >
        <Icon className="size-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align={align} className="w-44">
      {items.map((it, i) =>
        it === "separator" ? (
          <DropdownMenuSeparator key={i} />
        ) : (
          <DropdownMenuItem key={i} onSelect={() => it.onSelect?.()}>
            {it.icon ? <it.icon className="size-4" /> : null}
            {it.label}
          </DropdownMenuItem>
        )
      )}
    </DropdownMenuContent>
  </DropdownMenu>
);

export type ArtifactContentProps = HTMLAttributes<HTMLDivElement>;

export const ArtifactContent = ({
  className,
  ...props
}: ArtifactContentProps) => (
  <div className={cn("flex-1 overflow-auto p-4", className)} {...props} />
);
