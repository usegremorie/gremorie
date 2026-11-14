import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ToggleGroup, ToggleGroupItem } from './toggle-group';

@Component({
  standalone: true,
  imports: [ToggleGroup, ToggleGroupItem],
  template: `
    <button id="before">before</button>
    <gr-toggle-group
      [type]="type()"
      variant="outline"
      size="sm"
      [spacing]="spacing()"
      [value]="value()"
      (valueChange)="value.set($event)"
    >
      <gr-toggle-group-item value="left" ariaLabel="Left"
        >L</gr-toggle-group-item
      >
      <gr-toggle-group-item value="center" ariaLabel="Center"
        >C</gr-toggle-group-item
      >
      <gr-toggle-group-item value="right" ariaLabel="Right"
        >R</gr-toggle-group-item
      >
    </gr-toggle-group>
  `,
})
class Host {
  readonly type = signal<'single' | 'multiple'>('single');
  readonly spacing = signal(0);
  readonly value = signal<unknown>(undefined);
}

describe('ToggleGroup', () => {
  function render(setup?: (host: Host) => void) {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    setup?.(fixture.componentInstance);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const root = el.querySelector('[data-slot="toggle-group"]') as HTMLElement;
    const items = Array.from(
      el.querySelectorAll<HTMLButtonElement>('[data-slot="toggle-group-item"]'),
    );
    return { fixture, el, root, items };
  }

  function press(target: HTMLElement, key: string) {
    target.dispatchEvent(
      new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
    );
  }

  describe('anatomy', () => {
    it('renders the group with data-slot="toggle-group"', () => {
      expect(render().root).not.toBeNull();
    });

    it('renders every item as a button with data-slot="toggle-group-item"', () => {
      const { items } = render();
      expect(items.length).toBe(3);
      items.forEach((item) => expect(item.tagName).toBe('BUTTON'));
    });

    it('propagates variant and size from the group onto each item', () => {
      render().items.forEach((item) => {
        expect(item.getAttribute('data-variant')).toBe('outline');
        expect(item.getAttribute('data-size')).toBe('sm');
      });
    });

    it('makes the item host display:contents so the button is the flex item', () => {
      const { el } = render();
      el.querySelectorAll('gr-toggle-group-item').forEach((host) =>
        expect(host.classList).toContain('contents'),
      );
    });
  });

  // The bug: first:/last: matched the inner button, an only child of its host,
  // so every item got both outer radii and a full left border.
  describe('segmented position (spacing=0)', () => {
    it('marks only the first item data-first and only the last data-last', () => {
      const [first, middle, last] = render().items;
      expect(first.hasAttribute('data-first')).toBe(true);
      expect(first.hasAttribute('data-last')).toBe(false);
      expect(middle.hasAttribute('data-first')).toBe(false);
      expect(middle.hasAttribute('data-last')).toBe(false);
      expect(last.hasAttribute('data-first')).toBe(false);
      expect(last.hasAttribute('data-last')).toBe(true);
    });

    it('keys outer radius and the left border to data-first/data-last, not :first/:last-child', () => {
      const cls = render().items[0].className;
      expect(cls).toContain('data-[spacing=0]:rounded-none');
      expect(cls).toContain('data-[spacing=0]:data-first:rounded-l-md');
      expect(cls).toContain('data-[spacing=0]:data-last:rounded-r-md');
      expect(cls).toContain(
        'data-[spacing=0]:data-[variant=outline]:border-l-0',
      );
      expect(cls).toContain(
        'data-[spacing=0]:data-[variant=outline]:data-first:border-l',
      );
      expect(cls).not.toMatch(/(^|\s|:)first:/);
      expect(cls).not.toMatch(/(^|\s|:)last:/);
    });

    it('stamps data-spacing on every item so the segmented rules apply', () => {
      render().items.forEach((item) =>
        expect(item.getAttribute('data-spacing')).toBe('0'),
      );
    });
  });

  describe('ARIA (Radix parity)', () => {
    it('type="single" is a radiogroup of radios with aria-checked', () => {
      const { root, items, fixture } = render((h) => h.value.set('center'));
      expect(root.getAttribute('role')).toBe('radiogroup');
      items.forEach((item) => {
        expect(item.getAttribute('role')).toBe('radio');
        expect(item.hasAttribute('aria-pressed')).toBe(false);
      });
      expect(items.map((i) => i.getAttribute('aria-checked'))).toEqual([
        'false',
        'true',
        'false',
      ]);

      items[0].click();
      fixture.detectChanges();
      expect(items.map((i) => i.getAttribute('aria-checked'))).toEqual([
        'true',
        'false',
        'false',
      ]);
    });

    it('type="multiple" is a toolbar of buttons with aria-pressed', () => {
      const { root, items, fixture } = render((h) => {
        h.type.set('multiple');
        h.value.set(['left']);
      });
      expect(root.getAttribute('role')).toBe('toolbar');
      items.forEach((item) => {
        expect(item.hasAttribute('role')).toBe(false);
        expect(item.hasAttribute('aria-checked')).toBe(false);
      });
      items[2].click();
      fixture.detectChanges();
      expect(items.map((i) => i.getAttribute('aria-pressed'))).toEqual([
        'true',
        'false',
        'true',
      ]);
    });

    it('reflects pressed state as data-state on/off', () => {
      const { items } = render((h) => h.value.set('right'));
      expect(items.map((i) => i.getAttribute('data-state'))).toEqual([
        'off',
        'off',
        'on',
      ]);
    });

    it('clears the value when the pressed item is clicked again (nullable, like Radix)', () => {
      const { items, fixture } = render((h) => h.value.set('left'));
      items[0].click();
      fixture.detectChanges();
      expect(fixture.componentInstance.value()).toBeNull();
    });
  });

  describe('keyboard (roving focus)', () => {
    function tabStops(items: HTMLButtonElement[]) {
      return items.map((i) => i.getAttribute('tabindex'));
    }

    it('is a single tab stop on the first item when nothing is pressed', () => {
      expect(tabStops(render().items)).toEqual(['0', '-1', '-1']);
    });

    it('puts the tab stop on the pressed item', () => {
      const { items } = render((h) => h.value.set('right'));
      expect(tabStops(items)).toEqual(['-1', '-1', '0']);
    });

    it('moves focus with arrows, loops, and does not change the selection', () => {
      const { items, fixture } = render((h) => h.value.set('left'));
      items[0].focus();
      fixture.detectChanges();

      press(items[0], 'ArrowRight');
      fixture.detectChanges();
      expect(document.activeElement).toBe(items[1]);
      expect(tabStops(items)).toEqual(['-1', '0', '-1']);

      press(items[1], 'ArrowDown');
      fixture.detectChanges();
      expect(document.activeElement).toBe(items[2]);

      press(items[2], 'ArrowRight');
      fixture.detectChanges();
      expect(document.activeElement).toBe(items[0]);

      press(items[0], 'ArrowLeft');
      fixture.detectChanges();
      expect(document.activeElement).toBe(items[2]);

      expect(fixture.componentInstance.value()).toBe('left');
    });

    it('jumps to the ends with Home and End', () => {
      const { items, fixture } = render();
      items[1].focus();
      press(items[1], 'End');
      fixture.detectChanges();
      expect(document.activeElement).toBe(items[2]);
      press(items[2], 'Home');
      fixture.detectChanges();
      expect(document.activeElement).toBe(items[0]);
    });

    it('returns the tab stop to the pressed item once focus leaves the group', () => {
      const { el, items, fixture } = render((h) => h.value.set('center'));
      items[1].focus();
      press(items[1], 'ArrowRight');
      fixture.detectChanges();
      expect(tabStops(items)).toEqual(['-1', '-1', '0']);

      (el.querySelector('#before') as HTMLButtonElement).focus();
      fixture.detectChanges();
      expect(tabStops(items)).toEqual(['-1', '0', '-1']);
    });
  });
});
