export type Level = 'essencial' | 'avancado';

export interface Topic {
  slug: string;
  label: string;
  /** JSON file per level, relative to public/data. */
  files: Partial<Record<Level, string>>;
}

export interface TopicGroup {
  label: string;
  icon: string;
  topics: Topic[];
}
