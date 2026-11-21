import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { BrnPopoverContent } from '@spartan-ng/brain/popover';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from './dropdown-menu';

// The trigger opens a BrnPopover overlay, so the content is not rendered
// eagerly when wired through `brnPopoverTriggerFor`. Here we render the
// content parts inline (their styled hosts always render) to assert their
// data-slots and class strings.
@Component({
  standalone: true,
  imports: [
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
  ],
  template: `
    <gr-dropdown-menu>
      <gr-dropdown-menu-content>
        <gr-dropdown-menu-label>Account</gr-dropdown-menu-label>
        <gr-dropdown-menu-separator />
        <gr-dropdown-menu-group>
          <gr-dropdown-menu-item>
            Edit <gr-dropdown-menu-shortcut>⌘E</gr-dropdown-menu-shortcut>
          </gr-dropdown-menu-item>
          <gr-dropdown-menu-item variant="destructive" [inset]="true"
            >Delete</gr-dropdown-menu-item
          >
        </gr-dropdown-menu-group>
        <gr-dropdown-menu-checkbox-item [checked]="true"
          >Toggle</gr-dropdown-menu-checkbox-item
        >
        <gr-dropdown-menu-radio-group>
          <gr-dropdown-menu-radio-item [checked]="true"
            >One</gr-dropdown-menu-radio-item
          >
        </gr-dropdown-menu-radio-group>
      </gr-dropdown-menu-content>
    </gr-dropdown-menu>
  `,
})
class Host {}

describe('DropdownMenu', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the menu parts with their data-slots', () => {
    const host = render();
    expect(host.querySelector('[data-slot="dropdown-menu"]')).not.toBeNull();
    expect(
      host.querySelector('[data-slot="dropdown-menu-content"]'),
    ).not.toBeNull();
    expect(
      host.querySelector('[data-slot="dropdown-menu-label"]'),
    ).not.toBeNull();
    expect(
      host.querySelector('[data-slot="dropdown-menu-separator"]'),
    ).not.toBeNull();
    expect(
      host.querySelector('[data-slot="dropdown-menu-group"]'),
    ).not.toBeNull();
    expect(
      host.querySelectorAll('[data-slot="dropdown-menu-item"]').length,
    ).toBe(2);
    expect(
      host.querySelector('[data-slot="dropdown-menu-shortcut"]'),
    ).not.toBeNull();
    expect(
      host.querySelector('[data-slot="dropdown-menu-checkbox-item"]'),
    ).not.toBeNull();
    expect(
      host.querySelector('[data-slot="dropdown-menu-radio-group"]'),
    ).not.toBeNull();
    expect(
      host.querySelector('[data-slot="dropdown-menu-radio-item"]'),
    ).not.toBeNull();
  });

  it('reflects variant/inset data-attributes on the item', () => {
    const host = render();
    const items = host.querySelectorAll('[data-slot="dropdown-menu-item"]');
    const destructive = items[1] as HTMLElement;
    expect(destructive.getAttribute('data-variant')).toBe('destructive');
    expect(destructive.getAttribute('data-inset')).toBe('');
    expect(destructive.className).toContain(
      'data-[variant=destructive]:text-destructive',
    );
  });

  it('renders the check/circle indicators for checkbox/radio items', () => {
    const host = render();
    const checkbox = host.querySelector(
      '[data-slot="dropdown-menu-checkbox-item"]',
    );
    const radio = host.querySelector('[data-slot="dropdown-menu-radio-item"]');
    expect(checkbox?.querySelector('svg')).not.toBeNull();
    expect(radio?.querySelector('svg')).not.toBeNull();
  });
});

@Component({
  standalone: true,
  imports: [
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    BrnPopoverContent,
  ],
  template: `
    <gr-dropdown-menu>
      <gr-dropdown-menu-trigger ariaLabel="More actions"
        >Open</gr-dropdown-menu-trigger
      >
      <ng-template brnPopoverContent>
        <gr-dropdown-menu-content>
          <gr-dropdown-menu-item>Edit</gr-dropdown-menu-item>
        </gr-dropdown-menu-content>
      </ng-template>
    </gr-dropdown-menu>
  `,
})
class OpenHost {}

// Legacy wiring: a template ref passed through `[content]`. It must not crash
// the trigger (the brain trigger expects an overlay instance, not a template).
@Component({
  standalone: true,
  imports: [
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    BrnPopoverContent,
  ],
  template: `
    <gr-dropdown-menu>
      <gr-dropdown-menu-trigger [content]="tpl">Open</gr-dropdown-menu-trigger>
      <ng-template #tpl brnPopoverContent>
        <gr-dropdown-menu-content>Body</gr-dropdown-menu-content>
      </ng-template>
    </gr-dropdown-menu>
  `,
})
class LegacyHost {}

describe('DropdownMenu open behavior', () => {
  afterEach(() => {
    document
      .querySelectorAll('.cdk-overlay-container')
      .forEach((n) => n.remove());
  });

  it('opens the menu content when the trigger is clicked', async () => {
    TestBed.configureTestingModule({ imports: [OpenHost] });
    const fixture = TestBed.createComponent(OpenHost);
    fixture.detectChanges();
    const button = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="dropdown-menu-trigger"] button',
    ) as HTMLButtonElement;
    expect(button.getAttribute('aria-expanded')).toBe('false');
    button.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      document.querySelector('[data-slot="dropdown-menu-content"]'),
    ).not.toBeNull();
    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  it('forwards ariaLabel to the trigger button', () => {
    TestBed.configureTestingModule({ imports: [OpenHost] });
    const fixture = TestBed.createComponent(OpenHost);
    fixture.detectChanges();
    const button = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="dropdown-menu-trigger"] button',
    );
    expect(button?.getAttribute('aria-label')).toBe('More actions');
  });

  it('does not crash when a template ref is passed through [content]', async () => {
    TestBed.configureTestingModule({ imports: [LegacyHost] });
    const fixture = TestBed.createComponent(LegacyHost);
    expect(() => fixture.detectChanges()).not.toThrow();
    const button = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="dropdown-menu-trigger"] button',
    ) as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      document.querySelector('[data-slot="dropdown-menu-content"]'),
    ).not.toBeNull();
  });
});
