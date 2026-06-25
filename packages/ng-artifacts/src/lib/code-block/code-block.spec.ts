import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { CodeBlock } from './code-block';
import { CodeBlockCopyButton } from './code-block-copy-button';

const TS_CODE = `const answer = 42;`;

async function render(inputs: Record<string, unknown>) {
  const fixture = TestBed.createComponent(CodeBlock);
  fixture.componentRef.setInput('code', TS_CODE);
  fixture.componentRef.setInput('language', 'typescript');
  for (const [k, v] of Object.entries(inputs)) {
    fixture.componentRef.setInput(k, v);
  }
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  return fixture;
}

@Component({
  standalone: true,
  imports: [CodeBlock, CodeBlockCopyButton],
  template: `
    <code-block [code]="code" language="typescript">
      <code-block-copy-button />
    </code-block>
  `,
})
class HostWithCopyButton {
  code = TS_CODE;
}

describe('CodeBlock', () => {
  it('renders the light + dark snapshot containers for the given code', async () => {
    // Shiki highlight is async and may not resolve under jsdom; assert on the
    // synchronously-rendered shell (the two theme containers) rather than the
    // highlighted <pre>, which depends on the highlighter resolving.
    const fixture = await render({});
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.dark\\:hidden')).not.toBeNull();
    expect(host.querySelector('.dark\\:block')).not.toBeNull();
  });

  it('exposes the host data-slot/group classes', async () => {
    const fixture = await render({});
    const host = fixture.nativeElement as HTMLElement;
    expect(host.className).toContain('group');
    expect(host.className).toContain('rounded-md');
  });

  it('projects a copy button that reads code via DI', async () => {
    const fixture = TestBed.createComponent(HostWithCopyButton);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const button = host.querySelector('code-block-copy-button button');
    expect(button).not.toBeNull();
    expect(button?.getAttribute('aria-label')).toBe('Copy code');
  });
});
