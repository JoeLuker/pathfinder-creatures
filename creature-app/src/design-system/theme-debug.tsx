import { useTheme } from './theme-provider';
import { Button } from '@/components/ui/button';

// Debug component to validate theme system
export function ThemeDebug() {
  const { theme, isDark } = useTheme();

  if (process.env.NODE_ENV !== 'development') return null;

  const validateTheme = () => {
    const root = document.documentElement;
    const computedStyles = getComputedStyle(root);

    const criticalProperties = [
      // Semantic properties
      '--color-background',
      '--color-text-primary',
      '--color-interactive-primary',
      '--color-surface-secondary',
      '--color-border-primary',

      // Legacy shadcn/ui properties
      '--background',
      '--foreground',
      '--primary',
      '--card',
      '--border',
      '--muted',
      '--secondary',
    ];

    console.group(`🎨 Theme Validation - ${theme.toUpperCase()}`);

    criticalProperties.forEach(prop => {
      const value = computedStyles.getPropertyValue(prop).trim();
      const status = value ? '✅' : '❌';
      console.log(`${status} ${prop}: ${value || 'MISSING'}`);
    });

    // Check class application
    const hasCorrectClass = root.classList.contains(theme);
    console.log(`${hasCorrectClass ? '✅' : '❌'} Root class: ${theme} ${hasCorrectClass ? 'applied' : 'MISSING'}`);

    // Check color contrast
    const bgColor = computedStyles.getPropertyValue('--color-background').trim();
    const textColor = computedStyles.getPropertyValue('--color-text-primary').trim();
    console.log(`🎨 Background: ${bgColor}`);
    console.log(`📝 Text: ${textColor}`);

    console.groupEnd();
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-surface-primary border border-border rounded-lg shadow-lg z-50">
      <div className="flex items-center gap-2 text-sm">
        <span>Theme: {theme}</span>
        <span className={`w-3 h-3 rounded-full ${isDark ? 'bg-amber-400' : 'bg-slate-900'}`} />
        <Button size="sm" variant="outline" onClick={validateTheme}>
          Debug
        </Button>
      </div>
    </div>
  );
}