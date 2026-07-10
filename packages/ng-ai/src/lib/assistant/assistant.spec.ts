import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrnCollapsibleToken } from '@spartan-ng/brain/collapsible';
import { Assistant } from './assistant';

/**
 * The spartan `BrnCollapsibleTrigger` / `BrnCollapsibleContent` directives
 * resolve their owning `BrnCollapsible` through the element injector. Under the
 * Angular zoneless TestBed the trigger is content-projected through two layers
 * (`<reasoning>` → `<ng-content>` → `<div brnCollapsible>`), and the projected
 * directive does not resolve the token across that re-projection — it works in
 * the real build/Storybook but throws here. We provide a root-level stub so the
 * collapsible primitive can instantiate and the surface renders for assertion.
 */
const collapsibleStub = {
  contentId: signal('test-collapsible-content'),
  expanded: signal(false),
  state: signal<'open' | 'closed'>('closed'),
  disabled: signal(false),
  toggle: () => {
    /* no-op in the render smoke test */
  },
};

// jsdom does not implement Element.scrollTo, which Conversation calls in
// ngAfterViewInit to stick to the bottom. Polyfill it as a no-op.
beforeAll(() => {
  if (!Element.prototype.scrollTo) {
    Element.prototype.scrollTo = () => {
      /* no-op scroll shim for jsdom */
    };
  }
});

async function render() {
  TestBed.configureTestingModule({
    providers: [{ provide: BrnCollapsibleToken, useValue: collapsibleStub }],
  });
  const fixture = TestBed.createComponent(Assistant);
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  return fixture;
}

describe('Assistant', () => {
  it('renders the fixed-height card surface', async () => {
    const fixture = await render();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('data-slot')).toBe('assistant');
    expect(host.className).toContain('h-[680px]');
  });

  it('renders a stick-to-bottom conversation scroll region', async () => {
    const fixture = await render();
    const host = fixture.nativeElement as HTMLElement;
    const conversation = host.querySelector('conversation');
    expect(conversation).not.toBeNull();
    expect(conversation?.getAttribute('role')).toBe('log');
  });

  it('renders both a user and an assistant message', async () => {
    const fixture = await render();
    const host = fixture.nativeElement as HTMLElement;
    const messages = host.querySelectorAll('message');
    expect(messages.length).toBeGreaterThanOrEqual(2);
    const userMessage = host.querySelector('message.is-user');
    const assistantMessage = host.querySelector('message.is-assistant');
    expect(userMessage).not.toBeNull();
    expect(assistantMessage).not.toBeNull();
    expect(userMessage?.textContent).toContain(
      'How did Q3 revenue break down by region?',
    );
  });

  it('renders a collapsible reasoning step inside the assistant turn', async () => {
    const fixture = await render();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('reasoning')).not.toBeNull();
    expect(host.querySelector('reasoning-trigger')).not.toBeNull();
    expect(host.querySelector('reasoning-content')).not.toBeNull();
  });

  it('renders a prompt-input composer with a textarea and submit', async () => {
    const fixture = await render();
    const host = fixture.nativeElement as HTMLElement;
    const composer = host.querySelector('prompt-input');
    expect(composer).not.toBeNull();
    expect(composer?.getAttribute('role')).toBe('form');
    expect(host.querySelector('prompt-input-textarea textarea')).not.toBeNull();
    expect(host.querySelector('prompt-input-submit button')).not.toBeNull();
  });

  it('keeps the footer as a sibling of the textarea (not nested)', async () => {
    const fixture = await render();
    const host = fixture.nativeElement as HTMLElement;
    const footer = host.querySelector('prompt-input-footer');
    expect(footer).not.toBeNull();
    // The footer must NOT live inside the textarea element (display:contents
    // gotcha) — it is a direct sibling under prompt-input.
    expect(footer?.closest('prompt-input-textarea')).toBeNull();
  });
});
