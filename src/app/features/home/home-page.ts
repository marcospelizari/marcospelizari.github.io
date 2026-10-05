import { Component, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { SITE_CONFIG } from '../../core/config/site.config';
import { LEVEL_LABELS, TOPIC_FILES, TOPIC_GROUPS } from '../../core/data/topics';
import { StudyContent } from '../../core/models/study-content.model';
import { Level } from '../../core/models/topic.model';
import { ProgressService } from '../../core/services/progress.service';
import { sectionKey } from '../../core/utils/content.utils';

/** Home: real content totals, study progress and an overview of every topic. */
@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  templateUrl: './home-page.html',
})
export class HomePage {
  private readonly http = inject(HttpClient);
  private readonly progress = inject(ProgressService);
  protected readonly groups = TOPIC_GROUPS;
  protected readonly levels = Object.entries(LEVEL_LABELS) as [Level, string][];
  protected readonly studiedLastWeek = this.progress.studiedLastWeek;

  /** All topic files at once (small JSONs), each with its section keys. */
  protected readonly modules = rxResource({
    stream: () =>
      forkJoin(
        TOPIC_FILES.map((entry) =>
          this.http.get<StudyContent>(`data/${entry.file}`).pipe(
            map((content) => ({
              ...entry,
              keys: content.subsections.map((s) => sectionKey(entry.topic.slug, entry.level, s.subtitle)),
              snippets: content.subsections.flatMap((s) => s.examples).filter((e) => e.code).length,
              questions: content.subsections.flatMap((s) => s.examples).filter((e) => e.interview_question).length,
            })),
          ),
        ),
      ),
  });

  /** Per module progress, recomputed whenever a section is (un)marked. */
  private readonly moduleProgress = computed(() =>
    (this.modules.hasValue() ? this.modules.value() : []).map((m) => ({
      ...m,
      total: m.keys.length,
      studied: this.progress.countStudied(m.keys),
    })),
  );

  protected readonly stats = computed(() => {
    const modules = this.moduleProgress();
    const sum = (pick: (m: (typeof modules)[number]) => number) => modules.reduce((acc, m) => acc + pick(m), 0);
    return {
      modules: modules.length,
      modulesDone: modules.filter((m) => m.total > 0 && m.studied === m.total).length,
      sections: sum((m) => m.total),
      sectionsStudied: sum((m) => m.studied),
      snippets: sum((m) => m.snippets),
      questions: sum((m) => m.questions),
    };
  });

  constructor() {
    inject(Title).setTitle(SITE_CONFIG.name);
  }

  /** Progress of one topic level, e.g. { studied: 3, total: 10 }. */
  protected levelProgress(slug: string, level: string) {
    return this.moduleProgress().find((m) => m.topic.slug === slug && m.level === level);
  }

  protected percent(part: number, total: number): number {
    return total ? Math.round((part / total) * 100) : 0;
  }
}
