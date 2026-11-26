import { Category } from '../models/study-content.model';

/** Section categories in pill-bar order, with their label and icon. */
export const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: 'conceitos', label: 'Concepts', icon: 'lightbulb' },
  { id: 'pratica', label: 'Practice', icon: 'code' },
  { id: 'boas-praticas', label: 'Best Practices', icon: 'verified' },
  { id: 'ferramentas', label: 'Tools', icon: 'build' },
];
