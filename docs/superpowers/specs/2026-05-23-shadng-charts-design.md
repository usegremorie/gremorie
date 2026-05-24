# shadng Charts — Design Spec

- **Data:** 2026-05-23
- **Status:** Aprovado (brainstorming)
- **Autor:** Bruno Kalvner + Claude
- **Escopo desta fase:** Fundação de charts para dashboards (Fase 1 headless + Fase 2 styled). Generative UI é fase futura, mas a API é desenhada para habilitá-la.

## Problema

O shadng ("shadcn para Angular, focado em AI") precisa de componentes de **charts** para dashboards e, depois, para **generative UI** (gráficos emitidos por IA). O shadcn usa **Recharts**, que é React-only e não tem porte Angular.

**Insight central:** o valor dos charts do shadcn não é o Recharts em si — é a fina camada de theming por cima (`ChartContainer`/`ChartTooltip`/`ChartLegend` mapeando séries → CSS vars). O Recharts é só o motor de SVG embaixo, e ele usa **D3** (`d3-scale`, `d3-shape`) para a matemática. Essa matemática é **agnóstica de framework**: roda em Angular idêntica. Logo, "Recharts não tem versão Angular" **não é bloqueio** — reescrevemos só a casquinha de renderização (React → Angular), reaproveitando o mesmo motor matemático.

## Decisão de fundação

**Own-the-code sobre primitivas D3** (`d3-scale`, `d3-shape`, `d3-array`, `d3-format`, `d3-time-format`, `d3-interpolate`), renderizando **SVG via templates Angular**. Escolhida sobre wrapper de ngx-charts (não suporta Angular 21; acopla a lib pública ao calendário de releases deles; theming SCSS próprio) e sobre wrapper de Unovis (runtime dep, quebra o "own the code", API de terceiros).

Unovis entra **depois e opcional** (`@shadng/charts-advanced`) só para viz exótica (sankey, network, mapas) e datasets de N alto (canvas).

### Por que não as alternativas
- **ngx-charts (Swimlane):** em `24.x` suporta Angular 18/19, **não Angular 21**; histórico de atraso a cada versão. Acoplaria a compatibilidade da lib pública ao release deles. Theming SCSS próprio, atrito com tokens Tailwind. Não é "own the code".
- **Unovis (F5):** ótimo motor (CSS vars, tree-shakable, breadth enorme), mas é runtime dependency e API própria — vira "wrapper estilizado", não componente que o usuário possui. Reservado para o pacote `-advanced`.
- **Chart.js/ng2-charts, ECharts, ApexCharts:** canvas-based — theming por CSS var difícil, SSR ruim, não-composáveis. Contra a filosofia shadcn.

## Arquitetura

Padrão **headless + styled** (o mesmo brain/helm do spartan-ng que o shadng já usa), em **um pacote** com dois entry points:

```
@shadng/charts                 (pacote único)
├── @shadng/charts/headless    ← FASE 1: o "Recharts for Angular", sem visual
└── @shadng/charts             ← FASE 2: charts shadng (Card + tokens + tooltip/legend)

@shadng/charts-advanced        ← FUTURO/OPCIONAL: wrapper Unovis (sankey, network, mapas, canvas/N alto)
```

**Decisão:** um pacote (não dois). Headless e styled sempre sobem juntos; dois pacotes = version drift sem ganho (Recharts é 1 pacote). `charts-advanced` fica separado porque tem dependência externa pesada (Unovis) — isolá-la é justificável.

Distribuição dupla, como o resto do shadng: **pacote npm publicado** + **entradas no registry do `shadng-cli`** (copy-paste, "own the code").

### Fase 1 — `@shadng/charts/headless` (mecânica, sem estilo)

```
ChartFrame        mede o container (ResizeObserver → signals w/h), define viewBox, provê ChartContext
ChartContext      serviço (DI) que entrega scales + dimensões aos filhos; agrega domínios das séries
scales            wrappers finos de d3-scale: linear, time, band (barras), ordinal (cores/categorias)
shape helpers     wrappers de d3-shape: line, area, arc (pie), lineRadial/areaRadial (radar)
format            wrappers de d3-format / d3-time-format / Intl (ver "Formatação")
Cartesian         XAxis, YAxis, CartesianGrid
Series            Area, Line, Bar (stacked/grouped), Pie/Donut, Radar, RadialBar, Scatter/Bubble
Behaviors         Tooltip (estado), Legend (estado), hover/focus, keyboard nav — sem estilo
AnimationService  injetável, roda fora do Angular (ver "Animação")
```

