'use client';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@gremorie/rx-display';

const REGISTRY_ITEMS = [
  { id: 'rx-message', category: 'AI', deps: 4 },
  { id: 'rx-button', category: 'Forms', deps: 1 },
  { id: 'rx-card', category: 'Display', deps: 0 },
  { id: 'rx-area-chart', category: 'Data', deps: 2 },
  { id: 'rx-alert', category: 'Feedback', deps: 1 },
];

export function TablePreview() {
  return (
    <Table>
      <TableCaption>A sample of registry items.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Deps</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {REGISTRY_ITEMS.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-mono">{item.id}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell className="text-right">{item.deps}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
