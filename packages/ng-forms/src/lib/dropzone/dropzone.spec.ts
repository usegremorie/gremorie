import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  Dropzone,
  DropzoneAction,
  DropzoneDescription,
  DropzoneIcon,
  DropzoneTitle,
  type DropzoneAccept,
  type DropzoneFilesDropped,
  type FileRejection,
} from './dropzone';

@Component({
  standalone: true,
  imports: [
    Dropzone,
    DropzoneIcon,
    DropzoneTitle,
    DropzoneDescription,
    DropzoneAction,
  ],
  template: `
    <gr-dropzone
      [accept]="accept()"
      [multiple]="multiple()"
      [maxSize]="maxSize()"
      [maxFiles]="maxFiles()"
      [disabled]="disabled()"
      [invalid]="invalid()"
      name="files"
      (filesDropped)="dropped.push($event)"
      (filesAccepted)="acceptedEvents.push($event)"
      (filesRejected)="rejectedEvents.push($event)"
    >
      <gr-dropzone-icon>i</gr-dropzone-icon>
      <gr-dropzone-title>Drop files</gr-dropzone-title>
      <gr-dropzone-description>PNG up to 1 KB</gr-dropzone-description>
      <gr-dropzone-action>Browse</gr-dropzone-action>
    </gr-dropzone>
  `,
})
class Host {
  accept = signal<DropzoneAccept | undefined>(undefined);
  multiple = signal(true);
  maxSize = signal<number | undefined>(undefined);
  maxFiles = signal<number | undefined>(undefined);
  disabled = signal(false);
  invalid = signal(false);
  dropped: DropzoneFilesDropped[] = [];
  acceptedEvents: File[][] = [];
  rejectedEvents: FileRejection[][] = [];
}

const file = (name: string, type: string, size = 10) =>
  new File([new Uint8Array(size)], name, { type });

function dragEvent(
  type: string,
  data: { files?: File[]; items?: { kind: string; type: string }[] },
) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'dataTransfer', {
    value: {
      types: ['Files'],
      files: data.files ?? [],
      items: data.items ?? [],
      dropEffect: 'none',
    },
  });
  return event;
}

