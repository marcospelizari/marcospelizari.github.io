import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ProgressService } from '../../core/services/progress.service';
import { SearchService } from '../../core/services/search.service';
import { StudyContent } from '../../core/models/study-content.model';
import { TopicPage } from './topic-page';

const content: StudyContent = {
  title: 'Controle de Versão (Git)',
  description: 'The basics.',
  version: 'Git 2.43',
  resumo: ['Git é um diário do código.'],
  subsections: [
    {
      subtitle: 'O que é Git?',
      description: 'Definição.',
      category: 'conceitos',
      examples: [
        {
          title: 'Explanation',
          explanation: "Use 'git rm --cached <arquivo>' para parar de rastrear.",
          code: 'git init',
          interview_question: 'Por que o Git é essencial?',
          references: ['https://git-scm.com/doc'],
        },
      ],
    },
    {
      subtitle: 'Branch e Merge',
      description: 'Trabalho paralelo.',
      category: 'pratica',
      examples: [
        { title: 'Explanation', explanation: 'Resolva conflitos.\n\nDepois rode `git add`.' },
        { title: 'Common mistake', explanation: 'Commitar os marcadores de conflito.' },
      ],
    },
  ],
};

function render(slug: string, level: string) {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
  });
  const fixture = TestBed.createComponent(TopicPage);
  fixture.componentRef.setInput('slug', slug);
  fixture.componentRef.setInput('level', level);
  TestBed.tick(); // starts the request; whenStable() would wait for it

  return { fixture, http: TestBed.inject(HttpTestingController) };
}

