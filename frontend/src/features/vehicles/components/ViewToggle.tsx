/**
 * ViewToggle Component
 *
 * Switch between grid and list views for the vehicle catalog.
 * Uses Lucide icons and follows the neutral + teal accent design system.
 */

import { Grid, List } from 'lucide-react';

type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

export function ViewToggle({ mode, onModeChange }: ViewToggleProps) {
  return (
    <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-white p-1">
      <button
        type="button"
        onClick={() => onModeChange('grid')}
        className={`relative inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
          mode === 'grid'
            ? 'bg-accent-500 text-white shadow-sm'
            : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
        }`}
        aria-label="Grid view"
      >
        <Grid className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onModeChange('list')}
        className={`relative inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
          mode === 'list'
            ? 'bg-accent-500 text-white shadow-sm'
            : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
        }`}
        aria-label="List view"
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  );
}
