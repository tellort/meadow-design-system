import { createContext, useCallback, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../lib/cx';
import { feedback } from '../lib/feedback';
import { Icon } from '../icons/Icon';
import { Art } from '../icons/Icon';
import type { ArtName, IconName } from '../icons/data';
import { Button } from './Actions';

export type StatusKind = 'neutral' | 'success' | 'warning' | 'danger';
const KIND_ICON: Record<StatusKind, IconName> = { neutral: 'info', success: 'check-circle', warning: 'alert', danger: 'alert' };

export interface ChipProps { kind?: StatusKind; icon?: IconName; children: ReactNode; className?: string }

/** A small pill label for status or category. Status chips always carry an icon and a word, never color alone. Chips are not tappable. */
export function Chip({ kind = 'neutral', icon, children, className }: ChipProps) {
  return (
    <span className={cx('m-chip', kind !== 'neutral' && `m-chip--${kind}`, className)}>
      {icon && <Icon name={icon} size={14} />}
      {children}
    </span>
  );
}

/** A gradient count pill for unread items. Cap at 99+. Give the parent an accessible name that includes the count. */
export function Badge({ count }: { count: number }) {
  return <span className="m-badge">{count > 99 ? '99+' : count}</span>;
}

export interface BannerProps { kind?: StatusKind; children: ReactNode; className?: string }

/** An inline message that stays until fixed or dismissed: one or two sentences, what happened then what to do. One banner at a time. */
export function Banner({ kind = 'neutral', children, className }: BannerProps) {
  return (
    <div className={cx('m-banner', kind !== 'neutral' && `m-banner--${kind}`, className)} role={kind === 'danger' ? 'alert' : 'status'}>
      <Icon name={KIND_ICON[kind]} size={20} />
      <span>{children}</span>
    </div>
  );
}

export interface ProgressProps { value: number; /** Accessible name, for example "Upload progress". */ label: string; className?: string }

/** A pill progress bar with the action gradient. Always show the number or a label next to it. */
export function Progress({ value, label, className }: ProgressProps) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cx('m-progress', className)} role="progressbar" aria-label={label} aria-valuenow={v} aria-valuemin={0} aria-valuemax={100} style={{ '--v': `${v}%` } as CSSProperties}>
      <span />
    </div>
  );
}

/** A glass-colored placeholder shaped like the content that will appear. Prefer skeletons to full-screen spinners. */
export function Skeleton({ width = '100%', height = 16, className }: { width?: number | string; height?: number | string; className?: string }) {
  return <div className={cx('m-skel', className)} style={{ width, height }} aria-hidden="true" />;
}

/** A small spinner for buttons and actions of unknown length. */
export function Spinner({ label = 'Loading' }: { label?: string }) {
  return <span className="m-spinner" role="status" aria-label={label} />;
}

export interface EmptyStateProps {
  /** An outline icon or a spot illustration. */
  icon?: IconName;
  art?: ArtName;
  /** Names the space ("Nothing planned tonight"), never "No data". */
  title: string;
  description?: string;
  /** One verb-first action. */
  actionLabel?: string;
  onAction?: () => void;
}

/** An invitation shown when a list or screen has no content: round badge, headline, one sentence, one verb-first button. */
export function EmptyState({ icon, art, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="m-empty">
      <div className="m-empty__art">{art ? <Art name={art} size={36} /> : icon ? <Icon name={icon} size={32} /> : null}</div>
      <p className="m-title">{title}</p>
      {description && <p className="m-sub">{description}</p>}
      {actionLabel && <Button onClick={onAction}>{actionLabel}</Button>}
    </div>
  );
}

export interface TooltipProps { text: string; children: ReactNode }

/** A short dark hint shown above an element on hover or focus. Pointer devices only; never put essential information in a tooltip. */
export function Tooltip({ text, children }: TooltipProps) {
  return (
    <span className="m-tip">
      {children}
      <span className="m-tip__bubble" role="tooltip">{text}</span>
    </span>
  );
}

interface ToastOptions { actionLabel?: string; onAction?: () => void; kind?: 'success' | 'error' | 'notify' }
interface ToastState extends ToastOptions { id: number; message: string }
const ToastContext = createContext<(message: string, options?: ToastOptions) => void>(() => {});

/** Wrap the app once to enable useToast(). Renders one toast at a time above the tab bar. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const show = useCallback((message: string, options?: ToastOptions) => {
    window.clearTimeout(timer.current);
    setToast({ id: Date.now(), message, ...options });
    feedback.event(options?.kind === 'error' ? 'error' : options?.kind === 'success' ? 'success' : 'toast');
    timer.current = window.setTimeout(() => setToast(null), 4000);
  }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && createPortal(
        <div style={{ position: 'fixed', left: 0, right: 0, bottom: 96, display: 'flex', justifyContent: 'center', zIndex: 50, pointerEvents: 'none', padding: '0 16px' }}>
          <div key={toast.id} className="m-toast" role="status" style={{ pointerEvents: 'auto' }}>
            <Icon name="check" size={20} />
            <span>{toast.message}</span>
            {toast.actionLabel && (
              <button type="button" className="m-link" style={{ background: 'none', border: 0, cursor: 'pointer', font: 'inherit' }} onClick={() => { toast.onAction?.(); setToast(null); }}>
                {toast.actionLabel}
              </button>
            )}
          </div>
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

/** Shows a short confirmation in past tense ("Routine saved"), optionally with one Undo-style action. */
export function useToast() {
  return useContext(ToastContext);
}
