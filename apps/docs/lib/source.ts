import { loader } from "fumadocs-core/source";
import { icons } from "lucide-react";
import { createElement } from "react";

import { i18n } from "@/lib/i18n";
import { docs } from "@/.source/server";

export const source = loader({
  baseUrl: "/",
  i18n,
  source: docs.toFumadocsSource(),
  icon(icon) {
    if (!icon) return undefined;
    if (icon in icons)
      return createElement(icons[icon as keyof typeof icons]);
  }
});
