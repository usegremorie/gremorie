"use client";

import { cn } from "@gremorie/rx-core";
import { FeaturedIcon } from "@gremorie/rx-display";
import { Button, ToggleGroup, ToggleGroupItem } from "@gremorie/rx-forms";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
      "flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm",
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
      // `items-stretch` lets the featured icon match the height of the
      // title + description block (see ArtifactFeaturedIcon).
      "flex items-stretch gap-3 border-b bg-muted/50 px-4 py-3",
      className
    )}
    {...props}
  />
);

/**
 * The featured icon that anchors the header (optional).
 *
 * It is **square and sized to the title + description block**, not a fixed
 * `size` — `self-stretch` + `aspect-square` make it as tall as the heading and
 * as wide as it is tall, so it tracks the text height (one line of title + one
 * line of description ≈ 40px; if the description wraps, the icon grows with it).
 */
export type ArtifactFeaturedIconProps = ComponentProps<typeof FeaturedIcon>;

export const ArtifactFeaturedIcon = ({
  className,
  ...props
}: ArtifactFeaturedIconProps) => (
  // A `self-stretch` wrapper gives the icon a *resolved* height (the title +
  // description block), so the inner `h-full aspect-square` can derive a real
  // square width from it. (A bare `aspect-square` on a flex-stretched item is
  // ignored — its height isn't a "definite" size.)
  <div className="flex shrink-0 self-stretch">
    <FeaturedIcon
      color="brand"
      className={cn(
        "h-full w-auto aspect-square [&_svg]:size-5",
        className
      )}
      {...props}
    />
  </div>
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
  heading?: string;
  align?: "start" | "end";
  className?: string;
}

/**
 * Icon-triggered dropdown for header actions (Download, More, …). Generic —
 * the trigger icon, heading and items are all passed in.
 */
export const ArtifactMenu = ({
  icon: Icon,
  label,
  items,
  heading,
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
      {heading ? <DropdownMenuLabel>{heading}</DropdownMenuLabel> : null}
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
