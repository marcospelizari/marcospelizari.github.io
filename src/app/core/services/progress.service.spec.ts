import { TestBed } from '@angular/core/testing';
import { SITE_CONFIG } from '../config/site.config';
import { ProgressService } from './progress.service';

describe('ProgressService', () => {
  const storageKey = SITE_CONFIG.progressStorageKey;

  beforeEach(() => localStorage.clear());

  function create(): ProgressService {
    return TestBed.inject(ProgressService);
  }

  it('toggles a section on and off', () => {
    const progress = create();
    progress.toggle('git/essencial#Branch');
    expect(progress.isStudied('git/essencial#Branch')).toBe(true);
    progress.toggle('git/essencial#Branch');
    expect(progress.isStudied('git/essencial#Branch')).toBe(false);
  });

  it('saves to localStorage and counts studied keys', () => {
    const progress = create();
    progress.toggle('a');
    progress.toggle('b');
    TestBed.tick(); // flush the persistence effect

    expect(Object.keys(JSON.parse(localStorage.getItem(storageKey)!))).toEqual(['a', 'b']);
    expect(progress.countStudied(['a', 'b', 'c'])).toBe(2);
  });

  it('restores saved progress and only counts the last 7 days as this week', () => {
    const old = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
    localStorage.setItem(storageKey, JSON.stringify({ antiga: old, recente: new Date().toISOString() }));

    const progress = create();
    expect(progress.isStudied('antiga')).toBe(true);
    expect(progress.studiedLastWeek()).toBe(1);
  });

  it('starts empty when the saved data is corrupt', () => {
    localStorage.setItem(storageKey, '{not json');
    expect(create().countStudied(['x'])).toBe(0);
  });
});
