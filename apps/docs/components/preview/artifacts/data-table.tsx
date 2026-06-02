'use client';

import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@gremorie/rx-display';
import { Input } from '@gremorie/rx-forms';
import { Search } from 'lucide-react';
import { useState } from 'react';

type Row = {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Invited' | 'Suspended';
};

const ROWS: Row[] = [
  { id: 'U-001', name: 'Olivia Martin', role: 'Owner', status: 'Active' },
  { id: 'U-002', name: 'Jackson Lee', role: 'Editor', status: 'Active' },
  { id: 'U-003', name: 'Isabella Nguyen', role: 'Viewer', status: 'Invited' },
  { id: 'U-004', name: 'William Kim', role: 'Editor', status: 'Suspended' },
  { id: 'U-005', name: 'Sofia Davis', role: 'Viewer', status: 'Active' },
];

function statusVariant(s: Row['status']) {
  if (s === 'Active') return 'default' as const;
  if (s === 'Invited') return 'secondary' as const;
  return 'outline' as const;
}

export function DataTable() {
  const [query, setQuery] = useState('');
  const filtered = ROWS.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Team members</CardTitle>
          <Badge variant="outline">JSON rows</Badge>
        </div>
        <div className="relative mt-2">
          <Search
            className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Filter members..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-mono text-xs">{row.id}</TableCell>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(row.status)}>
                    {row.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  No matches
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
