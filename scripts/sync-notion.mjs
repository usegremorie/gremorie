/**
 * sync-notion.mjs — espelha a árvore da doc (Fumadocs) na base do Notion
 * "Gremorie — Componentes".  CÓDIGO É A FONTE DA VERDADE da estrutura; o Notion
 * é o painel. Status mole (Em dev / Revisando / Precisa revisão) é editado à mão
 * no Notion e NUNCA é sobrescrito por este script.
 *
 * O que o script faz (idempotente):
 *   1. Deriva a árvore Tab → Categoria → Item de apps/docs/content/*\/meta.json
 *      + apps/docs/public/r/{rx,ng} (presença no registry).
 *   2. Casa cada linha com o Notion por uma "Key" estável (path canônico).
 *   3. Cria o que falta, atualiza estrutura/fatos (Doc, Slug, Categoria, Grupo,
 *      npm, Registry, e Sub-items/Item pai).
 *   4. Status React/Angular: só semeia quando vazio; "Planejado" vira "Publicado"
 *      sozinho se o registry passou a ter; qualquer outro valor manual é mantido.
 *   5. (opcional, --mcp)   cria/preenche o select "MCP tool" (qual tool busca a linha).
 *   6. (opcional, --pages) (re)escreve o CORPO de cada página com Doc + a chamada
 *      MCP pronta de copiar + comandos CLI + npm.
 *
 * USO (na raiz do repo):
 *   1. npm i -D @notionhq/client
 *   2. Crie uma integração interna no Notion (notion.so/my-integrations),
 *      compartilhe a página/base "Gremorie — Componentes" com ela, copie o token.
 *   3. export NOTION_TOKEN=secret_xxx
 *      export NOTION_DB_ID=5c900540bf034382b61a70725727bbf6
 *   4. node scripts/sync-notion.mjs                       # DRY-RUN (só o plano)
 *      node scripts/sync-notion.mjs --apply               # estrutura + status
 *      node scripts/sync-notion.mjs --apply --mcp --pages # + select MCP + corpo das páginas
 *
 * Notas:
 *   - Default é DRY-RUN. Nada é escrito sem --apply.
 *   - Throttle de 4 req/s pra respeitar o rate limit do Notion.
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "apps/docs/content");
const REG = path.join(ROOT, "apps/docs/public/r");
const ORIGIN = "https://gremorie.com";

const APPLY = process.argv.includes("--apply");
const WITH_MCP = process.argv.includes("--mcp");   // cria/preenche o select "MCP tool"
const PAGES = process.argv.includes("--pages");    // (re)escreve o corpo de cada página

// ── helpers ────────────────────────────────────────────────────────────────
const readMeta = (rel) => {
  const p = path.join(CONTENT, rel, "meta.json");
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
};
const isFolder = (rel) => existsSync(path.join(CONTENT, rel, "meta.json"));
const titleCase = (s) =>
  s.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");

/** Lê o `title:` do frontmatter de um .mdx (fallback: title-case do slug). */
const pageTitle = (rel, slug) => {
  for (const f of [`${rel}/${slug}.mdx`, `${rel}/${slug}/index.mdx`]) {
    const p = path.join(CONTENT, f);
    if (existsSync(p)) {
      const m = readFileSync(p, "utf8").match(/^---\s*[\r\n]([\s\S]*?)[\r\n]---/);
      const t = m && m[1].match(/^title:\s*["']?(.+?)["']?\s*$/m);
      if (t) return t[1].trim();
    }
  }
  return titleCase(slug);
};

const rxSet = new Set(readdirSync(path.join(REG, "rx")).map((f) => f.replace(/\.json$/, "")));
const ngSet = new Set(readdirSync(path.join(REG, "ng")).map((f) => f.replace(/\.json$/, "")));

// ── MCP mapping ──────────────────────────────────────────────────────────────
// Retorna { tool, call } pra um nó, segundo o que o MCP do Gremorie expõe.
function mcpFor(node) {
  const { kind, tab, slug } = node; // kind: tab|category|item
  const q = (s) => `"${s}"`;
  if (tab === "components") {
    if (kind === "tab") return { tool: "list_components", call: "list_components()" };
    if (kind === "category") return { tool: "search_components", call: `search_components(category=${q(slug)})` };
    return { tool: "get_component", call: `get_component(${q("rx-" + slug)})` };
  }
  if (tab === "artifacts") {
    if (kind === "tab") return { tool: "search_components", call: `search_components(query="artifact")` };
    return { tool: "get_component", call: `get_component(${q("artifact-" + slug)})` };
  }
  if (tab === "blocks") {
    if (kind === "tab") return { tool: "search_components", call: `search_components(query="block")` };
    return { tool: "get_block", call: `get_block(${q("block-" + slug)})` };
  }
  if (tab === "corpus") {
    if (kind === "tab") return { tool: "get_guidelines", call: "get_guidelines()" };
    return { tool: "get_guidelines", call: `get_guidelines(${q(slug)})` };
  }
  // tokens / platform / get-started: não expostos via MCP
  return { tool: "—", call: "—" };
}

// ── corpo da página (Notion blocks) ──────────────────────────────────────────
const pascal = (s) => s.replace(/\s+/g, "");
const rt = (...parts) =>
  parts.filter((p) => p !== "" && p != null).map((p) => {
    if (typeof p === "string") return { type: "text", text: { content: p } };
    if (p.code != null) return { type: "text", text: { content: p.code }, annotations: { code: true } };
    if (p.link != null) return { type: "text", text: { content: p.label, link: { url: p.link } } };
    return { type: "text", text: { content: String(p) } };
  });
const code = (s) => ({ code: s });
const link = (label, url) => ({ label, link: url });
const h3 = (s) => ({ object: "block", type: "heading_3", heading_3: { rich_text: rt(s) } });
const li = (...parts) => ({ object: "block", type: "bulleted_list_item", bulleted_list_item: { rich_text: rt(...parts) } });

/** Blocos do corpo de uma linha: Doc + chamada MCP pronta + CLI + npm. */
function pageBlocks(r) {
  const b = [h3("Como acessar"), li("Doc — ", link(r.doc, r.doc))];
  const ngPub = r.angular === "Publicado";
  if (r.kind === "item" && r.tab === "components") {
    b.push(li("MCP — ", code(`get_component("rx-${r.slug}")`), ...(ngPub ? [" · Angular ", code(`get_component("ng-${r.slug}")`)] : [])));
    b.push(li("Registry / CLI — ", code(`npx gremorie add rx-${r.slug}`), ...(ngPub ? [" · ", code(`ng-${r.slug}`)] : [])));
    b.push(li("npm — ", code("@gremorie/react"), " → ", code(`import { ${pascal(r.title)} }`), ...(ngPub ? [" · ", code("@gremorie/angular")] : [])));
  } else if (r.kind === "item" && r.tab === "artifacts") {
    b.push(li("MCP — ", code(`get_component("artifact-${r.slug}")`)));
    b.push(li("Registry / CLI — ", code(`npx gremorie add artifact-${r.slug}`)));
    b.push(li("npm — ", code("@gremorie/rx-artifacts")));
  } else if (r.kind === "item" && r.tab === "blocks") {
    b.push(li("MCP — ", code(`get_block("block-${r.slug}")`)));
    b.push(li("Registry / CLI — ", code(`npx gremorie add block-${r.slug}`)));
  } else if (r.mcpTool && r.mcpTool !== "—") {
    // tabs, categorias, e corpus (todos os níveis)
    b.push(li("MCP — ", code(r.mcpCall)));
  } else {
    b.push(li("MCP — não exposto (doc apenas)."));
  }
  return b;
}

// ── derivar a árvore desejada ─────────────────────────────────────────────────
const TABS = readMeta("")?.pages ?? [
  "get-started", "corpus", "tokens", "components", "blocks", "artifacts", "platform",
];
const TAB_META = {
  "get-started": { title: "Get Started", icon: "🚀", doc: "/get-started/installation" },
  corpus: { title: "Corpus", icon: "📖", doc: "/corpus" },
  tokens: { title: "Tokens", icon: "🎨", doc: "/tokens" },
  components: { title: "Components", icon: "🧩", doc: "/components/overview" },
  blocks: { title: "Blocks", icon: "🟦", doc: "/blocks" },
  artifacts: { title: "Artifacts", icon: "🧩", doc: "/artifacts" },
  platform: { title: "Platform", icon: "🔧", doc: "/platform/architecture" },
};
// prefixos de registry por tab (pra status React/Angular)
const REG_PREFIX = { components: ["rx-", "ng-"], artifacts: ["artifact-", null], blocks: ["block-", null] };

const rows = []; // {key, parentKey, kind, tab, title, slug, tipo, categoria, grupo, react, angular, npm, registry, doc, icon}

for (const tab of TABS) {
  const meta = readMeta(tab);
  if (!meta) continue;
  const tm = TAB_META[tab] ?? { title: titleCase(tab), icon: "📄", doc: `/${tab}` };
  const tabKey = tab;
  rows.push({
    key: tabKey, parentKey: null, kind: "tab", tab, title: tm.title, slug: tab,
    tipo: "Tab", doc: ORIGIN + tm.doc, icon: tm.icon,
  });

  const [rxp, ngp] = REG_PREFIX[tab] ?? [null, null];

  for (const page of meta.pages) {
    if (page === "index" || page === "overview") continue;
    const rel = `${tab}/${page}`;

    const cmeta = isFolder(rel) ? readMeta(rel) : null;
    const childPages = (cmeta?.pages ?? []).filter(
      (s) => s !== "index" && s !== "overview" && !/^---(.+)---$/.test(s),
    );

    if (cmeta && childPages.length > 0) {
      // CATEGORIA (pasta com filhos reais)
      const cKey = `${tab}/${page}`;
      rows.push({
        key: cKey, parentKey: tabKey, kind: "category", tab, slug: page,
        title: cmeta?.title ?? titleCase(page), tipo: "Categoria",
        doc: `${ORIGIN}/${rel}`,
      });
      let grupo = null;
      for (const sub of cmeta?.pages ?? []) {
        const sm = sub.match(/^---(.+)---$/);
        if (sm) { grupo = sm[1].trim(); continue; }
        if (sub === "index" || sub === "overview") continue;
        const inRx = rxp ? rxSet.has(rxp + sub) : false;
        const inNg = ngp ? ngSet.has(ngp + sub) : false;
        rows.push({
          key: `${rel}/${sub}`, parentKey: cKey, kind: "item", tab, slug: sub,
          title: pageTitle(rel, sub), tipo: tab === "components" ? "Componente" : "Item",
          categoria: tab === "components" ? (cmeta?.title ?? titleCase(page)) : null,
          grupo: tab === "components" ? grupo : null,
          react: rxp ? (inRx ? "Publicado" : "Planejado") : null,
          angular: ngp ? (inNg ? "Publicado" : "Planejado") : (rxp ? "Planejado" : null),
          npm: rxp ? (tab !== "blocks" && inRx) : null,
          registry: rxp ? (inRx || inNg) : null,
          doc: `${ORIGIN}/${rel}/${sub}`,
        });
      }
    } else {
      // ITEM direto no Tab (blocks, artifacts, get-started, platform leaves)
      const inRx = rxp ? rxSet.has(rxp + page) : false;
      const inNg = ngp ? ngSet.has(ngp + page) : false;
      rows.push({
        key: rel, parentKey: tabKey, kind: "item", tab, slug: page,
        title: pageTitle(tab, page),
        tipo: (tab === "blocks" || tab === "artifacts") ? "Componente" : "Item",
        categoria: tab === "artifacts" ? "Artifacts" : tab === "blocks" ? "Blocks" : null,
        react: rxp ? (inRx ? "Publicado" : "Planejado") : null,
        angular: rxp ? "Planejado" : null,
        npm: rxp ? (tab !== "blocks" && inRx) : null,
        registry: rxp ? inRx : null,
        doc: `${ORIGIN}/${rel}`,
      });
    }
  }
}

// anexa MCP
for (const r of rows) {
  const m = mcpFor(r);
  r.mcpTool = m.tool;
  r.mcpCall = m.call;
}

console.log(`Árvore desejada: ${rows.length} linhas (` +
  `${rows.filter(r => r.kind === "tab").length} tabs, ` +
  `${rows.filter(r => r.kind === "category").length} categorias, ` +
  `${rows.filter(r => r.kind === "item").length} itens).`);

// ── Notion ───────────────────────────────────────────────────────────────────
const TOKEN = process.env.NOTION_TOKEN;
const DB_ID = process.env.NOTION_DB_ID;
if (!TOKEN || !DB_ID) {
  console.error("\nFalta NOTION_TOKEN e/ou NOTION_DB_ID no ambiente. Veja o cabeçalho do arquivo.");
  console.error(APPLY ? "Abortando (--apply exige credenciais)." : "Seguindo só com o plano local (dry-run).");
  if (APPLY) process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let _last = 0;
async function throttle() { const d = 250 - (Date.now() - _last); if (d > 0) await sleep(d); _last = Date.now(); }

async function main() {
  const { Client } = await import("@notionhq/client").catch(() => {
    console.error("\n@notionhq/client não instalado. Rode: npm i -D @notionhq/client");
    process.exit(1);
  });
  const notion = new Client({ auth: TOKEN, notionVersion: "2022-06-28" });

  // 1. garante o schema (Key + opcional MCP)
  const props = { Key: { rich_text: {} } };
  if (WITH_MCP) { props["MCP tool"] = { select: {} }; }
  if (APPLY) { await throttle(); await notion.databases.update({ database_id: DB_ID, properties: props }); }
  console.log(WITH_MCP ? "Schema: Key + MCP garantidos." : "Schema: Key garantido (use --mcp p/ colunas MCP).");

  // 2. lê linhas existentes
  const existing = new Map(); // key -> {id, react, angular, parentId}
  const byDoc = new Map();
  let cursor;
  do {
    await throttle();
    const res = await notion.databases.query({ database_id: DB_ID, start_cursor: cursor, page_size: 100 });
    for (const pg of res.results) {
      const p = pg.properties;
      const key = p.Key?.rich_text?.[0]?.plain_text || "";
      const doc = p.Doc?.url || "";
      const rec = {
        id: pg.id, key, doc,
        react: p.React?.select?.name ?? null,
        angular: p.Angular?.select?.name ?? null,
        parentId: p["item principal"]?.relation?.[0]?.id ?? null,
      };
      if (key) existing.set(key, rec);
      if (doc) byDoc.set(doc, rec);
    }
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  console.log(`Notion atual: ${existing.size + [...byDoc.values()].filter(r => !r.key).length} linhas lidas.`);

  // match: por Key; fallback por Doc (1ª rodada, antes de Key existir)
  const find = (r) => existing.get(r.key) || byDoc.get(r.doc) || null;

  // 3. status: preserva manual; semeia vazio; Planejado→Publicado se registry passou a ter
  const resolveStatus = (desired, current) => {
    if (desired == null) return undefined;          // seção sem framework
    if (current == null || current === "") return desired;
    if (current === "Planejado" && desired === "Publicado") return "Publicado";
    return current;                                  // mantém manual
  };

  const text = (v) => (v ? { rich_text: [{ text: { content: String(v) } }] } : { rich_text: [] });
  const sel = (v) => (v && v !== "—" ? { select: { name: v } } : { select: null });

  const keyToId = new Map();
  let created = 0, updated = 0;

  for (const r of rows) {
    const cur = find(r);
    const properties = {
      Componente: { title: [{ text: { content: r.title } }] },
      Tipo: { select: { name: r.tipo } },
      Slug: text(r.slug).rich_text.length ? text(r.slug) : { rich_text: [] },
      Doc: { url: r.doc },
      Key: { rich_text: [{ text: { content: r.key } }] },
    };
    if (r.categoria !== undefined && r.categoria) properties.Categoria = { select: { name: r.categoria } };
    if (r.grupo) properties.Grupo = { select: { name: r.grupo } };
    if (r.react !== null && r.react !== undefined) properties.React = { select: { name: resolveStatus(r.react, cur?.react) ?? r.react } };
    if (r.angular !== null && r.angular !== undefined) properties.Angular = { select: { name: resolveStatus(r.angular, cur?.angular) ?? r.angular } };
    if (r.npm !== null && r.npm !== undefined) properties.npm = { checkbox: !!r.npm };
    if (r.registry !== null && r.registry !== undefined) properties.Registry = { checkbox: !!r.registry };
    if (WITH_MCP) { properties["MCP tool"] = sel(r.mcpTool); }

    if (cur) {
      keyToId.set(r.key, cur.id);
      if (APPLY) { await throttle(); await notion.pages.update({ page_id: cur.id, properties }); }
      updated++;
    } else {
      if (APPLY) {
        await throttle();
        const pg = await notion.pages.create({ parent: { database_id: DB_ID }, icon: r.icon ? { type: "emoji", emoji: r.icon } : undefined, properties });
        keyToId.set(r.key, pg.id);
      } else { keyToId.set(r.key, `(novo:${r.key})`); }
      created++;
    }
  }
  console.log(`Linhas: ${created} a criar, ${updated} a atualizar.`);

  // 4. relações pai (item principal) — só onde mudou
  let rel = 0;
  for (const r of rows) {
    if (!r.parentKey) continue;
    const childId = keyToId.get(r.key);
    const parentId = keyToId.get(r.parentKey);
    const cur = find(r);
    if (cur && cur.parentId === parentId) continue; // já certo
    if (APPLY && childId && parentId && !String(childId).startsWith("(novo")) {
      await throttle();
      await notion.pages.update({ page_id: childId, properties: { "item principal": { relation: [{ id: parentId }] } } });
    }
    rel++;
  }
  console.log(`Relações pai a ajustar: ${rel}.`);

  // 4b. corpo das páginas (Doc + chamada MCP pronta + CLI + npm) — só com --pages.
  //     Idempotente: apaga os blocos existentes e reescreve (o corpo é gerenciado).
  if (PAGES) {
    let pcount = 0;
    for (const r of rows) {
      const id = keyToId.get(r.key);
      if (!id || String(id).startsWith("(novo")) continue;
      if (APPLY) {
        await throttle();
        const kids = await notion.blocks.children.list({ block_id: id, page_size: 100 });
        for (const k of kids.results) { await throttle(); await notion.blocks.delete({ block_id: k.id }); }
        await throttle();
        await notion.blocks.children.append({ block_id: id, children: pageBlocks(r) });
      }
      pcount++;
    }
    console.log(`Corpo de página (re)escrito em ${pcount} linhas.`);
  }

  // 5. órfãos (linhas no Notion sem correspondente no código)
  const wantKeys = new Set(rows.map((r) => r.key));
  const orphans = [...existing.values()].filter((r) => r.key && !wantKeys.has(r.key));
  if (orphans.length) {
    console.log(`\n⚠️  ${orphans.length} linha(s) órfã(s) no Notion (doc removida?) — NÃO apago automaticamente:`);
    orphans.forEach((o) => console.log(`   - ${o.key}  (${o.doc})`));
  }

  console.log(APPLY ? "\n✅ Sync aplicado." : "\n(DRY-RUN — nada escrito. Rode com --apply pra aplicar.)");
}

if (APPLY || TOKEN) {
  main().catch((e) => { console.error("Erro:", e.body || e.message || e); process.exit(1); });
} else {
  console.log("\n(DRY-RUN local sem credenciais — só derivei a árvore. Defina NOTION_TOKEN/NOTION_DB_ID e use --apply pra sincronizar.)");
}
