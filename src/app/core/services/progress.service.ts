import { Injectable, computed, effect, signal } from '@angular/core';
import { SITE_CONFIG } from '../config/site.config';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Sections marked as studied, kept in this browser's localStorage
 * (key -> ISO date it was marked). Progress is per browser, not synced.
 */
@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly studied = signal<Record<string, string>>(load());

  /** Sections marked in the last 7 days. */
  readonly studiedLastWeek = computed(() => {
    const since = Date.now() - WEEK_MS;
    return Object.values(this.studied()).filter((date) => Date.parse(date) >= since).length;
  });

  constructor() {
    effect(() => {
      try {
        localStorage.setItem(SITE_CONFIG.progressStorageKey, JSON.stringify(this.studied()));
      } catch {
        // Storage unavailable (private mode): progress lasts for this visit only.
      }
    });
  }

  isStudied(key: string): boolean {
    return key in this.studied();
  }

  /** How many of the given section keys are marked as studied. */
  countStudied(keys: string[]): number {
    const studied = this.studied();
    return keys.filter((key) => key in studied).length;
  }

  toggle(key: string): void {
    this.studied.update(({ [key]: current, ...rest }) =>
      current ? rest : { ...rest, [key]: new Date().toISOString() },
    );
  }
}

function load(): Record<string, string> {
  try {
    const saved = JSON.parse(localStorage.getItem(SITE_CONFIG.progressStorageKey) ?? '{}');
    return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
  } catch {
    return {}; // Missing, corrupt or blocked storage starts empty.
  }
}
