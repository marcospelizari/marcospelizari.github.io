/** Shape of the JSON files in public/data. */
export interface StudyContent {
  title: string;
  description: string;
  version?: string;
  resumo?: string[];
  subsections: Subsection[];
}

export interface Subsection {
  subtitle: string;
  description: string;
  examples: Example[];
}

export interface Example {
  title: string;
  explanation: string;
  code?: string;
  interview_question?: string;
  references?: string[];
}
