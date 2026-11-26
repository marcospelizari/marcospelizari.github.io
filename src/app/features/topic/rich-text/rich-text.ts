import { Component, computed, input } from '@angular/core';
import { parseRichText } from '../../../core/utils/content.utils';

/** Prose from the JSON: paragraphs on blank lines, `code` and **bold** inline. */
@Component({
  selector: 'app-rich-text',
  template: `
    @for (paragraph of paragraphs(); track $index) {
      <p [class]="paragraphClass()">
        @for (s of paragraph; track $index) {
          @switch (s.kind) {
            @case ('code') {
              <code class="px-1 py-0.5 rounded bg-surface-container-high text-primary font-mono text-[0.9em]">{{ s.value }}</code>
            }
            @case ('bold') {
              <strong class="font-semibold text-on-surface">{{ s.value }}</strong>
            }
            @default {
              {{ s.value }}
            }
          }
        }
      </p>
    }
  `,
  host: { class: 'flex flex-col gap-space-sm' },
})
export class RichText {
  readonly text = input.required<string>();
  readonly paragraphClass = input('');
  protected readonly paragraphs = computed(() => parseRichText(this.text()));
}