### Fase 2 — `@shadng/charts` (styled, marca shadng)

```
ChartContainer    Card + wiring dos CSS tokens (--chart-1..N) → cores das séries
ChartTooltip      tooltip estilizado, posicionado via CDK Overlay
ChartLegend       legenda estilizada
presets           AreaChart, BarChart, LineChart, PieChart, RadarChart, RadialChart, ScatterChart
                  → config-driven, uma linha de uso, JSON-serializável (bridge para generative UI)
```

### Conjunto de charts da Fase 1
Area, Line, Bar (stacked/grouped), Pie/Donut, Radar, RadialBar, **Scatter/Bubble**. (Paridade com o set do shadcn + Scatter.)

## Composição (API)

Estilo Recharts — composição por elementos. **Sem prefixo de lib**
(decisão D-14 do projeto: preserva white-label — o usuário copia e é
dono do código, não fica marcado como "shadng"):

```html
<!-- Camada headless: controle total -->
<svg chart-frame [data]="data">
  <g cartesian-grid></g>
  <g x-axis dataKey="month"></g>
  <g y-axis [tickFormat]="'currency:BRL'"></g>
  <path area dataKey="sales" color="var(--chart-1)"></path>
  <path line dataKey="profit" color="var(--chart-2)"></path>
</svg>

<!-- Camada styled: uma linha -->
<area-chart [data]="data" [config]="chartConfig" />
```

## Data flow (signals, zoneless)

Forma de dados igual ao Recharts: **array de records**.

```ts
data   = signal([{ month: 'Jan', sales: 100, profit: 40 }, /* ... */]);
config = signal({
  sales:  { label: 'Vendas', color: 'var(--chart-1)', format: 'currency:BRL' },
  profit: { label: 'Lucro',  color: 'var(--chart-2)', format: 'currency:BRL' },
});
```

- `data` e `config` são `input()` signals.
- `ChartFrame` expõe `width`/`height` via signal (ResizeObserver, client-only).
- Scales e paths são `computed()` → recalculam sozinhos. 100% compatível com o bootstrap zoneless já em uso.

### Shared domains (o problema central — auto-registro)

Na composição, o `ChartFrame` precisa da extensão de **todas** as séries para calcular as scales **antes** de desenhar (ovo-e-galinha). Solução (como o Recharts):

1. Cada série, ao inicializar, **se registra** no `ChartContext` empurrando seu accessor de dados (`dataKey` + canal x/y) num registry signal.
2. O `ChartContext` agrega o domínio combinado como `computed()` sobre o registry.
3. As scales derivam desse domínio agregado; séries leem as scales de volta do context.
4. **Override manual** disponível (`[xDomain]`, `[yDomain]`), mas **auto-compute é o default** (DX melhor; não empurrar declaração de domínio pro usuário).

A ordem de registro é irrelevante porque tudo é signal/`computed`.

## Theming

- Adicionar tokens `--chart-1 … --chart-5` ao tema do shadng (convenção shadcn). Dark mode automático (CSS vars trocam sem re-render).
- **Camada headless é cega a cor:** recebe cor como input (`currentColor` ou nome de var). Zero paleta hardcoded.
- **Camada styled** mapeia `config.color` → tokens. É onde o visual shadng vive.

## Formatação & i18n

- Eixos/tooltip/legenda formatam via `d3-format` (números, %, abreviação) + `d3-time-format` (datas) + `Intl` (locale).
- **Presets nomeados serializáveis** em vez de funções: `'currency:BRL'`, `'percent'`, `'compact'`, `'date:short'`. Resolvidos internamente por um registry de formatters.
- Motivo: o `config` da Camada 2 precisa ser **100% JSON** para a fase de generative UI (a IA emite config, não emite função). Funções customizadas continuam possíveis na camada headless para uso avançado.

## Animação

