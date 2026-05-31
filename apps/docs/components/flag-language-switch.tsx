"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "fumadocs-ui/components/ui/popover";
import { useI18n } from "fumadocs-ui/contexts/i18n";
import { useState } from "react";

/**
 * Flag-based language switcher (replaces Fumadocs' default text toggle).
 *
 * Reads the i18n context provided app-wide by `<RootProvider i18n>` —
 * `locale`, the available `locales`, and `onChange` (which redirects to the
 * localized path). Because the context comes from RootProvider (not the
 * layout's `i18n` prop), this works even though we drop that prop to hide the
 * built-in toggle.
 *
 * Flags are the circular, minimalist SVGs from the `circle-flags` library
 * (HatScripts, MIT), vendored to `public/flags/{us,br}.svg` so they're
 * self-hosted (no runtime CDN dependency). Rendered via <img> so each SVG's
 * internal `id="a"` mask stays in its own document (no ID collision).
 */

type Flag = { src: string; alt: string };

const FALLBACK_FLAG: Flag = { src: "/flags/us.svg", alt: "" };

const FLAGS: Record<string, Flag> = {
  en: { src: "/flags/us.svg", alt: "United States flag" },
  pt: { src: "/flags/br.svg", alt: "Brazil flag" }
};

const cn = (...parts: Array<string | false | undefined>): string =>
  parts.filter(Boolean).join(" ");

export function FlagLanguageSwitch({
  className
}: {
  className?: string;
}): React.ReactElement | null {
  const { locale, locales, onChange, text } = useI18n();
  const [open, setOpen] = useState(false);

  if (!locales?.length) return null;

  const active = FLAGS[locale ?? "en"] ?? FALLBACK_FLAG;
  const label = text?.chooseLanguage ?? "Language";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={label}
        className={cn(
          "inline-flex size-9 items-center justify-center rounded-full",
          "text-fd-muted-foreground transition-colors",
          "hover:bg-fd-accent hover:text-fd-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring",
          "data-[state=open]:bg-fd-accent",
          className
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={active.src}
          alt=""
          width={22}
          height={22}
          className="size-[22px] rounded-full ring-1 ring-fd-border"
        />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="flex w-44 flex-col gap-0.5 p-1"
      >
        <p className="p-2 text-xs font-medium text-fd-muted-foreground">
          {label}
        </p>
        {locales.map((item) => {
          const flag = FLAGS[item.locale] ?? FALLBACK_FLAG;
          const isActive = item.locale === locale;
          return (
            <button
              key={item.locale}
              type="button"
              aria-current={isActive ? "true" : undefined}
              onClick={() => {
                if (!isActive) onChange?.(item.locale);
                setOpen(false);
              }}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-start text-sm transition-colors",
                isActive
                  ? "bg-fd-primary/10 text-fd-primary"
                  : "text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={flag.src}
                alt=""
                width={20}
                height={20}
                className="size-5 shrink-0 rounded-full ring-1 ring-fd-border"
              />
              {item.name}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
