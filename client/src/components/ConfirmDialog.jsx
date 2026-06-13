import { useEffect } from 'react';

/**
 * Reusable Confirm Dialog Component
 * Usage:
 *   <ConfirmDialog
 *     open={showConfirm}
 *     title="Delete Item"
 *     message="Are you sure you want to delete this item? This action cannot be undone."
 *     confirmLabel="Delete"
 *     cancelLabel="Cancel"
 *     onConfirm={handleDelete}
 *     onCancel={() => setShowConfirm(false)}
 *     variant="danger" // "danger" | "warning" | "default"
 *   />
 */
export default function ConfirmDialog({
  open,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger',
}) {
  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const confirmColors = {
    danger: { bg: '#e74c3c', hover: '#c0392b' },
    warning: { bg: '#f39c12', hover: '#d68910' },
    default: { bg: '#1a1a1a', hover: '#D1AFA1' },
  };

  const colors = confirmColors[variant] || confirmColors.default;

  return (
    <div className="confirm-dialog-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <h3 className="confirm-dialog-title">{title}</h3>
        <p className="confirm-dialog-message">{message}</p>
        <div className="confirm-dialog-actions">
          <button
            className="confirm-dialog-btn confirm-dialog-btn-cancel"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className="confirm-dialog-btn confirm-dialog-btn-confirm"
            style={{ background: colors.bg }}
            onMouseEnter={(e) => e.currentTarget.style.background = colors.hover}
            onMouseLeave={(e) => e.currentTarget.style.background = colors.bg}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
