import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@gremorie/rx-display';
import {
  Button,
  Field,
  FieldGroup,
  FieldLabel,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@gremorie/rx-forms';
import {
  CameraIcon,
  CirclePlayIcon,
  CloudIcon,
  GlobeIcon,
  type LucideIcon,
} from 'lucide-react';

// An independent artist's profile links: two already filled in, two still
// waiting, so the placeholders show the expected format.
const LINKS: {
  id: string;
  label: string;
  icon: LucideIcon;
  value?: string;
  placeholder: string;
}[] = [
  {
    id: 'spotify-url',
    label: 'Spotify Artist URL',
    icon: CirclePlayIcon,
    value: 'open.spotify.com/artist/5mVq2Lr8',
    placeholder: 'open.spotify.com/artist/…',
  },
  {
    id: 'instagram-handle',
    label: 'Instagram Handle',
    icon: CameraIcon,
    value: '@noravale.music',
    placeholder: '@handle',
  },
  {
    id: 'soundcloud-url',
    label: 'SoundCloud URL',
    icon: CloudIcon,
    placeholder: 'soundcloud.com/username',
  },
  {
    id: 'website-url',
    label: 'Website',
    icon: GlobeIcon,
    placeholder: 'https://yoursite.com',
  },
];

/** Showcase card: where listeners can find the artist. */
export function SocialLinks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Links</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup className="gap-6">
          {LINKS.map(({ id, label, icon: Icon, value, placeholder }) => (
            <Field key={id}>
              <FieldLabel htmlFor={id}>{label}</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <Icon aria-hidden="true" />
                </InputGroupAddon>
                <InputGroupInput
                  defaultValue={value}
                  id={id}
                  placeholder={placeholder}
                />
              </InputGroup>
            </Field>
          ))}
        </FieldGroup>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="secondary">Discard</Button>
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  );
}
