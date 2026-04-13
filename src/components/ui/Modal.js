import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Modal — Generic animated modal
 * Props:
 *   isOpen    — boolean
 *   onClose   — function
 *   title     — string
 *   children  — React children
 *   size      — 'sm' | 'md' | 'lg' | 'xl'
 *   footer    — React element (optional)
 */
const SIZE_MAP = {
  sm: '420px',
  md: '560px',
  lg: '720px',
  xl: '900px',
};

const Modal = ({ isOpen, onClose, title, children, size = 'md', footer }) => {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Lock scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: SIZE_MAP[size] || SIZE_MAP.md,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          animation: 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
          background: 'rgba(0,63,127,0.08)',
        }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-icon"
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
        }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            flexShrink: 0,
            background: 'rgba(0,0,0,0.1)',
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
