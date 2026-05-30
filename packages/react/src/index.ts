/**
 * @gremorie/react — the complete React edition of Gremorie in one package.
 *
 * Install a single package and import any primitive:
 *   npm i @gremorie/react
 *   import { Button, Card, Message } from "@gremorie/react";
 *
 * Tree-shaking keeps only what you import in your final bundle.
 *
 * This is a convenience meta-package: the per-category packages
 * (@gremorie/rx-forms, @gremorie/rx-display, @gremorie/rx-ai, ...) stay
 * available for granular installs and the `gremorie add` registry.
 *
 * Optional add-ons (blocks, artifacts) are NOT meant to live here — install
 * those from their own packages when you need them.
 *
 * NOTE: "artifacts" currently ship inside @gremorie/rx-ai; once they are
 * extracted into their own package they will be dropped from this meta.
 */
export * from "@gremorie/rx-core";
export * from "@gremorie/rx-forms";
export * from "@gremorie/rx-display";
export * from "@gremorie/rx-overlays";
export * from "@gremorie/rx-feedback";
export * from "@gremorie/rx-navigation";
export * from "@gremorie/rx-containers";
export * from "@gremorie/rx-data";
export * from "@gremorie/rx-ai";
