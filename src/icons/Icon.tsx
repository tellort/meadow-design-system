import { Children, cloneElement, isValidElement, type CSSProperties, type ReactElement, type ReactNode } from 'react';
import { ART, ICONS, NATURAL_TINT, type ArtName, type IconName, type Tint } from './data';
import { useMeadow } from '../components/MeadowProvider';
import { cx } from '../lib/cx';

const ROTATION: Tint[] = ['sand', 'sky', 'blush', 'lilac', 'aqua', 'mint'];
const fillable = (name: string) => !!ICONS[name as IconName]?.personal.includes('{{T}}');

/**
 * Contextual tints for a group of neighbouring icons (a list, a tab bar, a button row).
 * An icon with a natural color gets it; otherwise it takes the next of aqua, mint, sky, sand; neighbours never share a tint.
 * Icons without a fill (arrows, plus, menu) return null. Only used in the Personal vibe.
 */
export function iconTints(names: Array<IconName | string | undefined>): Array<Tint | null> {
  const out: Array<Tint | null> = [];
  let prev: Tint | null = null;
  let ptr = 0;
  const recent: Tint[] = [];
  for (const n of names) {
    if (!n || !fillable(n)) { out.push(null); continue; }
    const natural = NATURAL_TINT[n as IconName];
    let pick: Tint | null = null;
    if (natural && natural !== prev && !recent.includes(natural)) pick = natural;
    if (!pick) {
      for (let k = 0; k < ROTATION.length; k++) {
        const t = ROTATION[(ptr + k) % ROTATION.length];
        if (t !== prev && !recent.includes(t)) { pick = t; ptr = (ptr + k + 1) % ROTATION.length; break; }
      }
    }
    const final: Tint = pick ?? ROTATION[ptr % ROTATION.length];
    out.push(final); recent.push(final); if (recent.length > 3) recent.shift(); prev = final;
  }
  return out;
}

export interface IconProps {
  name: IconName;
  /** Pastel fill tint in the Personal vibe. Leave empty to use the icon's natural tint, or pass iconTints() results for groups. */
  tint?: Tint | null;
  size?: number;
  /** Accessible name. Omit for decorative icons next to a text label. */
  title?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * An outline icon from the Meadow icon pack (73 icons). Hand-drawn with an off-print pastel fill in Personal, plain geometric line in Clean.
 * Colors with currentColor, so set the text color around it.
 */
export function Icon({ name, tint, size = 24, title, className, style }: IconProps) {
  const { vibe } = useMeadow();
  const def = ICONS[name];
  if (!def) return null;
  const body = vibe === 'clean' ? def.clean : def.personal.split('{{T}}').join(tint ?? NATURAL_TINT[name] ?? 'aqua');
  return (
    <svg
      className={cx('m-icon', className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      aria-label={title}
      style={style}
      data-icon={name}
      data-auto-tint={vibe === 'personal' && tint === undefined && fillable(name) ? '' : undefined}
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}

export interface ArtProps { name: ArtName; size?: number; title?: string; className?: string }

/** A small spot illustration (sprout, moon, sun, drop) for empty states and onboarding. Off-print fill in Personal, plain lines in Clean. */
export function Art({ name, size = 64, title, className }: ArtProps) {
  const { vibe } = useMeadow();
  const def = ART[name];
  if (!def) return null;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      aria-label={title}
      dangerouslySetInnerHTML={{ __html: vibe === 'clean' ? def.clean : def.personal }}
    />
  );
}

/**
 * Wrap any run of neighbouring icon-bearing elements (IconButton, Button, Chip, Fab, Icon) so their icons get
 * different pastel tints instead of repeating. Use for button rows, chip rows and toolbars. Does nothing in Clean.
 * Pass-through for elements that already have a tint. Wrapper elements are rendered unchanged.
 */
export function TintGroup({ children }: { children: ReactNode }) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<{ icon?: string; name?: string; tint?: Tint | null }>[];
  const names = items.map((c) => c.props.icon ?? c.props.name);
  const tints = iconTints(names);
  let idx = 0;
  return <>{Children.map(children, (c) => {
    if (!isValidElement(c)) return c;
    const t = tints[idx++];
    const el = c as ReactElement<{ tint?: Tint | null }>;
    return el.props.tint !== undefined || t == null ? c : cloneElement(el, { tint: t });
  })}</>;
}

/**
 * Automatic contextual tints for icons that were not given a tint (buttons, chips, toolbars, anywhere outside List and TabBar).
 * Called by MeadowProvider. Neighbouring icons are grouped by their closest shared container and tinted with iconTints().
 * Returns a cleanup function.
 */
export function startAutoTint(): () => void {
  if (typeof document === 'undefined') return () => {};
  let raf = 0;
  const run = () => {
    raf = 0;
    const icons = Array.from(document.querySelectorAll<SVGElement>('svg[data-auto-tint]'));
    if (!icons.length) return;
    const groups = new Map<Element, SVGElement[]>();
    for (const ic of icons) {
      let el: Element | null = ic.parentElement;
      let group: Element = document.body;
      while (el && el !== document.body) {
        if (el.querySelectorAll('svg[data-auto-tint]').length >= 2) { group = el; break; }
        el = el.parentElement;
      }
      const list = groups.get(group) ?? [];
      list.push(ic); groups.set(group, list);
    }
    groups.forEach((list) => {
      const tints = iconTints(list.map((n) => n.getAttribute('data-icon') ?? undefined));
      list.forEach((n, k) => {
        const t = tints[k];
        if (!t) return;
        n.querySelectorAll('[fill^="url(#m-t-"]').forEach((p) => p.setAttribute('fill', `url(#m-t-${t})`));
      });
    });
  };
  const schedule = () => { if (!raf) raf = requestAnimationFrame(run); };
  const obs = new MutationObserver(schedule);
  obs.observe(document.body, { childList: true, subtree: true });
  schedule();
  return () => { obs.disconnect(); if (raf) cancelAnimationFrame(raf); };
}


