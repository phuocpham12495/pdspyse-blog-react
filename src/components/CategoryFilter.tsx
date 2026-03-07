import type { Category } from '../types';
import './CategoryFilter.css';

interface CategoryFilterProps {
    categories: Category[];
    selected: string | null;
    onSelect: (categoryId: string | null) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
    return (
        <div className="category-filter" id="category-filter" role="group" aria-label="Filter by category">
            <button
                className={`category-filter__tag ${!selected ? 'is-active' : ''}`}
                onClick={() => onSelect(null)}
            >
                ✨ All
            </button>
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    className={`category-filter__tag ${selected === cat.id ? 'is-active' : ''}`}
                    onClick={() => onSelect(cat.id)}
                >
                    {cat.name}
                </button>
            ))}
        </div>
    );
}
