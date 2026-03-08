import './ViewToggle.css';

export type ViewMode = 'grid' | 'classic' | 'timeline' | 'magazine' | 'masonry';

interface ViewToggleProps {
    activeView: ViewMode;
    onViewChange: (mode: ViewMode) => void;
}

const views: { mode: ViewMode; icon: string; label: string }[] = [
    { mode: 'grid', icon: '⊞', label: 'Grid View' },
    { mode: 'classic', icon: '☰', label: 'Classic List' },
    { mode: 'timeline', icon: '⏱', label: 'Timeline' },
    { mode: 'magazine', icon: '📰', label: 'Magazine' },
    { mode: 'masonry', icon: '▦', label: 'Masonry' },
];

export default function ViewToggle({ activeView, onViewChange }: ViewToggleProps) {
    return (
        <div className="view-toggle" role="group" aria-label="Article view mode">
            {views.map(({ mode, icon, label }) => (
                <button
                    key={mode}
                    className={`view-toggle__btn${activeView === mode ? ' view-toggle__btn--active' : ''}`}
                    onClick={() => onViewChange(mode)}
                    title={label}
                    aria-label={label}
                    aria-pressed={activeView === mode}
                >
                    <span className="view-toggle__icon">{icon}</span>
                </button>
            ))}
        </div>
    );
}
