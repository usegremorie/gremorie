// @vitest-environment jsdom
import * as React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  Dropzone,
  DropzoneAction,
  DropzoneDescription,
  DropzoneIcon,
  DropzoneTitle,
  type DropzoneProps,
} from './dropzone';

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLElement;
let root: Root;

beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
  vi.restoreAllMocks();
});

function render(props: Partial<DropzoneProps> = {}) {
  act(() => {
    root.render(
      <Dropzone {...props}>
        <DropzoneIcon>i</DropzoneIcon>
        <DropzoneTitle>Drop files</DropzoneTitle>
        <DropzoneDescription>PNG up to 1 KB</DropzoneDescription>
        <DropzoneAction>Browse</DropzoneAction>
      </Dropzone>,
    );
  });
  return {
    area: host.querySelector('[data-slot="dropzone"]') as HTMLElement,
    input: host.querySelector('input[type="file"]') as HTMLInputElement,
  };
}

const file = (name: string, type: string, size = 10) =>
  new File([new Uint8Array(size)], name, { type });

async function drop(area: HTMLElement, files: File[]) {
  const event = new Event('drop', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'dataTransfer', {
    value: {
      types: ['Files'],
      files,
      items: files.map((f) => ({
        kind: 'file',
        type: f.type,
        getAsFile: () => f,
      })),
    },
  });
  await act(async () => {
    area.dispatchEvent(event);
    await new Promise((r) => setTimeout(r, 0));
  });
}

async function dragEnter(area: HTMLElement, types: string[]) {
  const event = new Event('dragenter', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'dataTransfer', {
    value: {
      types: ['Files'],
      items: types.map((type) => ({ kind: 'file', type })),
    },
  });
  await act(async () => {
    area.dispatchEvent(event);
    await new Promise((r) => setTimeout(r, 0));
  });
}

describe('Dropzone', () => {
  it('renders a focusable group labelled and described by its parts', () => {
    const { area } = render();
    expect(area.getAttribute('role')).toBe('group');
    expect(area.tabIndex).toBe(0);
    const title = host.querySelector('[data-slot="dropzone-title"]');
    const desc = host.querySelector('[data-slot="dropzone-description"]');
    expect(area.getAttribute('aria-labelledby')).toBe(title?.id);
    expect(area.getAttribute('aria-describedby')).toBe(desc?.id);
  });

  it('reports accepted and rejected files on drop', async () => {
    const onDrop = vi.fn();
    const onDropAccepted = vi.fn();
    const onDropRejected = vi.fn();
    const { area } = render({
      accept: { 'image/png': ['.png'] },
      maxSize: 100,
      onDrop,
      onDropAccepted,
      onDropRejected,
    });
    const ok = file('a.png', 'image/png');
    const wrongType = file('b.txt', 'text/plain');
    const tooBig = file('c.png', 'image/png', 500);
    await drop(area, [ok, wrongType, tooBig]);

    expect(onDrop).toHaveBeenCalledTimes(1);
    const [accepted, rejected] = onDrop.mock.calls[0];
    expect(accepted).toEqual([ok]);
    expect(
      rejected.map((r: { file: File; errors: { code: string }[] }) => [
        r.file.name,
        r.errors.map((e) => e.code),
      ]),
    ).toEqual([
      ['b.txt', ['file-invalid-type']],
      ['c.png', ['file-too-large']],
    ]);
    expect(onDropAccepted).toHaveBeenCalledWith([ok]);
    expect(onDropRejected).toHaveBeenCalledTimes(1);
  });

  it('rejects the surplus beyond maxFiles with too-many-files', async () => {
    const onDrop = vi.fn();
    const { area } = render({ maxFiles: 1, onDrop });
    await drop(area, [file('a.png', 'image/png'), file('b.png', 'image/png')]);
    const [accepted, rejected] = onDrop.mock.calls[0];
    expect(accepted).toHaveLength(1);
    expect(rejected[0].errors[0].code).toBe('too-many-files');
  });

  it('accepts a single file when multiple is off', async () => {
    const onDrop = vi.fn();
    const { area, input } = render({ multiple: false, onDrop });
    expect(input.multiple).toBe(false);
    await drop(area, [file('a.png', 'image/png'), file('b.png', 'image/png')]);
    const [accepted, rejected] = onDrop.mock.calls[0];
    expect(accepted).toHaveLength(1);
    expect(rejected).toHaveLength(1);
  });

  it('opens the picker with Enter and Space on the area', () => {
    const { area, input } = render();
    const click = vi.spyOn(input, 'click');
    for (const key of ['Enter', ' ']) {
      act(() => {
        area.dispatchEvent(
          new KeyboardEvent('keydown', { key, bubbles: true }),
        );
      });
    }
    expect(click).toHaveBeenCalledTimes(2);
  });

  it('opens the picker when the area or the action is clicked', () => {
    const { area, input } = render();
    const click = vi.spyOn(input, 'click');
    act(() => area.click());
    act(() =>
      (
        host.querySelector('[data-slot="dropzone-action"]') as HTMLElement
      ).click(),
    );
    expect(click).toHaveBeenCalledTimes(2);
  });

  it('exposes state as data attributes', () => {
    const { area } = render({ invalid: true });
    expect(area.hasAttribute('data-invalid')).toBe(true);
    expect(area.hasAttribute('data-disabled')).toBe(false);
    expect(area.hasAttribute('data-drag-active')).toBe(false);
  });

  it('sets data-drag-active while files hover, and data-drag-reject for a wrong type', async () => {
    const { area } = render({ accept: { 'image/*': [] } });
    await dragEnter(area, ['image/png']);
    expect(area.hasAttribute('data-drag-active')).toBe(true);
    expect(area.hasAttribute('data-drag-reject')).toBe(false);
    act(() => {
      area.dispatchEvent(new Event('dragleave', { bubbles: true }));
    });
    expect(area.hasAttribute('data-drag-active')).toBe(false);
    await dragEnter(area, ['text/plain']);
    expect(area.hasAttribute('data-drag-reject')).toBe(true);
  });

  it('is inert when disabled', async () => {
    const onDrop = vi.fn();
    const { area, input } = render({ disabled: true, onDrop });
    const click = vi.spyOn(input, 'click');
    expect(area.hasAttribute('data-disabled')).toBe(true);
    expect(area.getAttribute('aria-disabled')).toBe('true');
    expect(area.hasAttribute('tabindex')).toBe(false);
    expect(
      (host.querySelector('[data-slot="dropzone-action"]') as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    act(() => {
      area.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
      );
    });
    await drop(area, [file('a.png', 'image/png')]);
    expect(click).not.toHaveBeenCalled();
    expect(onDrop).not.toHaveBeenCalled();
  });

  it('forwards the ref to the area and the name to the input', () => {
    const ref = React.createRef<HTMLDivElement>();
    act(() => {
      root.render(<Dropzone ref={ref} name="files" />);
    });
    expect(ref.current?.getAttribute('data-slot')).toBe('dropzone');
    expect(host.querySelector('input')?.getAttribute('name')).toBe('files');
  });
});
