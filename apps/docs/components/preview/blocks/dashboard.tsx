"use client";

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@gremorie/rx-display";
import { BarChart, type ChartConfig, type ChartDatum } from "@gremorie/rx-data";
import { Button } from "@gremorie/rx-forms";
import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Download,
  ShoppingCart,
  Users,
} from "lucide-react";

const KPIs: Array<{
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}> = [
  {
    label: "Revenue",
    value: "$48,920",
    delta: "+12.4%",
    trend: "up",
    icon: DollarSign,
  },
  {
    label: "Customers",
    value: "2,318",
    delta: "+4.1%",
    trend: "up",
    icon: Users,
  },
  {
    label: "Orders",
    value: "1,204",
    delta: "+18.3%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    label: "Refunds",
    value: "$1,420",
    delta: "-3.2%",
    trend: "down",
    icon: CreditCard,
  },
];

const REVENUE_DATA: ChartDatum[] = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 5100 },
  { month: "Mar", revenue: 4800 },
  { month: "Apr", revenue: 6200 },
  { month: "May", revenue: 7400 },
  { month: "Jun", revenue: 6900 },
  { month: "Jul", revenue: 8100 },
  { month: "Aug", revenue: 8900 },
];

const REVENUE_CONFIG: ChartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
};

const TRANSACTIONS: Array<{
  id: string;
  customer: string;
  email: string;
  amount: string;
  status: "Paid" | "Pending" | "Refunded";
}> = [
  {
    id: "INV-001",
    customer: "Olivia Martin",
    email: "olivia@example.com",
    amount: "$1,999",
    status: "Paid",
  },
  {
    id: "INV-002",
    customer: "Jackson Lee",
    email: "jackson@example.com",
    amount: "$39",
    status: "Paid",
  },
  {
    id: "INV-003",
    customer: "Isabella Nguyen",
    email: "isabella@example.com",
    amount: "$299",
    status: "Pending",
  },
  {
    id: "INV-004",
    customer: "William Kim",
    email: "will@example.com",
    amount: "$99",
    status: "Refunded",
  },
  {
    id: "INV-005",
    customer: "Sofia Davis",
    email: "sofia@example.com",
    amount: "$1,499",
    status: "Paid",
  },
];

function StatCard({
  label,
  value,
  delta,
  trend,
  icon: Icon,
}: (typeof KPIs)[number]) {
  return (
    <Card>
      <CardHeader>
        <CardDescription className="flex items-center justify-between">
          <span>{label}</span>
          <Icon className="size-4 text-muted-foreground" aria-hidden={true} />
        </CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={
            trend === "up"
              ? "flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400"
              : "flex items-center gap-1 text-xs text-destructive"
          }
        >
          {trend === "up" ? (
            <ArrowUpRight className="size-3" aria-hidden="true" />
          ) : (
            <ArrowDownRight className="size-3" aria-hidden="true" />
          )}
          {delta} from last month
        </p>
      </CardContent>
    </Card>
  );
}

function statusVariant(status: (typeof TRANSACTIONS)[number]["status"]) {
  switch (status) {
    case "Paid":
      return "default" as const;
    case "Pending":
      return "secondary" as const;
    case "Refunded":
      return "outline" as const;
  }
}

/**
 * Dashboard block: KPI grid + chart strip + transactions table.
 * Demonstrates how rx-display + rx-data compose into a real analytics
 * surface with header actions.
 */
export function Dashboard() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Snapshot of the last 30 days.
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download aria-hidden="true" />
          Export
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIs.map((kpi) => (
          <StatCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
          <CardDescription>Monthly recurring revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart
            data={REVENUE_DATA}
            config={REVENUE_CONFIG}
            xKey="month"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent transactions</CardTitle>
          <CardDescription>
            Latest activity from your storefront.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TRANSACTIONS.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-mono text-xs">{tx.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{tx.customer}</span>
                      <span className="text-xs text-muted-foreground">
                        {tx.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(tx.status)}>
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {tx.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
