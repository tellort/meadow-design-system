import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react';
import { cx } from '../lib/cx';
import { Icon } from '../icons/Icon';
import type { IconName, Tint } from '../icons/data';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary: the single filled gradient action of a view. glass: secondary. ghost: low emphasis text. danger: destructive. */
  variant?: 'primary' | 'glass' | 'ghost' | 'danger';
  size?: 'md' | 'sm';
  /** Full width. Use on phones for the main action. */
  block?: boolean;
  /** Shows progress by setting aria-busy; change the label too ("Saving"). */
  loading?: boolean;
  icon?: IconName;
  /** Pastel icon tint (Personal vibe). Set automatically inside <TintGroup>. */
  tint?: Tint | null;
}

/**
 * Pill-shaped action button. Use exactly one primary button per view; label is a verb, one to three words, sentence case.
 * Presses shrink slightly. Minimum height 48px (40px for size sm).
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', block, loading, icon, tint, className, children, type = 'button', ...rest }, ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx('m-btn', `m-btn--${variant}`, size === 'sm' && 'm-btn--sm', block && 'm-btn--block', className)}
      aria-busy={loading || undefined}
      {...rest}
    >
      {icon && <Icon name={icon} tint={tint} size={18} />}
      {children}
    </button>
  );
});

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  icon: IconName;
  /** Required: icon buttons have no visible text. */
  label: string;
  /** Transparent background for toolbars. */
  plain?: boolean;
  /** Pastel icon tint (Personal vibe). Set automatically inside <TintGroup>. */
  tint?: Tint | null;
}

/** A round 44px button holding one outline icon. Always give it a label. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, plain, tint, className, type = 'button', ...rest }, ref,
) {
  return (
    <button ref={ref} type={type} aria-label={label} className={cx('m-iconbtn', plain && 'm-iconbtn--plain', className)} {...rest}>
      <Icon name={icon} tint={tint} size={22} />
    </button>
  );
});

export interface FabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  /** Visible text makes it an extended floating button. Without it, pass aria-label. */
  label?: string;
}

/** Floating action button for the one most important create action on a screen. One per screen; never together with a primary button. */
export const Fab = forwardRef<HTMLButtonElement, FabProps>(function Fab({ icon, label, className, type = 'button', ...rest }, ref) {
  return (
    <button ref={ref} type={type} className={cx('m-fab', className)} aria-label={label ? undefined : rest['aria-label']} {...rest}>
      <Icon name={icon} size={22} />
      {label}
    </button>
  );
});

/** Inline text link with a hand-drawn sand underline. Link text names the destination, never "click here". */
export function Link({ className, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={cx('m-link', className)} {...rest} />;
}

