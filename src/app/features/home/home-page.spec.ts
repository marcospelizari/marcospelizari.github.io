import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TOPIC_FILES } from '../../core/data/topics';
import { StudyContent } from '../../core/models/study-content.model';
import { ProgressService } from '../../core/services/progress.service';
import { sectionKey } from '../../core/utils/content.utils';
import { HomePage } from './home-page';

/** Every file gets two sections: one with code + question, one without. */
const content: StudyContent = {
  title: 'T',
  description: 'D',
  subsections: [
    { subtitle: 'A', description: '', examples: [{ title: 'E', explanation: 'x', code: 'git init', interview_question: 'Q?' }] },
    { subtitle: 'B', description: '', examples: [{ title: 'E', explanation: 'y' }] },
  ],
};

describe('HomePage', () => {
  beforeEach(() => localStorage.clear());

  async function render() {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    const fixture = TestBed.createComponent(HomePage);
    TestBed.tick();
    const http = TestBed.inject(HttpTestingController);
    const requests = http.match((req) => req.url.startsWith('data/'));
    requests.forEach((req) => req.flush(content));
    await fixture.whenStable();
    return { fixture, requests };
  }

  function card(el: HTMLElement, title: string): string {
    const cards = Array.from(el.querySelectorAll('[aria-label="Resumo do progresso"] > div'));
    return cards.find((c) => c.textContent!.includes(title))!.textContent!.replace(/\s+/g, ' ');
  }

  it('loads every topic file and shows real totals', async () => {
    const { fixture, requests } = await render();
    const files = TOPIC_FILES.length;
    expect(requests.length).toBe(files);

    const el: HTMLElement = fixture.nativeElement;
    expect(card(el, 'Módulos concluídos')).toContain(`0 / ${files}`);
    expect(card(el, 'Seções estudadas')).toContain(`0 / ${files * 2}`);
    expect(card(el, 'Material de estudo')).toContain(`${files} snippets`);
    expect(card(el, 'Material de estudo')).toContain(`${files} perguntas`);
  });

  it('updates progress when sections are marked as studied', async () => {
    const { fixture } = await render();
    const { topic, level } = TOPIC_FILES[0];
    const progress = TestBed.inject(ProgressService);
    progress.toggle(sectionKey(topic.slug, level, 'A'));
    progress.toggle(sectionKey(topic.slug, level, 'B'));
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    expect(card(el, 'Módulos concluídos')).toContain(`1 / ${TOPIC_FILES.length}`);
    expect(card(el, 'Seções estudadas')).toContain('2 /');
    expect(card(el, 'Esta semana')).toContain('2 seções');
  });
});
