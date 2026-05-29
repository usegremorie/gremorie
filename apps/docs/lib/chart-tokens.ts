/**
 * Chart token data — manually transcribed from
 * `packages/kds/src/styles/tokens/chart/*.css`.
 */

export interface ChartTokenRow {
  token: string; // full --color-chart-* name
  primitive: string; // primitive ref like blue-200
  meaning?: string; // optional semantic note (used by Status)
}

export interface ChartScheme {
  id: string;
  name: string;
  description: string;
  rows: ChartTokenRow[];
}

export const SEQUENTIAL_SCHEME: ChartScheme = {
  id: "sequential",
  name: "Sequential",
  description:
    "Gradiente de uma única matiz para dados com ordem natural. Cinco stops da paleta blue (200 → 900). Color-blind safe por construção — diferenças são lidas pela claridade, não pela matiz.",
  rows: [
    { token: "--color-chart-seq-1", primitive: "blue-200" },
    { token: "--color-chart-seq-2", primitive: "blue-400" },
    { token: "--color-chart-seq-3", primitive: "blue-600" },
    { token: "--color-chart-seq-4", primitive: "blue-700" },
    { token: "--color-chart-seq-5", primitive: "blue-900" }
  ]
};

export const CATEGORICAL_SCHEME: ChartScheme = {
  id: "categorical",
  name: "Categorical",
  description:
    "Oito hues perceptualmente distintos para dados nominais. Vai até 8 porque é o teto prático de leitura — acima disso, mesmo paletas bem construídas começam a confundir séries.",
  rows: [
    { token: "--color-chart-cat-1", primitive: "blue-600" },
    { token: "--color-chart-cat-2", primitive: "orange-500" },
    { token: "--color-chart-cat-3", primitive: "emerald-600" },
    { token: "--color-chart-cat-4", primitive: "violet-600" },
    { token: "--color-chart-cat-5", primitive: "rose-500" },
    { token: "--color-chart-cat-6", primitive: "cyan-600" },
    { token: "--color-chart-cat-7", primitive: "amber-600" },
    { token: "--color-chart-cat-8", primitive: "fuchsia-600" }
  ]
};

export const DIVERGENT_SCHEME: ChartScheme = {
  id: "divergent",
  name: "Divergent",
  description:
    "Sete stops bipolares com pivô neutro: cool (blue) → neutral → warm (rose). Para dado contínuo com midpoint significativo (zero, média, baseline). Inspirado no ColorBrewer RdBu — Red-Blue, e não Red-Green, porque Red-Green é inacessível para 8% dos homens com deficiência de visão de cor.",
  rows: [
    { token: "--color-chart-div-1", primitive: "blue-700", meaning: "Polo frio (forte)" },
    { token: "--color-chart-div-2", primitive: "blue-500", meaning: "Polo frio (médio)" },
    { token: "--color-chart-div-3", primitive: "blue-200", meaning: "Polo frio (fraco)" },
    { token: "--color-chart-div-4", primitive: "neutral-200", meaning: "Pivô neutro" },
    { token: "--color-chart-div-5", primitive: "rose-200", meaning: "Polo quente (fraco)" },
    { token: "--color-chart-div-6", primitive: "rose-500", meaning: "Polo quente (médio)" },
    { token: "--color-chart-div-7", primitive: "rose-700", meaning: "Polo quente (forte)" }
  ]
};

export const STATUS_SCHEME: ChartScheme = {
  id: "status",
  name: "Status",
  description:
    "Cinco tokens para charts que encodam estado semântico discreto. A regra: se a cor verde no seu chart significa 'bom', você precisa de Status — não de Categorical. Misturar gera leitura ambígua.",
  rows: [
    { token: "--color-chart-status-success", primitive: "emerald-600", meaning: "Sucesso, OK, alvo atingido" },
    { token: "--color-chart-status-warning", primitive: "amber-500", meaning: "Atenção, próximo do limite" },
    { token: "--color-chart-status-error", primitive: "red-600", meaning: "Falha, fora do SLA" },
    { token: "--color-chart-status-info", primitive: "sky-600", meaning: "Informação neutra, em andamento" },
    { token: "--color-chart-status-neutral", primitive: "neutral-500", meaning: "Inativo, sem dado" }
  ]
};

export const COMPARISON_SCHEME: ChartScheme = {
  id: "comparison",
  name: "Comparison",
  description:
    "Quatro tokens muted + um highlight para o pattern destaque-um-mute-os-outros. É a paleta canônica para 'você vs seus pares', 'metric atual vs baseline', A/B test, e qualquer caso onde a leitura é 'esse aqui versus o resto'.",
  rows: [
    { token: "--color-chart-cmp-highlight", primitive: "blue-600", meaning: "A série em foco" },
    { token: "--color-chart-cmp-mute-1", primitive: "neutral-700", meaning: "Backdrop principal" },
    { token: "--color-chart-cmp-mute-2", primitive: "neutral-500", meaning: "Backdrop secundário" },
    { token: "--color-chart-cmp-mute-3", primitive: "neutral-400", meaning: "Backdrop terciário" },
    { token: "--color-chart-cmp-mute-4", primitive: "neutral-300", meaning: "Backdrop quaternário" }
  ]
};

export const ALL_SCHEMES = [
  SEQUENTIAL_SCHEME,
  CATEGORICAL_SCHEME,
  DIVERGENT_SCHEME,
  STATUS_SCHEME,
  COMPARISON_SCHEME
];
