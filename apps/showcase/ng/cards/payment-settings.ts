import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCalendar,
  lucideChevronRight,
  lucideGauge,
  lucideRefreshCw,
  lucideRepeat,
} from '@ng-icons/lucide';
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
} from '@gremorie/ng-display';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@gremorie/ng-navigation';

// The Payments page of a banking app's settings: each row opens one
// payment option, deep in the account settings tree.
const OPTIONS = [
  {
    id: 'transfer-limit',
    title: 'Change transfer limit',
    description: 'Adjust how much you can send from your balance.',
    icon: 'lucideGauge',
  },
  {
    id: 'scheduled-transfers',
    title: 'Scheduled transfers',
    description: 'Set up a transfer to send at a later date.',
    icon: 'lucideCalendar',
  },
  {
    id: 'direct-debits',
    title: 'Direct Debits',
    description: 'Set up and manage regular payments.',
    icon: 'lucideRepeat',
  },
  {
    id: 'recurring-card-payments',
    title: 'Recurring card payments',
    description: 'Manage your repeated card transactions.',
    icon: 'lucideRefreshCw',
  },
];

/** Showcase card: payment settings reached through a breadcrumb trail. */
@Component({
  selector: 'showcase-payment-settings',
  standalone: true,
  imports: [
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    Card,
    CardContent,
    CardHeader,
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
    NgIcon,
  ],
  providers: [
    provideIcons({
      lucideCalendar,
      lucideChevronRight,
      lucideGauge,
      lucideRefreshCw,
      lucideRepeat,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-header>
        <gr-breadcrumb>
          <ol gr-breadcrumb-list>
            <li gr-breadcrumb-item>
              <a gr-breadcrumb-link href="#home">Home</a>
            </li>
            <li gr-breadcrumb-separator></li>
            <li gr-breadcrumb-item>
              <gr-breadcrumb-ellipsis />
            </li>
            <li gr-breadcrumb-separator></li>
            <li gr-breadcrumb-item>
              <gr-breadcrumb-page>Payments</gr-breadcrumb-page>
            </li>
          </ol>
        </gr-breadcrumb>
      </gr-card-header>
      <gr-card-content>
        <nav aria-label="Payment options" class="flex flex-col gap-3">
          @for (o of options; track o.id) {
            <!-- gr-item has no asChild; the link wraps it instead. -->
            <a class="block rounded-md" [href]="'#' + o.id">
              <gr-item variant="muted" size="lg" [interactive]="true">
                <gr-item-media variant="icon" class="self-start">
                  <ng-icon [name]="o.icon" size="16" aria-hidden="true" />
                </gr-item-media>
                <gr-item-content>
                  <gr-item-title>{{ o.title }}</gr-item-title>
                  <gr-item-description>{{ o.description }}</gr-item-description>
                </gr-item-content>
                <gr-item-actions>
                  <ng-icon
                    name="lucideChevronRight"
                    size="16"
                    color="var(--muted-foreground)"
                    aria-hidden="true"
                  />
                </gr-item-actions>
              </gr-item>
            </a>
          }
        </nav>
      </gr-card-content>
    </gr-card>
  `,
})
export class PaymentSettings {
  protected readonly options = OPTIONS;
}
