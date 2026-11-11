import { useId, useState, type CSSProperties, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cx } from '../lib/cx';
import { Icon } from '../icons/Icon';

export interface ToggleProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Accessible name, for example "Wind down". */
  label: string;
  disabled?: boolean;
  className?: string;
}

/** A 52x32 pill switch for settings that apply immediately. Off is a quiet track, on fades to the action gradient; the knob springs. */
export function Toggle({ checked, defaultChecked = false, onCheckedChange, label, disabled, className }: ToggleProps) {
  const [inner, setInner] = useState(defaultChecked);
  const on = checked ?? inner;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      className={cx('m-toggle', className)}
      onClick={() => { const next = !on; if (checked === undefined) setInner(next); onCheckedChange?.(next); }}
    />
  );
}

export interface CheckProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> { label: ReactNode }

/** A 24px rounded checkbox for independent yes/no choices in forms. The whole row is the tap target. */
export function Checkbox({ label, className, ...rest }: CheckProps) {
  return (
    <label className={cx('m-check', className)}>
      <input type="checkbox" {...rest} />
      <span className="m-check__box" />
      {label}
    </label>
  );
}

/** A round radio for choosing exactly one of two to five options. Group radios with the same name under a visible heading. */
export function Radio({ label, className, ...rest }: CheckProps) {
  return (
    <label className={cx('m-radio', className)}>
      <input type="radio" {...rest} />
      <span className="m-radio__dot" />
      {label}
    </label>
  );
}

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Accessible name. Also show the current value as text next to the slider. */
  label: string;
  className?: string;
}

/** Chooses a value in a range. The track fills with the action color and the knob grows while dragged. Not for exact numbers. */
export function Slider({ value, onChange, min = 0, max = 100, step = 1, label, className }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <input
      type="range"
      className={cx('m-slider', className)}
      aria-label={label}
      min={min}
      max={max}
      step={step}
      value={value}
      style={{ '--p': `${pct}%` } as CSSProperties}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}

interface FieldBase { label: string; hint?: string; error?: string }

export type TextFieldProps = FieldBase & InputHTMLAttributes<HTMLInputElement>;

/** A 48px glass text field with a label above, a hint below and an error state with an icon and a fix-it sentence. Never use the placeholder as the label. */
export function TextField({ label, hint, error, className, id, ...rest }: TextFieldProps) {
  const auto = useId();
  const fid = id ?? auto;
  const msgId = `${fid}-msg`;
  return (
    <div className={cx('m-field', error && 'm-field--error', className)}>
      <label className="m-label" htmlFor={fid}>{label}</label>
      <input id={fid} className="m-input" aria-invalid={error ? true : undefined} aria-describedby={error || hint ? msgId : undefined} {...rest} />
      {(error || hint) && (
        <span id={msgId} className="m-hint" style={error ? { display: 'flex', gap: 6, alignItems: 'center' } : undefined}>
          {error && <Icon name="alert" size={16} />}
          {error ?? hint}
        </span>
      )}
    </div>
  );
}

export type TextAreaProps = FieldBase & TextareaHTMLAttributes<HTMLTextAreaElement>;

/** A multi-line version of TextField for notes and descriptions. */
export function TextArea({ label, hint, error, className, id, ...rest }: TextAreaProps) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <div className={cx('m-field', error && 'm-field--error', className)}>
      <label className="m-label" htmlFor={fid}>{label}</label>
      <textarea id={fid} className="m-input m-textarea" aria-invalid={error ? true : undefined} {...rest} />
      {(error || hint) && <span className="m-hint">{error ?? hint}</span>}
    </div>
  );
}

export interface SelectOption { value: string; label: string }
export type SelectProps = FieldBase & { options: SelectOption[] } & SelectHTMLAttributes<HTMLSelectElement>;

/** A native select with a chevron. Use it for three or more options; for two to four short views use Segmented. */
export function Select({ label, hint, error, options, className, id, ...rest }: SelectProps) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <div className={cx('m-field', error && 'm-field--error', className)}>
      <label className="m-label" htmlFor={fid}>{label}</label>
      <select id={fid} className="m-input m-select" {...rest}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {(error || hint) && <span className="m-hint">{error ?? hint}</span>}
    </div>
  );
}

/** A pill-shaped search field with a leading icon. Give it an aria-label. */
export function SearchField({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cx('m-search', className)}>
      <Icon name="search" size={20} />
      <input className="m-input" type="search" {...rest} />
    </label>
  );
}

export interface SegmentedOption<T extends string> { value: T; label: string }
export interface SegmentedProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name of the group, for example "Range". */
  label: string;
  className?: string;
}

/**
 * Switches between two to four short views of the same content (Day, Week, Month). The selection is one white pill with exactly the
 * shape of a segment that glides between segments.
 */
export function Segmented<T extends string>({ options, value, onChange, label, className }: SegmentedProps<T>) {
  const i = Math.max(0, options.findIndex((o) => o.value === value));
  return (
    <div role="group" aria-label={label} className={cx('m-seg', className)} style={{ '--n': options.length, '--i': i } as CSSProperties}>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}

export interface TabsProps<T extends string> extends SegmentedProps<T> {}

/** Top tabs that switch sibling views of one screen, with a gliding gradient underline. Two to five short labels. */
export function Tabs<T extends string>({ options, value, onChange, label, className }: TabsProps<T>) {
  const i = Math.max(0, options.findIndex((o) => o.value === value));
  return (
    <div role="tablist" aria-label={label} className={cx('m-tabs', className)} style={{ '--n': options.length, '--i': i } as CSSProperties}>
      {options.map((o) => (
        <button key={o.value} type="button" role="tab" aria-selected={o.value === value} onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}

export interface FilterChipProps { pressed: boolean; onPressedChange: (pressed: boolean) => void; children: ReactNode; className?: string }

/** A pill chip that switches a filter on and off. Selected chips fill with the action color. */
export function FilterChip({ pressed, onPressedChange, children, className }: FilterChipProps) {
  return (
    <button type="button" className={cx('m-chip m-chip--select', className)} aria-pressed={pressed} onClick={() => onPressedChange(!pressed)}>
      {children}
    </button>
  );
}

export interface StepperProps { value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; label: string }

/** Minus, value, plus for whole numbers in a narrow range (guests, minutes). */
export function Stepper({ value, onChange, min = 0, max = 99, step = 1, label }: StepperProps) {
  return (
    <div className="m-stepper" role="group" aria-label={label}>
      <button type="button" className="m-iconbtn m-iconbtn--plain" aria-label={`Decrease ${label}`} disabled={value <= min} onClick={() => onChange(Math.max(min, value - step))}><Icon name="minus" size={20} /></button>
      <output aria-live="polite">{value}</output>
      <button type="button" className="m-iconbtn m-iconbtn--plain" aria-label={`Increase ${label}`} disabled={value >= max} onClick={() => onChange(Math.min(max, value + step))}><Icon name="plus" size={20} /></button>
    </div>
  );
}
