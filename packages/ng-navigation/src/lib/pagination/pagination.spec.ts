import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination';

@Component({
  standalone: true,
  imports: [
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
  ],
  template: `
    <gn-pagination>
      <gn-pagination-content>
        <gn-pagination-item>
          <a
            gn-pagination-previous
            href="#"
            aria-label="Go to previous page"
          ></a>
        </gn-pagination-item>
        <gn-pagination-item>
          <a gn-pagination-link href="#">1</a>
        </gn-pagination-item>
        <gn-pagination-item>
          <a gn-pagination-link href="#" [isActive]="true">2</a>
        </gn-pagination-item>
        <gn-pagination-item>
          <gn-pagination-ellipsis />
        </gn-pagination-item>
        <gn-pagination-item>
          <a gn-pagination-next href="#" aria-label="Go to next page"></a>
        </gn-pagination-item>
      </gn-pagination-content>
    </gn-pagination>
  `,
})
class Host {}

describe('Pagination', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the nav with role and aria-label', () => {
    const host = render();
    const nav = host.querySelector('[data-slot="pagination"]');
    expect(nav?.getAttribute('role')).toBe('navigation');
    expect(nav?.getAttribute('aria-label')).toBe('pagination');
  });

  it('marks the active link with aria-current=page and data-active', () => {
    const host = render();
    const active = host.querySelector('[data-active="true"]');
    expect(active).not.toBeNull();
    expect(active?.getAttribute('aria-current')).toBe('page');
  });

  it('renders previous, next and ellipsis affordances', () => {
    const host = render();
    expect(
      host.querySelector('[aria-label="Go to previous page"]'),
    ).not.toBeNull();
    expect(host.querySelector('[aria-label="Go to next page"]')).not.toBeNull();
    expect(
      host.querySelector('[data-slot="pagination-ellipsis"]'),
    ).not.toBeNull();
  });
});
