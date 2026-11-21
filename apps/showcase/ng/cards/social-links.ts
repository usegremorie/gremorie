import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCamera,
  lucideCirclePlay,
  lucideCloud,
  lucideGlobe,
} from '@ng-icons/lucide';
import { Button } from '@gremorie/ng-core';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@gremorie/ng-display';
import {
  Field,
  FieldGroup,
  FieldLabel,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@gremorie/ng-forms';

// An independent artist's profile links: two already filled in, two still
// waiting, so the placeholders show the expected format.
const LINKS = [
  {
    id: 'spotify-url',
    label: 'Spotify Artist URL',
    icon: 'lucideCirclePlay',
    value: 'open.spotify.com/artist/5mVq2Lr8',
    placeholder: 'open.spotify.com/artist/…',
  },
  {
    id: 'instagram-handle',
    label: 'Instagram Handle',
    icon: 'lucideCamera',
    value: '@noravale.music',
    placeholder: '@handle',
  },
  {
    id: 'soundcloud-url',
    label: 'SoundCloud URL',
    icon: 'lucideCloud',
    value: '',
    placeholder: 'soundcloud.com/username',
  },
  {
    id: 'website-url',
    label: 'Website',
    icon: 'lucideGlobe',
    value: '',
    placeholder: 'https://yoursite.com',
  },
];

/** Showcase card: where listeners can find the artist. */
@Component({
  selector: 'showcase-social-links',
  standalone: true,
  imports: [
    Button,
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    Field,
    FieldGroup,
    FieldLabel,
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    NgIcon,
  ],
  providers: [
    provideIcons({ lucideCamera, lucideCirclePlay, lucideCloud, lucideGlobe }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-header>
        <gr-card-title>Social Links</gr-card-title>
      </gr-card-header>
      <gr-card-content>
        <gr-field-group class="gap-6">
          @for (link of links; track link.id) {
            <gr-field>
              <gr-field-label [for]="link.id">{{ link.label }}</gr-field-label>
              <gr-input-group>
                <gr-input-group-addon>
                  <ng-icon [name]="link.icon" aria-hidden="true" />
                </gr-input-group-addon>
                <gr-input-group-input
                  class="flex-1"
                  [id]="link.id"
                  [value]="link.value"
                  [placeholder]="link.placeholder"
                />
              </gr-input-group>
            </gr-field>
          }
        </gr-field-group>
      </gr-card-content>
      <gr-card-footer class="justify-end gap-2">
        <ai-button variant="secondary">Discard</ai-button>
        <ai-button>Save Changes</ai-button>
      </gr-card-footer>
    </gr-card>
  `,
})
export class SocialLinks {
  protected readonly links = LINKS;
}
