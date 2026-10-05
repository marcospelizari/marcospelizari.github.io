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
