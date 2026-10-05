import { SITE_CONFIG } from '../config/site.config';
import { DOCUMENT, Injectable, effect, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

/** Light/dark theme. index.html sets the initial value before first paint. */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly root = inject(DOCUMENT).documentElement;
  readonly theme = signal<Theme>(this.root.dataset['theme'] === 'dark' ? 'dark' : 'light');

  constructor() {
    effect(() => {
      const theme = this.theme();
      this.root.dataset['theme'] = theme;
      try {
        localStorage.setItem(SITE_CONFIG.themeStorageKey, theme);
      } catch {
        // Storage unavailable (private mode): theme still applies for this visit.
      }
    });
  }

  toggle(): void {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }
}
