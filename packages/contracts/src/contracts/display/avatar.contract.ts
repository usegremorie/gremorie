import { defineContract } from '../../types';

/**
 * Avatar - a user / entity portrait with image + fallback.
 * React: `@gremorie/rx-display` (wraps `@radix-ui/react-avatar`).
 * Angular: `@gremorie/ng-display` (hand-rolled image-load lifecycle).
 */
export const avatar = defineContract({
  name: 'avatar',
  category: 'display',
  status: 'stable',
  anatomy: `
    <avatar> (root circle: size, propagated via data-size)
    ├─ avatar-image (portrait; hidden until loaded)
    ├─ avatar-fallback (initials/icon while loading or on error)
    └─ avatar-badge (small status dot, bottom-right)

    <avatar-group> (overlapping -space-x-2 row)
    ├─ avatar ...
    └─ avatar-group-count ("+N" overflow chip)`,
  props: [
    {
      name: 'size',
      type: "'sm' | 'default' | 'lg'",
      default: 'default',
      options: ['sm', 'default', 'lg'],
      desc: '24 / 32 / 40px; propagated to subparts via data-size. Use a size-12+ class for an xl avatar.',
    },
    {
      name: 'src',
      type: 'string',
      adapts: { rx: 'forwarded Radix Image prop' },
      desc: 'AvatarImage: image source.',
    },
    {
      name: 'alt',
      type: 'string',
      default: '',
      adapts: { rx: 'forwarded Radix Image prop' },
      desc: 'AvatarImage: alt text.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Merged onto the part.',
    },
  ],
  guidance: {
    summary:
      'A user / entity portrait that never renders as a broken image or empty circle.',
    whenToUse: [
      'Show a person or entity by photo, with graceful initials/icon fallback.',
      'Stack collaborators with AvatarGroup + an overflow count.',
      'Surface presence/status with AvatarBadge.',
    ],
    whenNotToUse: [
      {
        text: 'A non-portrait status or count label',
        use: 'badge',
      },
    ],
    rules: [
      'AvatarFallback renders while the image loads and stays if it errors or src is missing.',
      'size on the root propagates to AvatarBadge / AvatarGroupCount via data-size.',
      'AvatarGroup wraps the avatars; AvatarGroupCount is the trailing "+N" chip.',
    ],
    example:
      '<avatar size="lg"><avatar-image src="/me.png" alt="Me" /><avatar-fallback>CN</avatar-fallback></avatar>',
  },
  preview: {
    rx: 'layout-display-display-avatar--default',
    ng: 'display-avatar--workbench',
  },
  figma: { nodeId: null },
});
