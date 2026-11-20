import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowRight,
  lucideCircleAlert,
  lucideLockKeyhole,
} from '@ng-icons/lucide';
import { Button } from '@gremorie/ng-core';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@gremorie/ng-display';
import { Field, FieldGroup, FieldLabel, Input } from '@gremorie/ng-forms';

/** Showcase card (column 4): credentials and the danger zone. */
@Component({
  selector: 'showcase-account-access',
  standalone: true,
  imports: [
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Input,
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
    Field,
    FieldGroup,
    FieldLabel,
    NgIcon,
  ],
  providers: [
    provideIcons({ lucideArrowRight, lucideCircleAlert, lucideLockKeyhole }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-header>
        <gr-card-title>Account Access</gr-card-title>
        <gr-card-description>
          Update your credentials or re-authenticate.
        </gr-card-description>
      </gr-card-header>
      <gr-card-content>
        <gr-field-group class="gap-6">
          <gr-field>
            <gr-field-label for="email-address">Email Address</gr-field-label>
            <gr-input
              id="email-address"
              type="email"
              value="artist@studio.inc"
            />
          </gr-field>
          <gr-field>
            <div class="flex items-center justify-between">
              <gr-field-label for="current-password"
                >Current Password</gr-field-label
              >
              <a
                class="font-medium text-muted-foreground text-xs uppercase tracking-wider hover:text-foreground"
                href="#forgot"
                >Forgot?</a
              >
            </div>
            <gr-input
              id="current-password"
              type="password"
              value="password123"
            />
          </gr-field>
        </gr-field-group>
      </gr-card-content>
      <gr-card-footer class="flex-col gap-4">
        <ai-button class="w-full">
          <ng-icon name="lucideLockKeyhole" aria-hidden="true" />
          Update Security
        </ai-button>
        <a class="block w-full" href="#danger-zone">
          <gr-item variant="muted">
            <gr-item-media variant="icon">
              <!-- ng-icon sets its own colour on the host, so a text-*
                   class loses; its color input is the supported way. -->
              <ng-icon
                name="lucideCircleAlert"
                color="var(--destructive)"
                aria-hidden="true"
              />
            </gr-item-media>
            <gr-item-content>
              <gr-item-title>Danger Zone</gr-item-title>
              <gr-item-description
                >Archive account and remove catalog</gr-item-description
              >
            </gr-item-content>
            <gr-item-actions>
              <ng-icon
                name="lucideArrowRight"
                class="size-4"
                aria-hidden="true"
              />
            </gr-item-actions>
          </gr-item>
        </a>
      </gr-card-footer>
    </gr-card>
  `,
})
export class AccountAccess {}
