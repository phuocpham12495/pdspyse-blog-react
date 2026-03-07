import './LoadingSpinner.css';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
    return (
        <div className={`loading-spinner-wrap loading-spinner-wrap--${size}`}>
            <div className="loading-spinner-ring">
                <div /><div /><div /><div />
            </div>
            {text && <p className="loading-spinner-text">{text}</p>}
        </div>
    );
}
