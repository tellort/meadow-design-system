import { Children, cloneElement, isValidElement, useEffect, useLayoutEffect, useRef, useState, type ElementType, type HTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../lib/cx';
import { feedback } from '../lib/feedback';
import { Icon, iconTints } from '../icons/Icon';
import type { IconName, Tint } from '../icons/data';
import { Button, IconButton } from './Actions';

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Render as another element, for example "section" or "button". */
  as?: ElementType;
  /** Whole card is tappable: grows slightly on hover and shrinks on press. */
  interactive?: boolean;
  /** No padding, for cards that hold a List. */
  flush?: boolean;
  /** Scalloped top edge for hero cards. Personal vibe only; ignored in Clean. */
  wave?: boolean;
  /** Faint paper grain. Personal vibe only. */
  grain?: boolean;
}

/**
 * A frosted glass card: the basic container of every Meadow screen. One idea per card. Needs the Meadow backdrop behind it
 * (MeadowProvider adds it). Nest glass at most once.
 */
export function GlassCard({ as, interactive, flush, wave, grain, className, children, ...rest }: GlassCardProps) {
  const Tag = (as ?? 'div') as ElementType;
  const card = (
    <Tag className={cx('m-glass', interactive && 'm-glass--interactive', flush && 'm-glass--flush', wave && 'm-wave', grain && 'm-grain', className)} {...rest}>
      {children}
    </Tag>
  );
  return wave ? <div className="m-wave-wrap">{card}</div> : card;
}

export interface StatCardProps {
  label: string;
  /** The one big number of the screen, for example "7h 42m". Use one StatCard per screen as the hero. */
  value: string;
  /** Change in words, for example "24 min more than average". Never color it red or green. */
  delta?: string;
  /** Optional chart, usually a Sparkline. */
  children?: ReactNode;
  className?: string;
}

/** The hero of a dashboard: a label, one big number in the display font, a delta in words and an optional sparkline. */
export function StatCard({ label, value, delta, children, className }: StatCardProps) {
  return (
    <GlassCard wave grain className={className}>
      <div className="m-blob" style={{ display: 'inline-block', padding: '0 14px 8px 4px' }}>
        <p className="m-eyebrow">{label}</p>
        <p className="m-stat">{value}</p>
      </div>
      {delta && (
        <p className="m-delta" style={{ margin: '6px 0 0' }}>
          <Icon name="check" size={16} /> {delta}
        </p>
      )}
      {children}
    </GlassCard>
  );
}

export interface ListRowProps {
  icon?: IconName;
  /** Set by List so neighbouring icons never share a tint. */
  tint?: Tint | null;
  title: string;
  subtitle?: string;
  /** Trailing control: a Toggle, a Chip, a value or a chevron. */
  trailing?: ReactNode;
  /** Makes the whole row a button. */
  onClick?: () => void;
}

/** One line item: an icon chip, a title, a one-line subtitle and a trailing control. At least 56px tall. */
export function ListRow({ icon, tint, title, subtitle, trailing, onClick }: ListRowProps) {
  const Tag = (onClick ? 'button' : 'div') as ElementType;
  return (
    <Tag className={cx('m-row', onClick && 'm-row--tap')} {...(onClick ? { type: 'button', onClick } : {})}>
      {icon && <span className="m-iconchip"><Icon name={icon} tint={tint} size={22} /></span>}
      <div className="m-row__body">
        <p className="m-headline">{title}</p>
        {subtitle && <p className="m-sub">{subtitle}</p>}
      </div>
      {trailing}
    </Tag>
  );
}

export interface ListProps { children: ReactNode; /** Wrap in a flush glass card. Default true. */ card?: boolean; className?: string }

/** A group of ListRow items in one glass card with hairline dividers. Icons in the group get contextual tints automatically. */
export function List({ children, card = true, className }: ListProps) {
  const rows = Children.toArray(children).filter(isValidElement) as ReactElement<ListRowProps>[];
  const tints = iconTints(rows.map((r) => r.props.icon));
  return (
    <div className={cx(card && 'm-glass m-glass--flush', 'm-list', className)}>
      {rows.map((r, i) => cloneElement(r, { tint: r.props.tint ?? tints[i] }))}
    </div>
  );
}

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  /** Title in the display font. Also the accessible name. */
  title: string;
  /** sheet rises from the bottom (phones); dialog is a centered panel (tablet and desktop). */
  variant?: 'sheet' | 'dialog';
  children: ReactNode;
}

/**
 * Temporary content over the screen: details, pickers, confirmations. The screen behind softens and a light scrim covers it.
 * Closes on Escape or a tap outside. Two floating layers is the limit: never open a sheet from a sheet.
 */
