import { Component, computed, effect, inject, input, linkedSignal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { CodeBlock } from './code-block/code-block';
import { SearchService } from '../../core/services/search.service';
import { Category, StudyContent } from '../../core/models/study-content.model';
import { CATEGORIES } from '../../core/data/categories';
import { Level } from '../../core/models/topic.model';
import { matchesQuery, sectionKey } from '../../core/utils/content.utils';
import { ProgressService } from '../../core/services/progress.service';
import { SITE_CONFIG } from '../../core/config/site.config';
import { LEVEL_LABELS, findTopic } from '../../core/data/topics';

@Component({
  selector: 'app-topic-page',
  imports: [RouterLink, CodeBlock],
  templateUrl: './topic-page.html',
})
export class TopicPage {
  /** Route params, bound via withComponentInputBinding. */
  readonly slug = input.required<string>();
  readonly level = input.required<string>();

  protected readonly search = inject(SearchService);
  protected readonly progress = inject(ProgressService);
  protected readonly levels = Object.entries(LEVEL_LABELS) as [Level, string][];

  protected readonly levelLabel = computed(() => LEVEL_LABELS[this.level() as Level]);
  protected readonly entry = computed(() => findTopic(this.slug()));
  protected readonly file = computed(() => this.entry()?.topic.files[this.level() as Level]);

  protected readonly content = httpResource<StudyContent>(() => {
    const file = this.file();
    return file ? `data/${file}` : undefined;
  });

  /** Selected pill (null = all); back to "Todos" whenever the topic or level changes. */
  protected readonly category = linkedSignal<Category | null>(() => {
    this.slug();
    this.level();
    return null;
  });

  private readonly subsections = computed(() =>
    this.content.hasValue() ? this.content.value().subsections : [],
  );

  /** Pill bar entries with section counts; categories absent from the topic have count 0. */
  protected readonly filters = computed(() => [
    { id: null, label: 'Todos', icon: 'apps', count: this.subsections().length },
    ...CATEGORIES.map((c) => ({
      ...c,
      count: this.subsections().filter((s) => s.category === c.id).length,
    })),
  ]);

  /** Subsections matching the pill and the search, keeping their original number. */
  protected readonly sections = computed(() => {
    const category = this.category();
    const query = this.search.query();
    return this.subsections()
      .map((subsection, index) => ({ subsection, index }))
      .filter(({ subsection }) => !category || subsection.category === category)
      .filter(({ subsection }) => matchesQuery(subsection, query));
  });

  /** The resumo is an overview; hide it while the reader narrows the page down. */
  protected readonly showResumo = computed(
    () =>
      this.content.hasValue() &&
      !!this.content.value().resumo?.length &&
      !this.category() &&
      !this.search.query(),
  );

  constructor() {
    const title = inject(Title);
    effect(() => {
      const data = this.content.hasValue() ? this.content.value() : undefined;
      title.setTitle(data ? `${data.title} · ${SITE_CONFIG.name}` : SITE_CONFIG.name);
    });
  }

  protected clearFilters(): void {
    this.category.set(null);
    this.search.query.set('');
  }

  protected key(subtitle: string): string {
    return sectionKey(this.slug(), this.level(), subtitle);
  }

  protected sectionId(index: number): string {
    return `secao-${index + 1}`;
  }

  protected sectionNumber(index: number): string {
    return String(index + 1).padStart(2, '0');
  }

  /** In-page navigation; URL fragments are taken by hash routing. */
  protected scrollTo(id: string): void {
    const target = document.getElementById(id);
    if (target instanceof HTMLDetailsElement) target.open = true;
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
