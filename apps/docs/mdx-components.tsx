import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Banner } from 'fumadocs-ui/components/banner';
import { Callout } from 'fumadocs-ui/components/callout';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import defaultMdxComponents from 'fumadocs-ui/mdx';

import type { MDXComponents } from 'mdx/types';

import { BlockCard } from '@/components/blocks-gallery/block-card';
import { ComponentPreview } from '@/components/component-preview';
import { ArtifactPreview } from '@/components/preview/artifacts';
import { BlockPreview } from '@/components/preview/blocks';
import { PropsTable } from '@/components/props-table';

/**
 * Global MDX components for the KDS docs site.
 *
 * Extends Fumadocs' default MDX components with the rich-content
 * primitives we use across corpus, platform and UI pages — tabs, steps,
 * accordion, callouts, files, type tables, banner, and image zoom.
 *
 * Per ADR-017, custom MDX components are registered globally here
 * so MDX pages don't need per-file imports.
 */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...TabsComponents,
    Accordion,
    Accordions,
    Banner,
    Callout,
    Card,
    Cards,
    File,
    Files,
    Folder,
    ImageZoom,
    Step,
    Steps,
    TypeTable,
    ArtifactPreview,
    BlockCard,
    BlockPreview,
    ComponentPreview,
    PropsTable,
    ...components,
  };
}
