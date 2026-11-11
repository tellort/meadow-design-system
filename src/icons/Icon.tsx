import type { CSSProperties } from 'react';
import { ART, ICONS, NATURAL_TINT, type ArtName, type IconName, type Tint } from './data';
import { useMeadow } from '../components/MeadowProvider';
import { cx } from '../lib/cx';

const ROTATION: Tint[] = ['aqua', 'mint', 'sky', 'sand'];
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
