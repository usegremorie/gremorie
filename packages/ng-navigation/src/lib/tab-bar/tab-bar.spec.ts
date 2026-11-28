import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TabBar, TabBarItem } from './tab-bar';

@Component({
  standalone: true,
  imports: [TabBar, TabBarItem],
  template: `
    <gr-tab-bar [variant]="variant()" [labels]="labels()" [(value)]="tab">
      <gr-tab-bar-item value="home" label="Home"><svg></svg></gr-tab-bar-item>
      <gr-tab-bar-item value="inbox" label="Inbox" [badge]="badge()">
        <svg></svg>
      </gr-tab-bar-item>
      <a gr-tab-bar-item value="profile" label="Profile" href="#profile">
        <svg></svg>
      </a>
    </gr-tab-bar>
  `,
})
class Host {
  readonly variant = signal<'material' | 'ios' | 'floating'>('material');
  readonly labels = signal<'always' | 'active' | 'never'>('always');
  readonly badge = signal<number | boolean>(3);
  readonly tab = signal<string | undefined>('home');
}

describe('TabBar', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    return { fixture, root, host: fixture.componentInstance };
  }
  const items = (root: HTMLElement) =>
    Array.from(
      root.querySelectorAll<HTMLElement>('[data-slot="tab-bar-item"]'),
    );

  it('renders a nav landmark with list and items', () => {
    const { root } = render();
    const nav = root.querySelector('nav[data-slot="tab-bar"]');
    expect(nav?.getAttribute('aria-label')).toBe('Main');
    expect(nav?.getAttribute('data-variant')).toBe('material');
    expect(root.querySelector('[data-slot="tab-bar-list"]')).not.toBeNull();
    expect(items(root).length).toBe(3);
  });

  it('marks the active item with aria-current and updates the model on click', () => {
    const { fixture, root, host } = render();
    const [home, inbox] = items(root);
    expect(home.getAttribute('aria-current')).toBe('page');
    expect(inbox.getAttribute('aria-current')).toBeNull();

    inbox.click();
    fixture.detectChanges();
    expect(host.tab()).toBe('inbox');
    expect(items(root)[1].getAttribute('aria-current')).toBe('page');
    expect(items(root)[0].getAttribute('aria-current')).toBeNull();
  });

  it('uses the host as the single control in attribute form', () => {
    const { fixture, root, host } = render();
    const link = items(root)[2];
    expect(link.tagName).toBe('A');
    expect(link.querySelector('button')).toBeNull();
    link.addEventListener('click', (e) => e.preventDefault());
    link.click();
    fixture.detectChanges();
    expect(host.tab()).toBe('profile');
  });

  it('hides labels in the floating variant and names items by aria-label', () => {
    const { fixture, root, host } = render();
    host.variant.set('floating');
    fixture.detectChanges();
    expect(root.querySelectorAll('[data-slot="tab-bar-label"]').length).toBe(0);
    expect(root.querySelector('nav')?.getAttribute('data-labels')).toBe(
      'never',
    );
    expect(items(root)[0].getAttribute('aria-label')).toBe('Home');
    expect(items(root)[1].getAttribute('aria-label')).toBe('Inbox, 3 new');
  });

  it('shows only the active label with labels="active"', () => {
    const { fixture, root, host } = render();
    host.labels.set('active');
    fixture.detectChanges();
    const labels = root.querySelectorAll('[data-slot="tab-bar-label"]');
    expect(labels.length).toBe(1);
    expect(labels[0].textContent?.trim()).toBe('Home');
  });

  it('renders badges: count, 99+ cap and dot', () => {
    const { fixture, root, host } = render();
    const badge = () =>
      root.querySelector<HTMLElement>('[data-slot="tab-bar-badge"]');
    expect(badge()?.textContent?.trim()).toBe('3');
    host.badge.set(150);
    fixture.detectChanges();
    expect(badge()?.textContent?.trim()).toBe('99+');
    host.badge.set(true);
    fixture.detectChanges();
    expect(badge()?.className).toContain('size-2');
    expect(badge()?.textContent?.trim()).toBe('');
    host.badge.set(0);
    fixture.detectChanges();
    expect(badge()).toBeNull();
  });
});
