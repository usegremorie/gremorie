import { Callout } from 'fumadocs-ui/components/callout';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';

import { SETUP } from '@/lib/setup';

/**
 * The styling prerequisite for the Angular edition, rendered inside the
 * Angular tab of every component page that has an `ng-*` item.
 *
 * Angular components emit Tailwind utility classes and ship no compiled CSS,
 * so `npx gremorie add ng-<name>` alone leaves the component completely
 * unstyled. The snippet below is the missing half of that install, and it is
 * the same snippet the MCP `get_setup` tool and `llms.txt` serve — all three
 * read `lib/setup.ts`, so they cannot drift apart.
 *
 * Registered globally in `mdx-components.tsx` per ADR-017, so the 83 Angular
 * pages use it without a per-file import.
 */
export function AngularSetup({ locale = 'en' }: { locale?: 'en' | 'pt' }) {
  const setup = SETUP.ng;
  const pt = locale === 'pt';

  return (
    <Callout type="warn" title={pt ? 'Pré-requisito' : 'Prerequisite'}>
      <p>
        {pt ? (
          <>
            Os componentes Angular emitem classes utilitárias do Tailwind e não
            embarcam CSS compilado. Sem o setup abaixo em{' '}
            <code>{setup.file}</code>, o componente monta mas renderiza{' '}
            <strong>sem estilo nenhum</strong>. Requer Tailwind CSS v4.
          </>
        ) : (
          <>
            Angular components emit Tailwind utility classes and ship no
            compiled CSS. Without the setup below in <code>{setup.file}</code>{' '}
            the component mounts but renders{' '}
            <strong>completely unstyled</strong>. Requires Tailwind CSS v4.
          </>
        )}
      </p>
      <DynamicCodeBlock code={setup.code} lang={setup.lang} />
      <p>
        {pt ? (
          <>
            A linha <code>@source</code> é obrigatória: o Tailwind v4 ignora{' '}
            <code>node_modules</code> por padrão. Ajuste o caminho relativo se o
            seu stylesheet não estiver em <code>src/styles.css</code>. Setup
            completo em <a href="/get-started/installation">Instalação</a>.
          </>
        ) : (
          <>
            The <code>@source</code> line is required: Tailwind v4 skips{' '}
            <code>node_modules</code> by default. Adjust the relative path if
            your stylesheet is not at <code>src/styles.css</code>. Full setup in{' '}
            <a href="/get-started/installation">Installation</a>.
          </>
        )}
      </p>
    </Callout>
  );
}
