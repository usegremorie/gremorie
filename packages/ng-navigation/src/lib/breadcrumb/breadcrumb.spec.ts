import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';

@Component({
  standalone: true,
  imports: [
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
  ],
  template: `
    <gn-breadcrumb>
      <gn-breadcrumb-list>
        <gn-breadcrumb-item>
          <a gn-breadcrumb-link href="#">Home</a>
        </gn-breadcrumb-item>
        <gn-breadcrumb-separator />
        <gn-breadcrumb-item>
          <gn-breadcrumb-page>Current</gn-breadcrumb-page>
        </gn-breadcrumb-item>
      </gn-breadcrumb-list>
    </gn-breadcrumb>
  `,
})
class Host {}

describe('Breadcrumb', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the nav with its data-slot and breadcrumb aria-label', () => {
    const host = render();
    const nav = host.querySelector('[data-slot="breadcrumb"]');
    expect(nav).not.toBeNull();
    expect(nav?.getAttribute('aria-label')).toBe('breadcrumb');
  });

  it('renders list, item, link, separator and page data-slots', () => {
    const host = render();
    expect(host.querySelector('[data-slot="breadcrumb-list"]')).not.toBeNull();
    expect(host.querySelectorAll('[data-slot="breadcrumb-item"]').length).toBe(
      2,
    );
    expect(host.querySelector('[data-slot="breadcrumb-link"]')).not.toBeNull();
    expect(
      host.querySelector('[data-slot="breadcrumb-separator"]'),
    ).not.toBeNull();
    const page = host.querySelector('[data-slot="breadcrumb-page"]');
    expect(page?.getAttribute('aria-current')).toBe('page');
  });

  it('renders a default chevron inside the separator', () => {
    const host = render();
    const sep = host.querySelector('[data-slot="breadcrumb-separator"]');
    expect(sep?.querySelector('svg')).not.toBeNull();
  });
});
