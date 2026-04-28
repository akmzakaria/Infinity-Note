export const DEFAULT_CATEGORIES = ['All', 'Tasks','Books'] as const;

const STORAGE_KEY = 'infinity-note.categories';

export function loadCategories(): string[] {
  if (typeof window === 'undefined') return [...DEFAULT_CATEGORIES];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...DEFAULT_CATEGORIES];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [...DEFAULT_CATEGORIES];
    return normalizeCategories(parsed);
  } catch {
    return [...DEFAULT_CATEGORIES];
  }
}

export function saveCategories(categories: string[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeCategories(categories)));
  } catch {
    // ignore
  }
}

export function normalizeCategories(input: unknown[]): string[] {
  const cleaned = input
    .map((x) => (typeof x === 'string' ? x.trim() : ''))
    .filter(Boolean);

  const unique: string[] = [];
  for (const c of cleaned) {
    if (!unique.includes(c)) unique.push(c);
  }

  if (!unique.includes('All')) unique.unshift('All');
  return unique;
}