export function Sheet({ open, onClose, title, variant = 'sheet', children }: SheetProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    feedback.event('sheet-open');
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('keydown', key); feedback.event('sheet-close'); prev?.focus?.(); };
  }, [open, onClose]);
  if (!open) return null;
  const dialog = variant === 'dialog';
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 40, display: 'flex', alignItems: dialog ? 'center' : 'flex-end', justifyContent: 'center' }}>
      <div className="m-scrim" style={{ position: 'absolute', inset: 0 }} onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cx('m-sheet m-sheet--enter', dialog && 'm-sheet--dialog')}
        style={{ position: 'relative', width: '100%', maxWidth: dialog ? 440 : 560, maxHeight: '90vh', overflow: 'auto', outline: 'none', margin: dialog ? 16 : 0 }}
      >
        {!dialog && <div className="m-sheet__grab" />}
        <p className="m-display" style={{ fontSize: 24, lineHeight: '30px', margin: '0 0 12px' }}>{title}</p>
        {children}
      </div>
    </div>,
    document.body,
  );
}

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  /** One sentence of consequence, for example "Wind down will stop running. You can't undo this." */
  message: string;
  /** Name the action by its verb, never "OK". */
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
}

/** A centered decision dialog with the calm choice on the left and the named action on the right. */
export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel, cancelLabel = 'Cancel', destructive }: ConfirmDialogProps) {
  return (
    <Sheet open={open} onClose={onClose} title={title} variant="dialog">
      <p className="m-sub" style={{ marginBottom: 20 }}>{message}</p>
      <div style={{ display: 'flex', gap: 12 }}>
        <Button variant="glass" style={{ flex: 1 }} onClick={onClose}>{cancelLabel}</Button>
        <Button variant={destructive ? 'danger' : 'primary'} style={{ flex: 1 }} data-feedback={destructive ? 'delete' : undefined} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button>
      </div>
    </Sheet>
  );
}

export interface MenuItem { label: string; icon?: IconName; onSelect: () => void; danger?: boolean }

/** A frosted popover list of two to six actions. Destructive items go last, after a divider. */
export function Menu({ items, onDone }: { items: MenuItem[]; onDone?: () => void }) {
  const normal = items.filter((i) => !i.danger);
  const danger = items.filter((i) => i.danger);
  const render = (i: MenuItem) => (
    <button key={i.label} type="button" role="menuitem" className={cx('m-menu__item', i.danger && 'm-menu__item--danger')} onClick={() => { i.onSelect(); onDone?.(); }}>
      {i.icon && <Icon name={i.icon} size={20} />}
      {i.label}
    </button>
  );
  return (
    <div className="m-menu" role="menu">
      {normal.map(render)}
      {danger.length > 0 && normal.length > 0 && <hr />}
      {danger.map(render)}
    </div>
  );
}

/**
 * An icon button that opens a Menu. The menu is drawn on top of the page (a portal), so it is never clipped by a card
 * and opens upward when there is no room below. Closes on outside click, Escape, scroll and resize.
 */
export function MenuButton({ items, label = 'More' }: { items: MenuItem[]; label?: string }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open || !wrapRef.current || !menuRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    const m = menuRef.current.getBoundingClientRect();
    const gap = 6, pad = 8;
    const below = window.innerHeight - r.bottom - pad;
    const top = below >= m.height ? r.bottom + gap : Math.max(pad, r.top - m.height - gap);
    const left = Math.min(Math.max(pad, r.right - m.width), window.innerWidth - m.width - pad);
    setPos({ top, left });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const click = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!wrapRef.current?.contains(t) && !menuRef.current?.contains(t)) close();
    };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('mousedown', click); document.addEventListener('keydown', key);
    window.addEventListener('resize', close); window.addEventListener('scroll', close, true);
    return () => {
      document.removeEventListener('mousedown', click); document.removeEventListener('keydown', key);
      window.removeEventListener('resize', close); window.removeEventListener('scroll', close, true);
    };
  }, [open]);

  const toggle = () => { setPos(null); setOpen((o) => !o); };

  return (
    <div ref={wrapRef} style={{ position: 'relative', display: 'inline-block' }}>
      <IconButton icon="more" label={label} plain aria-haspopup="menu" aria-expanded={open} onClick={toggle} />
      {open && typeof document !== 'undefined' && createPortal(
        <div ref={menuRef} style={{ position: 'fixed', top: pos?.top ?? 0, left: pos?.left ?? 0, zIndex: 80, visibility: pos ? 'visible' : 'hidden' }}>
          <Menu items={items} onDone={() => setOpen(false)} />
        </div>,
        document.body,
      )}
    </div>
  );
}
export interface AccordionItem { title: string; content: ReactNode }

/** Expandable sections built on native details elements. Do not hide critical information inside collapsed sections. */
export function Accordion({ items, defaultOpenIndex }: { items: AccordionItem[]; defaultOpenIndex?: number }) {
  return (
    <div>
      {items.map((it, i) => (
        <details key={it.title} className="m-acc" open={i === defaultOpenIndex}>
          <summary>{it.title}</summary>
          <div className="m-acc__body">{it.content}</div>
        </details>
      ))}
    </div>
  );
}

export interface DrawerProps { open: boolean; onClose: () => void; title: string; children: ReactNode }

/** A side panel that slides in from the right on tablet and desktop. On phones use Sheet instead. */
export function Drawer({ open, onClose, title, children }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 40, display: 'flex', justifyContent: 'flex-end' }}>
      <div className="m-scrim" style={{ position: 'absolute', inset: 0 }} onClick={onClose} />
      <div className="m-drawer" role="dialog" aria-modal="true" aria-label={title} style={{ position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="m-display" style={{ fontSize: 24, lineHeight: '30px', margin: 0 }}>{title}</p>
          <IconButton icon="x" label="Close" plain onClick={onClose} />
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}

