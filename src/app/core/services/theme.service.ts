import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly mode = signal<ThemeMode>(this.loadPreference());

  constructor() {
    this.applyTheme(this.mode());
  }

  toggle(): void {
    const modes: ThemeMode[] = ['light', 'dark', 'system'];
    const next = modes[(modes.indexOf(this.mode()) + 1) % 3];
    this.mode.set(next);
    this.applyTheme(next);
  }

  private applyTheme(mode: ThemeMode): void {
    const html = document.documentElement;
    html.removeAttribute('data-theme');
    if (mode !== 'system') {
      html.setAttribute('data-theme', mode);
    }
    this.savePreference(mode);
  }

  private loadPreference(): ThemeMode {
    try {
      const stored = localStorage.getItem('autonex-theme');
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    } catch {}
    return 'system';
  }

  private savePreference(mode: ThemeMode): void {
    try {
      localStorage.setItem('autonex-theme', mode);
    } catch {}
  }
}
