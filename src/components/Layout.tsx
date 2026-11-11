import type { ReactNode } from 'react';
import { cx } from '../lib/cx';

/**
 * The page root: the soft Meadow backdrop, the base font and comfortable page margins. Content max width 1120px.
 * On phones it is one column; from 600px two columns and from 1024px three columns when you use Screen.Grid.
 */
export function Screen({ children, className, bottomSpace = false }: { children: ReactNode; className?: string; /** Reserve space for a floating tab bar. */ bottomSpace?: boolean }) {
  return <div className={cx('m-app', className)} style={{ minHeight: '100vh', paddingBottom: bottomSpace ? 110 : 0 }}>{children}</div>;
}

/** Responsive card grid: one column on phones, two from 600px, three from 1024px. Use className="m-span" on a child to span all columns. */
Screen.Grid = function ScreenGrid({ children }: { children: ReactNode }) {
  return <main className="m-page">{children}</main>;
};
