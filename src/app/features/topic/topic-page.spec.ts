import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { SearchService } from '../../core/services/search.service';
import { StudyContent } from '../../core/models/study-content.model';
import { TopicPage } from './topic-page';

const content: StudyContent = {
  title: 'Controle de Versão (Git)',
  description: 'Conceitos básicos.',
  version: 'Git 2.43',
  resumo: ['Git é um diário do código.'],
  subsections: [
    {
      subtitle: 'O que é Git?',
      description: 'Definição.',
      examples: [
        {
          title: 'Explicação',
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
      examples: [{ title: 'Explicação', explanation: 'Resolva conflitos.' }],
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
  it('loads the topic JSON and renders its content as text', async () => {
    const { fixture, http } = render('controle-versao', 'essencial');
    http.expectOne('data/essencial/controle-versao.json').flush(content);
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h1')?.textContent).toContain('Controle de Versão (Git)');
    expect(el.textContent).toContain('Git 2.43');
    expect(el.textContent).toContain('Git é um diário do código.');
    expect(el.textContent).toContain('Por que o Git é essencial?');
    expect(el.textContent).toContain('<arquivo>');
    expect(el.querySelector('a[href="https://git-scm.com/doc"]')).not.toBeNull();
    expect(el.querySelectorAll('section[id^="secao-"]').length).toBe(2);
    http.verify();
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
    expect(fixture.nativeElement.textContent).toContain('Tópico não encontrado');
    http.verify();
  });
});
