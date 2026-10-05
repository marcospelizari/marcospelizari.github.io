import { Subsection } from '../models/study-content.model';

/** Case- and accent-insensitive normalization, so "versao" matches "Versão". */
export function normalize(text: string): string {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

export function matchesQuery(subsection: Subsection, query: string): boolean {
  const term = normalize(query.trim());
  if (!term) return true;
  const haystack = [
    subsection.subtitle,
    subsection.description,
    ...subsection.examples.flatMap((e) => [e.explanation, e.interview_question ?? '', e.code ?? '']),
  ].join('\n');
  return normalize(haystack).includes(term);
}

/** Prism grammar for a snippet; the JSON has no language field, so infer it. */
export function detectLanguage(code: string): string {
  const trimmed = code.trim();
  if (/^[{[]/.test(trimmed)) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch {
      /* not JSON */
    }
  }
  if (/^\s*FROM\s+\S+/m.test(code) && /^\s*(RUN|COPY|CMD|ENTRYPOINT|WORKDIR)\b/m.test(code)) return 'docker';
  if (/^\s*<[\w:]+[\s>]/m.test(code)) return 'markup';
  if (/^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|BEGIN|SET TRANSACTION|EXPLAIN)\b/m.test(code)) return 'sql';
  if (/\b(class|interface|record|import|public|private|void|return|new)\b|^\s*@\w+|;\s*$/m.test(code)) return 'java';
  if (/^\s*-?\s*[\w.-]+:(\s|$)/m.test(code)) return 'yaml';
  if (/^\s*(git|docker|mvn|java|javac|curl|kubectl|npm)\s/m.test(code)) return 'bash';
  return 'plaintext';
}

/** Stable id of a section for progress tracking: survives reordering, not renaming. */
export function sectionKey(slug: string, level: string, subtitle: string): string {
  return `${slug}/${level}#${subtitle}`;
}
