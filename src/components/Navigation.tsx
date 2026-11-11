import { Fragment, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { Icon, iconTints } from '../icons/Icon';
import type { IconName } from '../icons/data';
import { Badge } from './Feedback';
import { IconButton } from './Actions';

export interface TabBarItem<T extends string> { id: T; icon: IconName; label: string; badge?: number }
export interface TabBarProps<T extends string> {
  items: TabBarItem<T>[];
  value: T;
  onChange: (id: T) => void;
  /** Sidebar layout for tablet and desktop. Default is the floating glass pill for phones. */
  side?: boolean;
  /** Pin to the bottom of the screen (phone layout). Default true unless side. */
  floating?: boolean;
}

/**
 * Primary navigation, three to five destinations. A floating glass pill near the bottom on phones; a sidebar on tablet and desktop.
 * The selected item is a white pill with an action-colored label. Icons get contextual tints.
 */
export function TabBar<T extends string>({ items, value, onChange, side, floating = true }: TabBarProps<T>) {
  const tints = iconTints(items.map((i) => i.icon));
  const pinned: CSSProperties | undefined = !side && floating
    ? { position: 'fixed', left: '50%', transform: 'translateX(-50%)', bottom: 12, width: 'min(436px, calc(100% - 24px))', zIndex: 20 }
    : undefined;
  return (
    <nav className={cx('m-tabbar', side && 'm-tabbar--side')} style={pinned} aria-label="Main">
      {items.map((it, i) => (
        <button key={it.id} type="button" className="m-tab" aria-current={it.id === value ? 'page' : undefined} onClick={() => onChange(it.id)}>
          <span style={{ position: 'relative', display: 'inline-flex' }}>
            <Icon name={it.icon} tint={tints[i]} size={22} />
            {it.badge ? <span style={{ position: 'absolute', top: -8, right: -12 }}><Badge count={it.badge} /></span> : null}
          </span>
          <span>{it.label}</span>
        </button>
      ))}
    </nav>
  );
}

export interface TopBarProps { title: string; left?: ReactNode; right?: ReactNode; /** Large display-font title under the bar. */ large?: string }

/** The glass bar at the top of a screen: back button, centered title and up to two icon buttons. Primary actions do not belong here. */
export function TopBar({ title, left, right, large }: TopBarProps) {
  return (
    <div>
      <header className="m-topbar">
        {left ?? <span style={{ width: 44 }} />}
        <h2 className="m-topbar__title">{title}</h2>
        {right ?? <span style={{ width: 44 }} />}
      </header>
      {large && <h1 className="m-largetitle">{large}</h1>}
    </div>
  );
}

/** Back button for TopBar. */
export function BackButton({ onClick }: { onClick: () => void }) {
  return <IconButton icon="chevron-left" label="Back" plain onClick={onClick} />;
}

export interface Crumb { label: string; href?: string }

/** A path for tablet and desktop screens three or more levels deep. Not for phones; use the back button there. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="m-crumbs">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return <li key={c.label} aria-current={last ? 'page' : undefined}>{last || !c.href ? c.label : <a className="m-link" href={c.href}>{c.label}</a>}</li>;
        })}
      </ol>
    </nav>
  );
}

export interface PaginationProps { page: number; pages: number; onChange: (page: number) => void }

/** Round page buttons for desktop lists. Collapse the middle beyond seven numbers; on phones prefer infinite scroll. */
export function Pagination({ page, pages, onChange }: PaginationProps) {
  const nums = Array.from({ length: pages }, (_, i) => i + 1);
  return (
    <nav className="m-pages" aria-label="Pages">
      <button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => onChange(page - 1)}><Icon name="chevron-left" size={18} /></button>
      {nums.map((n) => <button key={n} type="button" aria-current={n === page ? 'page' : undefined} onClick={() => onChange(n)}>{n}</button>)}
      <button type="button" aria-label="Next page" disabled={page >= pages} onClick={() => onChange(page + 1)}><Icon name="chevron-right" size={18} /></button>
    </nav>
  );
}

/** Rounded progress segments for onboarding and checkout flows. Always includes "Step 2 of 4" as text. */
export function StepIndicator({ step, steps }: { step: number; steps: number }) {
  return (
    <div>
      <p className="m-eyebrow" style={{ marginBottom: 8 }}>Step {step} of {steps}</p>
      <ol className="m-steps" aria-label={`Step ${step} of ${steps}`}>
        {Array.from({ length: steps }, (_, i) => <Fragment key={i}><li {...(i < step ? { 'data-done': '' } : {})} /></Fragment>)}
      </ol>
    </div>
  );
}
