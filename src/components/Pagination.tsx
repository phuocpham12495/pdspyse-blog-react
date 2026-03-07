import './Pagination.css';

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages: (number | string)[] = [];
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== '...') {
            pages.push('...');
        }
    }

    return (
        <nav className="pagination" id="pagination" aria-label="Pagination">
            <button
                className="pagination__btn"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                aria-label="Previous page"
            >
                ← Prev
            </button>
            <div className="pagination__pages">
                {pages.map((p, i) =>
                    typeof p === 'number' ? (
                        <button
                            key={i}
                            className={`pagination__page ${p === page ? 'is-active' : ''}`}
                            onClick={() => onPageChange(p)}
                            aria-label={`Page ${p}`}
                            aria-current={p === page ? 'page' : undefined}
                        >
                            {p}
                        </button>
                    ) : (
                        <span key={i} className="pagination__ellipsis">{p}</span>
                    )
                )}
            </div>
            <button
                className="pagination__btn"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                aria-label="Next page"
            >
                Next →
            </button>
        </nav>
    );
}
