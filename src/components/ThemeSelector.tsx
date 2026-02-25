import type { ChangeEvent } from 'react';
import { THEME_OPTIONS, isTheme } from '../types';
import type { Theme } from '../types';

interface ThemeSelectorProps {
  selectedTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

function ThemeSelector({ selectedTheme, onThemeChange }: ThemeSelectorProps) {
  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const nextTheme: string = event.currentTarget.value;
    if (isTheme(nextTheme)) {
      onThemeChange(nextTheme);
    }
  };

  return (
    <section className="card selector-card">
      <h2>Tema</h2>
      <label htmlFor="theme-select">Selecciona el tipo de elementos a gestionar</label>
      <select id="theme-select" value={selectedTheme} onChange={handleThemeChange}>
        {THEME_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </section>
  );
}

export default ThemeSelector;
