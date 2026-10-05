/**
 * Static app-wide constants: profiles, avatar gallery, color themes,
 * exercise type labels, and number range presets. All UI-facing strings
 * are in Czech per the spec.
 */

export const PROFILES = [
  { id: 'natalka', name: 'Nátálka' },
  { id: 'kristynka', name: 'Kristýnka' },
  { id: 'demo', name: 'Demo' },
];

export const AVATARS = ['🐱', '🐶', '🐰', '🦄', '🦊', '🐼', '🦁', '🐸'];

export const COLOR_THEMES = [
  { id: 'green', label: 'Zelená' },
  { id: 'blue', label: 'Modrá' },
  { id: 'purple', label: 'Fialová' },
  { id: 'pink', label: 'Růžová' },
];

export const EXERCISE_TYPES = [
  { id: 'scitani', label: 'Sčítání' },
  { id: 'odcitani', label: 'Odčítání' },
  { id: 'porovnavani', label: 'Porovnávání' },
];

export const NUMBER_RANGES = [10, 20, 50, 100];

export const QUESTIONS_PER_ROUND = 10;
