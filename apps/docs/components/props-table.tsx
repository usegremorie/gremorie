import { CONTRACTS, toPropRows } from '@gremorie/contracts';

/**
 * Renders a component's prop table from its agnostic contract
 * (`@gremorie/contracts`) - the single source of truth shared by the React and
 * Angular editions. The prop rows here can never drift from the contract, and
 * the same contract feeds the parity lint and the workbench.
 *
 * Usage in MDX: `<PropsTable for="chart-artifact" />`
 */
export function PropsTable({ for: name }: { for: string }) {
  const contract = CONTRACTS.find((c) => c.name === name);
  if (!contract) {
    return <p>Unknown component contract: {name}</p>;
  }
  const rows = toPropRows(contract);
  return (
    <table>
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name}>
            <td>
              <code>
                {r.name}
                {r.required ? '*' : ''}
              </code>
            </td>
            <td>
              <code>{r.type}</code>
            </td>
            <td>
              <code>{r.default}</code>
            </td>
            <td>{r.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
