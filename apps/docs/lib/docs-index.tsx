import { Cards, Card } from 'fumadocs-ui/components/card';
import { Fragment, type ReactNode } from 'react';

import { i18n } from '@/lib/i18n';
import { source } from '@/lib/source';

/*
 * Auto-generated "Overview" index.
 *
 * On a tab's landing page (e.g. /corpus, /components), render an index of the
 * tab's contents as a grid of <Cards>, grouped by the section separators
 * (---Section---) that organize the sidebar. Fumadocs v16 removed
 * <DocsCategory>, so we build it from the page tree.
 *
 * Tab folders don't carry an `index` field — their landing page is the FIRST
 * `page` child (our "Visão geral"). So we only render when `url` is the first
 * page of a TOP-LEVEL (tab) folder; on every other page this returns null.
 */

// Page-tree nodes are loosely typed on purpose. Fumadocs' `PageTree` shape is a
// deep discriminated union exported only under mangled internal names, so this
// small index helper reads well-known fields off an `any` node instead. The
// runtime shape is stable; the unsafe-* family is disabled for this file only.
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-redundant-type-constituents */
type Node = any;

/** The top-level tab folder whose landing (first page) is `url`, else null. */
function findTabFolder(tree: Node, url: string): Node | null {
  for (const folder of tree?.children ?? []) {
    if (folder.type !== 'folder') continue;
    const firstPage = (folder.children ?? []).find(
      (c: Node) => c.type === 'page',
    );
    if (firstPage?.url === url) return folder;
  }
  return null;
}

/** First reachable page URL inside a node (for categories without an index). */
function firstUrl(node: Node): string | undefined {
  if (node?.type === 'page' && node.url) return node.url;
  for (const c of node?.children ?? []) {
    const u = firstUrl(c);
    if (u) return u;
  }
  return undefined;
}

interface Entry {
  name: ReactNode;
  url: string;
  icon?: ReactNode;
  description?: ReactNode;
}

export function DocsIndex({
  url,
  lang,
}: {
  url: string;
  lang?: string;
}): ReactNode {
  const tree = source.getPageTree(lang ?? i18n.defaultLanguage);
  const folder = findTabFolder(tree, url);
  if (!folder) return null;

  // The blocks landing page curates its own gallery (thumbnailed BlockCards in
  // the MDX), so the auto index would duplicate the same six entries above it.
  if (/\/blocks$/.test(url)) return null;

  const groups: { section: ReactNode | null; items: Entry[] }[] = [];
  let current: { section: ReactNode | null; items: Entry[] } = {
    section: null,
    items: [],
  };

  for (const child of folder.children ?? []) {
    if (child.type === 'separator') {
      if (current.items.length) groups.push(current);
      current = { section: child.name, items: [] };
    } else if (child.type === 'folder') {
      const href = firstUrl(child);
      if (!href) continue;
      // Category description lives in the folder's meta.json, not on the tree
      // node — pull it via getNodeMeta (fall back to any node-level value).
      const meta = source.getNodeMeta?.(child) as Node;
      current.items.push({
        name: child.name,
        url: href,
        icon: child.icon,
        description:
          child.description ?? meta?.data?.description ?? meta?.description,
      });
    } else if (child.type === 'page' && child.url !== url) {
      current.items.push({
        name: child.name,
        url: child.url,
        icon: child.icon,
        description: child.description,
      });
    }
  }
  if (current.items.length) groups.push(current);
  if (!groups.length) return null;

  return (
    <>
      {groups.map((g, i) => (
        <Fragment key={i}>
          {g.section ? <h2>{g.section}</h2> : null}
          <Cards>
            {g.items.map((it) => (
              <Card key={it.url} href={it.url} title={it.name} icon={it.icon}>
                {it.description}
              </Card>
            ))}
          </Cards>
        </Fragment>
      ))}
    </>
  );
}