describe('TopicPage', () => {
  beforeEach(() => localStorage.clear());

  it('loads the topic JSON and renders its content as text', async () => {
    const { fixture, http } = render('controle-versao', 'essencial');
    http.expectOne('data/essencial/controle-versao.json').flush(content);
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h1')?.textContent).toContain('Controle de Versão (Git)');
    expect(el.textContent).toContain('Git 2.43');
    const resumo = el.querySelector('details#resumo') as HTMLDetailsElement;
    expect(resumo.open).toBe(false);
    expect(resumo.textContent).toContain('Git é um diário do código.');
    expect(el.textContent).toContain('Por que o Git é essencial?');
    expect(el.textContent).toContain('<arquivo>');
    expect(el.querySelector('a[href="https://git-scm.com/doc"]')).not.toBeNull();
    expect(el.querySelectorAll('section[id^="secao-"]').length).toBe(2);
    http.verify();
  });

  it('renders paragraphs, inline code and example titles other than Explanation', async () => {
    const { fixture, http } = render('controle-versao', 'essencial');
    http.expectOne('data/essencial/controle-versao.json').flush(content);
    await fixture.whenStable();

    const section: HTMLElement = fixture.nativeElement.querySelector('#secao-2');
    expect(section.querySelectorAll('app-rich-text')[0].querySelectorAll('p').length).toBe(2);
    expect(section.querySelector('code')?.textContent).toBe('git add');
    const titles = Array.from(section.querySelectorAll('article h3')).map((h) => h.textContent!.trim());
    expect(titles).toEqual(['Common mistake']);
  });

  it('moves a progress mark from a former subtitle to the current one', async () => {
    const { fixture, http } = render('controle-versao', 'essencial');
    const progress = TestBed.inject(ProgressService);
    progress.toggle('controle-versao/essencial#Ramificação');
    const renamed = structuredClone(content);
    renamed.subsections[1].formerSubtitle = 'Ramificação';
    http.expectOne('data/essencial/controle-versao.json').flush(renamed);
    await fixture.whenStable();

    expect(progress.isStudied('controle-versao/essencial#Branch e Merge')).toBe(true);
    expect(progress.isStudied('controle-versao/essencial#Ramificação')).toBe(false);
  });

  it('filters sections with the search query', async () => {
    const { fixture, http } = render('controle-versao', 'essencial');
    http.expectOne('data/essencial/controle-versao.json').flush(content);
    TestBed.inject(SearchService).query.set('conflitos');
    await fixture.whenStable();

    const sections = fixture.nativeElement.querySelectorAll('section[id^="secao-"]');
    expect(sections.length).toBe(1);
    expect(sections[0].id).toBe('secao-2');
  });

  it('shows not found for an unknown topic', async () => {
    const { fixture, http } = render('nao-existe', 'essencial');
    expect(fixture.nativeElement.textContent).toContain('Topic not found');
    http.verify();
  });

  describe('filter pills', () => {
    function pill(el: HTMLElement, label: string): HTMLButtonElement {
      const buttons = Array.from(el.querySelectorAll<HTMLButtonElement>('[aria-label="Filter sections by type"] button'));
      return buttons.find((b) => b.textContent!.includes(label))!;
    }

    async function loaded() {
      const result = render('controle-versao', 'essencial');
      result.http.expectOne('data/essencial/controle-versao.json').flush(content);
      await result.fixture.whenStable();
      return result;
    }

    it('shows counts and disables categories the topic does not use', async () => {
      const { fixture } = await loaded();
      const el: HTMLElement = fixture.nativeElement;
      expect(pill(el, 'All').textContent).toContain('2');
      expect(pill(el, 'All').getAttribute('aria-pressed')).toBe('true');
      expect(pill(el, 'Concepts').textContent).toContain('1');
      expect(pill(el, 'Tools').disabled).toBe(true);
    });

    it('shows only the sections of the selected category and hides the resumo', async () => {
      const { fixture } = await loaded();
      const el: HTMLElement = fixture.nativeElement;
      pill(el, 'Practice').click();
      await fixture.whenStable();

      const sections = el.querySelectorAll('section[id^="secao-"]');
      expect(sections.length).toBe(1);
      expect(sections[0].id).toBe('secao-2');
      expect(el.querySelector('details#resumo')).toBeNull();
      expect(pill(el, 'Practice').getAttribute('aria-pressed')).toBe('true');
    });

    it('combines with the search and can clear both', async () => {
      const { fixture } = await loaded();
      const el: HTMLElement = fixture.nativeElement;
      pill(el, 'Concepts').click();
      TestBed.inject(SearchService).query.set('conflitos'); // only matches a "pratica" section
      await fixture.whenStable();
      expect(el.querySelectorAll('section[id^="secao-"]').length).toBe(0);

      Array.from(el.querySelectorAll('button')).find((b) => b.textContent!.includes('Clear filters'))!.click();
      await fixture.whenStable();
      expect(el.querySelectorAll('section[id^="secao-"]').length).toBe(2);
      expect(TestBed.inject(SearchService).query()).toBe('');
    });

    it('resets to "All" when the level changes', async () => {
      const { fixture, http } = await loaded();
      pill(fixture.nativeElement, 'Practice').click();
      await fixture.whenStable();

      fixture.componentRef.setInput('level', 'avancado');
      TestBed.tick();
      http.expectOne('data/avancado/controle-versao-avancado.json').flush(content);
      await fixture.whenStable();
      expect(pill(fixture.nativeElement, 'All').getAttribute('aria-pressed')).toBe('true');
      expect(fixture.nativeElement.querySelectorAll('section[id^="secao-"]').length).toBe(2);
    });
  });

  it('marks a section as studied and shows it in "On This Page"', async () => {
    const { fixture, http } = render('controle-versao', 'essencial');
    http.expectOne('data/essencial/controle-versao.json').flush(content);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const button = el.querySelector<HTMLButtonElement>('#secao-1 button[aria-pressed]')!;
    expect(button.textContent).toContain('Mark as studied');
    button.click();
    await fixture.whenStable();

    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.textContent).toContain('Studied');
    expect(el.querySelectorAll('nav[aria-label="On this page"] [aria-label="studied"]').length).toBe(1);
    expect(TestBed.inject(ProgressService).isStudied('controle-versao/essencial#O que é Git?')).toBe(true);
  });
});