describe('Dropzone', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const area = el.querySelector('gr-dropzone') as HTMLElement;
    const input = el.querySelector('input[type="file"]') as HTMLInputElement;
    return { fixture, host: fixture.componentInstance, el, area, input };
  }

  async function dropFiles(
    ctx: ReturnType<typeof render>,
    files: File[],
  ): Promise<void> {
    ctx.area.dispatchEvent(dragEvent('drop', { files }));
    ctx.fixture.detectChanges();
    await ctx.fixture.whenStable();
  }

  it('renders a focusable group labelled and described by its parts', () => {
    const { area, el, fixture } = render();
    fixture.detectChanges();
    expect(area.getAttribute('role')).toBe('group');
    expect(area.tabIndex).toBe(0);
    expect(area.getAttribute('data-slot')).toBe('dropzone');
    const title = el.querySelector('gr-dropzone-title');
    const desc = el.querySelector('gr-dropzone-description');
    expect(area.getAttribute('aria-labelledby')).toBe(title?.id);
    expect(area.getAttribute('aria-describedby')).toBe(desc?.id);
  });

  it('reports accepted and rejected files on drop', async () => {
    const ctx = render();
    ctx.host.accept.set({ 'image/png': ['.png'] });
    ctx.host.maxSize.set(100);
    ctx.fixture.detectChanges();
    const ok = file('a.png', 'image/png');
    await dropFiles(ctx, [
      ok,
      file('b.txt', 'text/plain'),
      file('c.png', 'image/png', 500),
    ]);

    expect(ctx.host.dropped).toHaveLength(1);
    const { accepted, rejected } = ctx.host.dropped[0];
    expect(accepted).toEqual([ok]);
    expect(
      rejected.map((r) => [r.file.name, r.errors.map((e) => e.code)]),
    ).toEqual([
      ['b.txt', ['file-invalid-type']],
      ['c.png', ['file-too-large']],
    ]);
    expect(ctx.host.acceptedEvents).toEqual([[ok]]);
    expect(ctx.host.rejectedEvents).toHaveLength(1);
  });

  it('rejects the surplus beyond maxFiles with too-many-files', async () => {
    const ctx = render();
    ctx.host.maxFiles.set(1);
    ctx.fixture.detectChanges();
    await dropFiles(ctx, [
      file('a.png', 'image/png'),
      file('b.png', 'image/png'),
    ]);
    const { accepted, rejected } = ctx.host.dropped[0];
    expect(accepted).toHaveLength(1);
    expect(rejected[0].errors[0].code).toBe('too-many-files');
  });

  it('accepts a single file when multiple is off', async () => {
    const ctx = render();
    ctx.host.multiple.set(false);
    ctx.fixture.detectChanges();
    expect(ctx.input.multiple).toBe(false);
    await dropFiles(ctx, [
      file('a.png', 'image/png'),
      file('b.png', 'image/png'),
    ]);
    const { accepted, rejected } = ctx.host.dropped[0];
    expect(accepted).toHaveLength(1);
    expect(rejected).toHaveLength(1);
  });

  it('reports files picked through the native input', () => {
    const ctx = render();
    const picked = file('a.png', 'image/png');
    Object.defineProperty(ctx.input, 'files', { value: [picked] });
    ctx.input.dispatchEvent(new Event('change'));
    expect(ctx.host.dropped[0].accepted).toEqual([picked]);
  });

  it('opens the picker with Enter and Space on the area', () => {
    const { area, input } = render();
    const click = vi.spyOn(input, 'click');
    for (const key of ['Enter', ' ']) {
      area.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    }
    expect(click).toHaveBeenCalledTimes(2);
  });

  it('opens the picker when the area or the action is clicked', () => {
    const { area, el, input } = render();
    const click = vi.spyOn(input, 'click');
    area.click();
    (el.querySelector('gr-dropzone-action button') as HTMLElement).click();
    expect(click).toHaveBeenCalledTimes(2);
  });

  it('sets data-drag-active while files hover, and data-drag-reject for a wrong type', () => {
    const ctx = render();
    ctx.host.accept.set({ 'image/*': [] });
    ctx.fixture.detectChanges();
    ctx.area.dispatchEvent(
      dragEvent('dragenter', { items: [{ kind: 'file', type: 'image/png' }] }),
    );
    ctx.fixture.detectChanges();
    expect(ctx.area.hasAttribute('data-drag-active')).toBe(true);
    expect(ctx.area.hasAttribute('data-drag-reject')).toBe(false);
    ctx.area.dispatchEvent(new Event('dragleave', { bubbles: true }));
    ctx.fixture.detectChanges();
    expect(ctx.area.hasAttribute('data-drag-active')).toBe(false);
    ctx.area.dispatchEvent(
      dragEvent('dragenter', { items: [{ kind: 'file', type: 'text/plain' }] }),
    );
    ctx.fixture.detectChanges();
    expect(ctx.area.hasAttribute('data-drag-reject')).toBe(true);
  });

  it('exposes invalid as a data attribute', () => {
    const ctx = render();
    ctx.host.invalid.set(true);
    ctx.fixture.detectChanges();
    expect(ctx.area.hasAttribute('data-invalid')).toBe(true);
    expect(ctx.area.hasAttribute('data-disabled')).toBe(false);
  });

  it('is inert when disabled', async () => {
    const ctx = render();
    ctx.host.disabled.set(true);
    ctx.fixture.detectChanges();
    const click = vi.spyOn(ctx.input, 'click');
    expect(ctx.area.hasAttribute('data-disabled')).toBe(true);
    expect(ctx.area.getAttribute('aria-disabled')).toBe('true');
    expect(ctx.area.hasAttribute('tabindex')).toBe(false);
    expect(
      (ctx.el.querySelector('gr-dropzone-action button') as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    ctx.area.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    await dropFiles(ctx, [file('a.png', 'image/png')]);
    expect(click).not.toHaveBeenCalled();
    expect(ctx.host.dropped).toHaveLength(0);
  });

  it('forwards name to the file input', () => {
    expect(render().input.getAttribute('name')).toBe('files');
  });
});
