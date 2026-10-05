import { Category } from '../models/study-content.model';

/** Section categories in pill-bar order, with their label and icon. */
export const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: 'conceitos', label: 'Conceitos', icon: 'lightbulb' },
  { id: 'pratica', label: 'Prática', icon: 'code' },
  { id: 'boas-praticas', label: 'Boas Práticas', icon: 'verified' },
  { id: 'ferramentas', label: 'Ferramentas', icon: 'build' },
];
