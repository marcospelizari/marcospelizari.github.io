/** Site-wide settings. Layout sizes and colors live as tokens in src/styles.css. */
export const SITE_CONFIG = {
  name: 'Estudos.dev',
  repoUrl: 'https://github.com/marcospelizari/marcospelizari.github.io',
  /** localStorage key for the theme; src/index.html reads the same key before first paint. */
  themeStorageKey: 'theme',
  /** localStorage key for sections marked as studied. */
  progressStorageKey: 'progress',
} as const;
