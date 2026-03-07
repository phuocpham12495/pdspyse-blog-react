import { useState, useEffect, useRef } from 'react';
import './SearchBar.css';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Search articles...' }: SearchBarProps) {
    const [local, setLocal] = useState(value);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => {
        setLocal(value);
    }, [value]);

    const handleChange = (val: string) => {
        setLocal(val);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => onChange(val), 350);
    };

    const handleClear = () => {
        setLocal('');
        onChange('');
    };

    return (
        <div className="search-bar" id="search-bar">
            <span className="search-bar__icon">🔍</span>
            <input
                type="text"
                className="search-bar__input"
                value={local}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={placeholder}
                aria-label="Search articles"
                id="search-input"
            />
            {local && (
                <button className="search-bar__clear" onClick={handleClear} aria-label="Clear search">
                    ✕
                </button>
            )}
        </div>
    );
}
