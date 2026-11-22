import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeSwitcherProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeSwitcher({ className = '', showLabel = false }: ThemeSwitcherProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`group relative inline-flex items-center gap-2 p-2 rounded-none border border-rule hover:border-ember text-muted hover:text-foreground transition-all duration-150 cursor-pointer ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-ember group-hover:rotate-45 transition-transform duration-200" />
        ) : (
          <Moon className="w-4 h-4 text-ember group-hover:-rotate-12 transition-transform duration-200" />
        )}
      </div>
      {showLabel && (
        <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-muted group-hover:text-foreground">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
}
