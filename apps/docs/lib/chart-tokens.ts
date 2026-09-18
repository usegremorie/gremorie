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
  id: 'sequential',
  name: 'Sequential',
  description:
    'Uma única matiz, claro para escuro, para dado com ordem natural. Lido por luminosidade e não por matiz, então sobrevive ao daltonismo por construção. Os steps são 200/400/600/800/950: de 600 para 700 a diferença mede ΔL 0.058, abaixo do 0.06 que o olho precisa para separar dois passos.',
  rows: [
    { token: '--chart-seq-1', primitive: 'blue-200' },
    { token: '--chart-seq-2', primitive: 'blue-400' },
    { token: '--chart-seq-3', primitive: 'blue-600' },
    { token: '--chart-seq-4', primitive: 'blue-800' },
    { token: '--chart-seq-5', primitive: 'blue-950' },
  ],
};

export const CATEGORICAL_SCHEME: ChartScheme = {
  id: 'categorical',
  name: 'Categorical',
  description:
    'Cinco hues para identidade de série em dado nominal. Para em cinco porque é o que as rampas primitivas separam de verdade — um sexto slot colapsaria contra um dos cinco sob daltonismo. Acima de cinco a escala se repete, como faz o esquema categórico do Notion.',
  rows: [
    { token: '--chart-cat-1', primitive: 'blue-500' },
    { token: '--chart-cat-2', primitive: 'amber-500' },
    { token: '--chart-cat-3', primitive: 'green-500' },
    { token: '--chart-cat-4', primitive: 'cyan-500' },
    { token: '--chart-cat-5', primitive: 'pink-500' },
  ],
};

export const DIVERGENT_SCHEME: ChartScheme = {
  id: 'divergent',
  name: 'Divergent',
  description:
    'Sete stops bipolares com pivô neutro, para dado contínuo com um meio que significa algo: zero, média, baseline. Blue contra red, e não red contra green, que cerca de 8% dos homens não separam. Os stops internos são 300 e não 200 — em 200 os três valores centrais ficam a ΔL 0.04 do pivô, e o pivô lê como estouro de brilho em vez de meio.',
  rows: [
    {
      token: '--chart-div-1',
      primitive: 'blue-700',
      meaning: 'Polo frio (forte)',
    },
    {
      token: '--chart-div-2',
      primitive: 'blue-500',
      meaning: 'Polo frio (médio)',
    },
    {
      token: '--chart-div-3',
      primitive: 'blue-300',
      meaning: 'Polo frio (fraco)',
    },
    {
      token: '--chart-div-4',
      primitive: 'neutral-100',
      meaning: 'Pivô neutro',
    },
    {
      token: '--chart-div-5',
      primitive: 'red-300',
      meaning: 'Polo quente (fraco)',
    },
    {
      token: '--chart-div-6',
      primitive: 'red-500',
      meaning: 'Polo quente (médio)',
    },
    {
      token: '--chart-div-7',
      primitive: 'red-700',
      meaning: 'Polo quente (forte)',
    },
  ],
};

export const STATUS_SCHEME: ChartScheme = {
  id: 'status',
  name: 'Status',
  description:
    "Cinco tokens para estado semântico discreto, nunca identidade de série. A regra: se o verde no seu chart significa 'bom', você precisa de Status e não de Categorical. Success, warning e error apontam para os tokens semânticos em vez de repeti-los — 'verde significa ok' não pode ter duas respostas no mesmo sistema.",
  rows: [
    {
      token: '--chart-status-success',
      primitive: 'var(--success)',
      meaning: 'Sucesso, OK, alvo atingido',
    },
    {
      token: '--chart-status-warning',
      primitive: 'var(--warning)',
      meaning: 'Atenção, próximo do limite',
    },
    {
      token: '--chart-status-error',
      primitive: 'var(--destructive)',
      meaning: 'Falha, fora do SLA',
    },
    {
      token: '--chart-status-info',
      primitive: 'sky-600',
      meaning: 'Informação neutra, em andamento',
    },
    {
      token: '--chart-status-neutral',
      primitive: 'var(--muted-foreground)',
      meaning: 'Inativo, sem dado',
    },
  ],
};

export const COMPARISON_SCHEME: ChartScheme = {
  id: 'comparison',
  name: 'Comparison',
  description:
    "Quatro neutros e um destaque, para o padrão destaque-um-apaga-o-resto: 'você vs seus pares', 'atual vs baseline', teste A/B. O destaque é a cor de marca, então o que está sendo comparado veste a identidade do consumidor; o fundo é neutro, e é isso que faz o destaque ler.",
  rows: [
    {
      token: '--chart-cmp-highlight',
      primitive: 'brand-600',
      meaning: 'A série em foco',
    },
    {
      token: '--chart-cmp-mute-1',
      primitive: 'neutral-700',
      meaning: 'Backdrop principal',
    },
    {
      token: '--chart-cmp-mute-2',
      primitive: 'neutral-500',
      meaning: 'Backdrop secundário',
    },
    {
      token: '--chart-cmp-mute-3',
      primitive: 'neutral-400',
      meaning: 'Backdrop terciário',
    },
    {
      token: '--chart-cmp-mute-4',
      primitive: 'neutral-300',
      meaning: 'Backdrop quaternário',
    },
  ],
};

export const ALL_SCHEMES = [
  SEQUENTIAL_SCHEME,
  CATEGORICAL_SCHEME,
  DIVERGENT_SCHEME,
  STATUS_SCHEME,
  COMPARISON_SCHEME,
];
