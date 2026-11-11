import type { ReactNode } from 'react';
import { cx } from '../lib/cx';

/** A circle for a person or account: a photo, or initials on the pale gradient. Three sizes. */
export function Avatar({ name, src, size = 'md' }: { name: string; src?: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join('');
  return (
    <span className={cx('m-avatar', size === 'sm' && 'm-avatar--sm', size === 'lg' && 'm-avatar--lg')} role="img" aria-label={name}>
      {src ? <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
    </span>
  );
}

/** Overlapping avatars. Shows at most three and a "+N" count. */
export function AvatarGroup({ names }: { names: string[] }) {
  const shown = names.slice(0, 3);
  const extra = names.length - shown.length;
  return (
    <span className="m-avatars">
      {shown.map((n) => <Avatar key={n} name={n} />)}
      {extra > 0 && <span className="m-avatar" aria-label={`${extra} more`}>+{extra}</span>}
    </span>
  );
}

export interface TableColumn<Row> { key: keyof Row & string; header: string; numeric?: boolean }

/** A glass table for comparing items on tablet and desktop. Keep to five columns; on phones turn rows into ListRow items. */
export function Table<Row extends Record<string, ReactNode>>({ columns, rows }: { columns: TableColumn<Row>[]; rows: Row[] }) {
  return (
    <div className="m-glass m-glass--flush">
      <table className="m-table">
        <thead><tr>{columns.map((c) => <th key={c.key} className={c.numeric ? 'num' : undefined} scope="col">{c.header}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => <tr key={i}>{columns.map((c) => <td key={c.key} className={c.numeric ? 'num' : undefined}>{r[c.key]}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}

/** A hairline, or a hairline with a centered word ("or"). Prefer spacing; use a rule only where grouping is unclear. */
export function Divider({ label }: { label?: string }) {
  return label ? <div className="m-divider m-divider--label" role="separator" style={{ margin: 0 }}>{label}</div> : <hr className="m-divider" />;
}

export interface ChatBubbleProps { from: 'me' | 'them'; time?: string; children: ReactNode }

/** A message bubble: frosted glass on the left for the other person, action gradient on the right for you. */
export function ChatBubble({ from, time, children }: ChatBubbleProps) {
  return (
    <div className={cx('m-bubble', from === 'me' ? 'm-bubble--me' : 'm-bubble--them')}>
      {children}
      {time && <time>{time}</time>}
    </div>
  );
}

/** Three softly bouncing dots shown while the other person types. */
export function TypingIndicator() {
  return <div className="m-typing" role="status" aria-label="Typing"><i /><i /><i /></div>;
}

/** Wraps ChatBubble items. Use aria-live so new messages are announced. */
export function Chat({ children }: { children: ReactNode }) {
  return <div className="m-chat" aria-live="polite">{children}</div>;
}

export interface TimelineItem { title: string; time?: string }

/** Events in order joined by a soft line with round dots. Newest first for history, chronological for plans. */
export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="m-timeline">
      {items.map((it) => (
        <li key={it.title + (it.time ?? '')}>
          <div className="m-timeline__body">
            <p className="m-headline">{it.title}</p>
            {it.time && <p className="m-sub">{it.time}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

function smoothPath(points: Array<[number, number]>): string {
  if (points.length < 2) return '';
  let d = `M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i], p1 = points[i], p2 = points[i + 1], p3 = points[i + 2] ?? p2;
    const c1: [number, number] = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: [number, number] = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/** A soft, slightly irregular line for trends. Use inside a StatCard instead of a rigid chart line. Add a text description. */
export function Sparkline({ values, label }: { values: number[]; label?: string }) {
  const w = 200, h = 40, min = Math.min(...values), max = Math.max(...values), span = max - min || 1;
  const pts: Array<[number, number]> = values.map((v, i) => [3 + (i / Math.max(1, values.length - 1)) * (w - 6), h - 6 - ((v - min) / span) * (h - 12) + (i % 2 ? 1.2 : -1.2)]);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} style={{ marginTop: 8 }}>
      <path d={smoothPath(pts)} fill="none" stroke="var(--lagoon-300)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export interface BarDatum { label: string; value: number; highlight?: boolean }

/** Fully rounded bars with direct labels. Highlight the one value that matters; keep to one series and describe the takeaway in `description`. */
export function BarChart({ data, description }: { data: BarDatum[]; description: string }) {
  const w = 420, h = 170, base = 150, top = 30, max = Math.max(...data.map((d) => d.value)) || 1;
  const bw = 36, gap = (w - data.length * bw) / (data.length + 1);
  return (
    <svg className="m-chart" viewBox={`0 0 ${w} ${h}`} width="100%" role="img" aria-label={description}>
      {[top, (top + base) / 2, base].map((y) => <line key={y} className="m-chart__grid" x1={0} x2={w} y1={y} y2={y} />)}
      {data.map((d, i) => {
        const x = gap + i * (bw + gap), bh = ((d.value / max) * (base - top - 6)) + 6;
        return (
          <g key={d.label}>
            <rect className={cx('m-chart__bar', d.highlight && 'm-chart__bar--hl')} x={x} y={base - bh} width={bw} height={bh} rx={10} />
            {d.highlight && <text x={x + bw / 2} y={base - bh - 8} textAnchor="middle">{d.value}</text>}
            <text x={x + bw / 2} y={h - 2} textAnchor="middle">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}
