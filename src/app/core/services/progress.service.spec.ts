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

  it('migrates marks from former subtitles without overwriting newer ones', () => {
    const progress = create();
    progress.toggle('db/essencial#Índices');
    progress.toggle('db/essencial#Transações');
    progress.toggle('db/essencial#Transactions');
    progress.migrate('db', 'essencial', [
      { subtitle: 'Indexes', formerSubtitle: 'Índices', description: '', examples: [] },
      { subtitle: 'Transactions', formerSubtitle: 'Transações', description: '', examples: [] },
    ]);

    expect(progress.isStudied('db/essencial#Indexes')).toBe(true);
    expect(progress.isStudied('db/essencial#Índices')).toBe(false);
    expect(progress.isStudied('db/essencial#Transações')).toBe(false);
    expect(progress.countStudied(['db/essencial#Indexes', 'db/essencial#Transactions'])).toBe(2);
  });

  it('moves marks of a section that changed level, under its old or already migrated title', () => {
    const progress = create();
    progress.toggle('db/essencial#Pool de Conexões');   // never migrated: old level + old title
    progress.toggle('db/essencial#NoSQL Databases');    // title already migrated, old level
    progress.migrate('db', 'intermediario', [
      { subtitle: 'Connection Pooling', formerSubtitle: 'Pool de Conexões', formerLevel: 'essencial', description: '', examples: [] },
      { subtitle: 'NoSQL Databases', formerSubtitle: 'Bancos NoSQL', formerLevel: 'essencial', description: '', examples: [] },
    ]);

    expect(progress.isStudied('db/intermediario#Connection Pooling')).toBe(true);
    expect(progress.isStudied('db/intermediario#NoSQL Databases')).toBe(true);
    expect(progress.countStudied(['db/essencial#Pool de Conexões', 'db/essencial#NoSQL Databases'])).toBe(0);
  });

  it('starts empty when the saved data is corrupt', () => {
    localStorage.setItem(storageKey, '{not json');
    expect(create().countStudied(['x'])).toBe(0);
  });
});
