interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'primary';
}

export default function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'danger',
}: ConfirmDialogProps) {
    if (!open) return null;

    return (
        <div className="modal-overlay" onClick={onCancel} id="confirm-dialog">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--sp-3)', fontSize: 'var(--fs-xl)' }}>
                    {title}
                </h3>
                <p style={{ color: 'var(--clr-text-muted)', marginBottom: 'var(--sp-6)', lineHeight: 1.6 }}>
                    {message}
                </p>
                <div style={{ display: 'flex', gap: 'var(--sp-3)', justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary" onClick={onCancel}>
                        {cancelLabel}
                    </button>
                    <button className={`btn ${variant === 'danger' ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