> Correção de design: o atributo `d` de path SVG **não** é transicionável por CSS de forma confiável. Não usar "CSS transition no `d`".

- Propriedades CSS-animáveis (opacity, `transform` em barras/pontos, `cx`/`cy`): via CSS.
- **Morphing de linha/área:** `d3-interpolate` + `requestAnimationFrame` num `AnimationService` injetável que roda **fora do Angular** (escreve o atributo direto — combina com zoneless).
- Animação é **opcional e plugável**; nunca bloqueia correção. Respeita `prefers-reduced-motion` e um flag global de "animações off".

## Performance

- SVG é a escolha certa para o core (declarativo, temável, acessível, SSR), mas tem teto (~dezenas de milhares de pontos) — o Recharts sofre do mesmo.
- O renderer de série é **plugável** (mesma API, renderer trocável) para um renderer **canvas** poder entrar no futuro **sem quebrar API**.
- Documentar o threshold de N onde se recomenda `@shadng/charts-advanced` (Unovis/canvas) em vez de fingir que SVG resolve tudo.

## Tooltip

- Pointer/focus → busca do ponto mais próximo (`bisector` do `d3-array`) → signal do datum ativo.
- A Camada headless **só expõe o estado** (datum/índice ativo + coords em pixel).
- A Camada styled renderiza o tooltip via **CDK Overlay** (já disponível via spartan). Motivo: precisa **escapar do `overflow` do Card** e fazer **edge-flip/colisão** — exatamente o caso de uso de overlay (não é default preguiçoso).

## Acessibilidade (WCAG 2.2)

- SVG com `role="img"` + `aria-label`/descrição gerada do config.
- **Tabela de dados visualmente-oculta** como fallback para leitor de tela.
- **Navegação por teclado** entre pontos/séries (setas), com foco gerenciado e estado de foco visível.
- **Nunca cor sozinha:** padrões/tracejados opcionais para diferenciar séries (daltonismo).

## SSR (Analog)

- `viewBox` + `preserveAspectRatio` → o gráfico renderiza de forma significativa **antes** do hydrate.
- ResizeObserver, tooltip e animação são **client-only** (`afterNextRender`).

## Testes

- **Unit (vitest):** matemática das scales, geração de path, mapeamento config→série, registry de domínio, formatters — funções puras. **TDD.**
- **Component (vitest/Storybook):** nº correto de elementos (barras/paths/fatias), ativação de tooltip, comportamento de resize, registro de séries.
- **Regressão visual (obrigatória):** Storybook + screenshot Playwright. Um teste unitário passa com o gráfico visualmente quebrado — snapshot visual é necessário para charts.
- **E2E (Playwright):** interações (hover/tooltip, teclado, legenda toggle).

## Distribuição

- Pacote npm `@shadng/charts` publicado (+ `@shadng/charts-advanced` futuro).
- Entradas no registry do `shadng-cli` para copy-paste (headless primitives + presets styled).
- Stories Storybook + docs (Analog) por chart.

## Fora de escopo (agora)

- Generative UI (fase futura — a API config-JSON já habilita).
- `@shadng/charts-advanced` / Unovis (futuro/opcional).
- Renderer canvas (API fica plugável para habilitá-lo depois).
- Interações pesadas (brush, zoom, pan) — fase posterior.
- Maps, sankey, network, treemap, heatmap, gauge — viz exótica vai para `-advanced`.

## Dependências novas (runtime, tree-shakable)

`d3-scale`, `d3-shape`, `d3-array`, `d3-format`, `d3-time-format`, `d3-interpolate`, `d3-path` (apenas módulos matemáticos do D3 — **não** o pacote `d3` monolítico, **não** `d3-selection`).

## Critérios de sucesso

1. Os 7 tipos de chart renderam corretamente (headless + styled), com paridade visual com o shadcn.
2. Theming por token + dark mode automático funcionando.
3. Responsivo (ResizeObserver) e SSR-safe (render antes do hydrate).
4. `config` da Camada 2 é 100% JSON-serializável (pré-requisito de generative UI).
5. A11y: leitor de tela navega os dados; teclado funciona; não depende só de cor.
6. Suíte de testes (unit + visual + e2e) verde.
7. Instalável via npm **e** via `shadng-cli`.
