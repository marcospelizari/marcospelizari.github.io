/** Shape of the JSON files in public/data. */
export interface StudyContent {
  title: string;
  description: string;
  version?: string;
  resumo?: string[];
  subsections: Subsection[];
}

/** Section tag, used to filter sections by kind. */
export type Category = 'conceitos' | 'pratica' | 'boas-praticas' | 'ferramentas';

export interface Subsection {
  subtitle: string;
  /** Previous subtitle; progress saved under it moves to the current one. */
  formerSubtitle?: string;
  /** Previous level (e.g. 'essencial') of a section that moved to another level. */
  formerLevel?: string;
  description: string;
  category?: Category;
  examples: Example[];
}

export interface Example {
  title: string;
  explanation: string;
  code?: string;
  interview_question?: string;
  references?: string[];
}
