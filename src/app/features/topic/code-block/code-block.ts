import { Component, computed, input, signal } from '@angular/core';
import Prism from 'prismjs';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-docker';
import 'prismjs/components/prism-json';
import { detectLanguage } from '../../../core/utils/content.utils';

@Component({
  selector: 'app-code-block',
  template: `
    <div class="rounded-xl bg-code-bg overflow-hidden shadow-md">
      <div class="px-space-md py-space-sm bg-code-bar flex items-center justify-between gap-2">
        <div class="flex items-center gap-1.5" aria-hidden="true">
          <span class="w-3 h-3 rounded-full bg-[#ef4444]/80"></span>
          <span class="w-3 h-3 rounded-full bg-[#eab308]/80"></span>
          <span class="w-3 h-3 rounded-full bg-[#22c55e]/80"></span>
          <span class="ml-2 text-label-kbd font-mono uppercase text-[#869397]">{{ language() }}</span>
        </div>
        <button
          type="button"
          (click)="copy()"
          class="px-space-sm py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#dfe2f1] text-body-sm flex items-center gap-1 transition-colors"
        >
          <span class="material-symbols-outlined text-[16px]" [class]="copied() ? 'text-[#4fdbc8]' : 'text-[#4cd7f6]'">
            {{ copied() ? 'check' : 'content_copy' }}
          </span>
          <span aria-live="polite">{{ copied() ? 'Copiado!' : 'Copiar' }}</span>
        </button>
      </div>
      <pre class="p-space-lg overflow-x-auto font-mono text-code-block text-[#dfe2f1]"><code [innerHTML]="highlighted()"></code></pre>
    </div>
  `,
})
export class CodeBlock {
  readonly code = input.required<string>();

  protected readonly language = computed(() => detectLanguage(this.code()));
  protected readonly copied = signal(false);

  /** Prism escapes the source, so snippets like `<plugin>` render as text. */
  protected readonly highlighted = computed(() => {
    const grammar = Prism.languages[this.language()];
    return grammar ? Prism.highlight(this.code(), grammar, this.language()) : escapeHtml(this.code());
  });

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code());
    } catch {
      return; // Clipboard blocked (e.g. insecure context): leave the button unchanged.
    }
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
