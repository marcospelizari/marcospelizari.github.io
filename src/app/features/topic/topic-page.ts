import { Component, computed, effect, inject, input } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { CodeBlock } from './code-block/code-block';
import { SearchService } from '../../core/services/search.service';
import { StudyContent } from '../../core/models/study-content.model';
import { Level } from '../../core/models/topic.model';
import { matchesQuery } from '../../core/utils/content.utils';
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
  protected readonly levels = Object.entries(LEVEL_LABELS) as [Level, string][];

  protected readonly levelLabel = computed(() => LEVEL_LABELS[this.level() as Level]);
  protected readonly entry = computed(() => findTopic(this.slug()));
  protected readonly file = computed(() => this.entry()?.topic.files[this.level() as Level]);

  protected readonly content = httpResource<StudyContent>(() => {
    const file = this.file();
    return file ? `data/${file}` : undefined;
  });

  /** Subsections matching the search, keeping their original number. */
  protected readonly sections = computed(() => {
    const data = this.content.hasValue() ? this.content.value() : undefined;
    const query = this.search.query();
    return (data?.subsections ?? [])
      .map((subsection, index) => ({ subsection, index }))
      .filter(({ subsection }) => matchesQuery(subsection, query));
  });

  constructor() {
    const title = inject(Title);
    effect(() => {
      const data = this.content.hasValue() ? this.content.value() : undefined;
      title.setTitle(data ? `${data.title} · ${SITE_CONFIG.name}` : SITE_CONFIG.name);
    });
  }

  protected sectionId(index: number): string {
    return `secao-${index + 1}`;
  }

  protected sectionNumber(index: number): string {
    return String(index + 1).padStart(2, '0');
  }

  /** In-page navigation; URL fragments are taken by hash routing. */
  protected scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
