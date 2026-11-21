import {
  Card,
  CardContent,
  CardHeader,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@gremorie/rx-display';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@gremorie/rx-navigation';
import {
  CalendarIcon,
  ChevronRightIcon,
  GaugeIcon,
  RefreshCwIcon,
  RepeatIcon,
} from 'lucide-react';

// The Payments page of a banking app's settings: each row opens one
// payment option, deep in the account settings tree.
const OPTIONS = [
  {
    id: 'transfer-limit',
    title: 'Change transfer limit',
    description: 'Adjust how much you can send from your balance.',
    icon: GaugeIcon,
  },
  {
    id: 'scheduled-transfers',
    title: 'Scheduled transfers',
    description: 'Set up a transfer to send at a later date.',
    icon: CalendarIcon,
  },
  {
    id: 'direct-debits',
    title: 'Direct Debits',
    description: 'Set up and manage regular payments.',
    icon: RepeatIcon,
  },
  {
    id: 'recurring-card-payments',
    title: 'Recurring card payments',
    description: 'Manage your repeated card transactions.',
    icon: RefreshCwIcon,
  },
];

/** Showcase card: payment settings reached through a breadcrumb trail. */
export function PaymentSettings() {
  return (
    <Card>
      <CardHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#home">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Payments</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </CardHeader>
      <CardContent>
        <nav aria-label="Payment options" className="flex flex-col gap-3">
          {OPTIONS.map((o) => (
            <Item asChild interactive key={o.id} size="lg" variant="muted">
              <a href={`#${o.id}`}>
                <ItemMedia className="self-start" variant="icon">
                  <o.icon />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{o.title}</ItemTitle>
                  <ItemDescription>{o.description}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <ChevronRightIcon className="size-4 text-muted-foreground" />
                </ItemActions>
              </a>
            </Item>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
}
