import {
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export type DarkMode = 'light' | 'dark';
export type ColorPreset = 'default' | 'blue' | 'emerald' | 'sunset';

export interface ColorPresetOption {
  id: ColorPreset;
  label: string;
  swatch: string;
}

export const COLOR_PRESETS: readonly ColorPresetOption[] = [
  { id: 'default', label: 'Padrão', swatch: 'oklch(0.205 0 0)' },
  { id: 'blue', label: 'Azul Corporativo', swatch: 'oklch(0.5 0.18 250)' },
  { id: 'emerald', label: 'Esmeralda', swatch: 'oklch(0.52 0.18 162)' },
  { id: 'sunset', label: 'Pôr do Sol', swatch: 'oklch(0.58 0.2 35)' },
] as const;

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  readonly darkMode = signal<DarkMode>('light');
  readonly colorPreset = signal<ColorPreset>('default');

  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const storedDark = window.localStorage.getItem('shadng-theme') as DarkMode | null;
    const storedPreset = window.localStorage.getItem('shadng-color-preset') as ColorPreset | null;

    const darkMode: DarkMode =
      storedDark === 'dark' || storedDark === 'light'
        ? storedDark
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';

    const colorPreset: ColorPreset =
      storedPreset === 'default' ||
      storedPreset === 'blue' ||
      storedPreset === 'emerald' ||
      storedPreset === 'sunset'
        ? storedPreset
        : 'default';

    this.applyDarkMode(darkMode);
    this.applyColorPreset(colorPreset);
  }

  toggleDarkMode(): void {
    const next: DarkMode = this.darkMode() === 'dark' ? 'light' : 'dark';
    this.applyDarkMode(next);
    if (isPlatformBrowser(this.platformId)) {
      try { window.localStorage.setItem('shadng-theme', next); } catch { /* ignore */ }
    }
  }

  setColorPreset(preset: ColorPreset): void {
    this.applyColorPreset(preset);
    if (isPlatformBrowser(this.platformId)) {
      try { window.localStorage.setItem('shadng-color-preset', preset); } catch { /* ignore */ }
    }
  }

  private applyDarkMode(mode: DarkMode): void {
    this.darkMode.set(mode);
    const root = this.document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  private applyColorPreset(preset: ColorPreset): void {
    this.colorPreset.set(preset);
    const root = this.document.documentElement;
    if (preset === 'default') {
      delete root.dataset['colorTheme'];
    } else {
      root.dataset['colorTheme'] = preset;
    }
  }
}
