import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-3xl font-semibold">Gremorie</h1>
      <p className="max-w-prose text-fd-muted-foreground">
        AI-native design system. Angular first; React coming. Distributed via
        registry and MCP server so language models can generate code that
        matches the system instead of hallucinating.
      </p>
      <Link
        href="/docs"
        className="rounded-md bg-fd-primary px-4 py-2 font-medium text-fd-primary-foreground"
      >
        Read the docs
      </Link>
    </main>
  );
}
