import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";

import { DocsIndex } from "@/lib/docs-index";
import { source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";

interface PageProps {
  params: Promise<{ lang: string; slug: string[] }>;
}

export default async function Page({ params }: PageProps) {
  const { lang, slug } = await params;
  const page = source.getPage(slug, lang);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{ style: "clerk" }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <DocsIndex url={page.url} lang={lang} />
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { lang, slug } = await params;
  const page = source.getPage(slug, lang);
  if (!page) return {};

  return {
    title: page.data.title,
    description: page.data.description
  };
}

export function generateStaticParams() {
  return source.generateParams();
}
