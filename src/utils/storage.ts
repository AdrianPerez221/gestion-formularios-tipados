import {
  DEFAULT_THEME,
  isAppItem,
  isTheme,
} from '../types';
import type { AppItem, StoredAppState, Theme } from '../types';

const STORAGE_KEY = 'multi-theme-typed-form-state';

const fallbackState: StoredAppState = {
  theme: DEFAULT_THEME,
  items: [],
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const loadState = (): StoredAppState => {
  if (typeof window === 'undefined') {
    return fallbackState;
  }

  try {
    const rawState: string | null = window.localStorage.getItem(STORAGE_KEY);
    if (rawState === null) {
      return fallbackState;
    }

    const parsedValue: unknown = JSON.parse(rawState);
    if (!isRecord(parsedValue)) {
      return fallbackState;
    }

    const parsedTheme: unknown = parsedValue.theme;
    const parsedItems: unknown = parsedValue.items;

    const theme: Theme =
      typeof parsedTheme === 'string' && isTheme(parsedTheme) ? parsedTheme : DEFAULT_THEME;

    const items: AppItem[] = Array.isArray(parsedItems)
      ? parsedItems.filter((entry: unknown): entry is AppItem => isAppItem(entry))
      : [];

    return { theme, items };
  } catch {
    return fallbackState;
  }
};

export const saveState = (state: StoredAppState): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    return;
  }
};
