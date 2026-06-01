/**
 * @gremorie/angular — the complete Angular edition of Gremorie in one package.
 *
 * Install a single package and use any primitive:
 *   npm i @gremorie/angular
 *   import { Badge, Carousel, Reasoning } from "@gremorie/angular";
 *
 * This is a convenience meta-package: the per-category packages
 * (@gremorie/ng-display, @gremorie/ng-ai, ...) stay available for granular
 * installs and the `gremorie add` registry.
 *
 * Optional add-ons (blocks, artifacts) are NOT meant to live here — install
 * those from their own packages when you need them.
 */
export * from '@gremorie/ng-core';
export * from '@gremorie/ng-ai';
export * from '@gremorie/ng-display';
export * from '@gremorie/ng-containers';
export * from '@gremorie/ng-data';
export * from '@gremorie/ng-feedback';
