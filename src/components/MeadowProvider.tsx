import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ICON_DEFS } from '../icons/data';
import { feedback } from '../lib/feedback';
import { startAutoTint } from '../icons/Icon';

export type Vibe = 'personal' | 'clean';

interface MeadowContextValue {
  vibe: Vibe;
  setVibe: (v: Vibe) => void;
  sound: boolean;
  setSound: (on: boolean) => void;
  haptics: boolean;
  setHaptics: (on: boolean) => void;
}

const MeadowContext = createContext<MeadowContextValue>({
  vibe: 'personal', setVibe: () => {}, sound: false, setSound: () => {}, haptics: true, setHaptics: () => {},
});

export interface MeadowProviderProps {
  /** Which vibe the whole app uses. Personal is warm and hand-made; Clean is airy and quiet. Pick one per app. */
  vibe?: Vibe;
  /** Sound is off by default. Offer a Sounds setting and pass its value here. */
  sound?: boolean;
  haptics?: boolean;
  children: ReactNode;
}

/**
 * Wrap the whole app in MeadowProvider once. It sets data-theme on the html element, adds the glass backdrop,
 * mounts the shared icon filters and wires sound and haptic feedback to Meadow components.
 */
export function MeadowProvider({ vibe: initialVibe = 'personal', sound: initialSound = false, haptics: initialHaptics = true, children }: MeadowProviderProps) {
  const [vibe, setVibe] = useState<Vibe>(initialVibe);
  const [sound, setSound] = useState(initialSound);
  const [haptics, setHaptics] = useState(initialHaptics);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', vibe);
    document.body.classList.add('m-body');
  }, [vibe]);

  useEffect(() => (vibe === 'personal' ? startAutoTint() : undefined), [vibe]);

  useEffect(() => {
    feedback.configure({ vibe, sound, haptics });
    feedback.autowire();
  }, [vibe, sound, haptics]);

  const value = useMemo(() => ({ vibe, setVibe, sound, setSound, haptics, setHaptics }), [vibe, sound, haptics]);

  return (
    <MeadowContext.Provider value={value}>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: ICON_DEFS }} />
      {children}
    </MeadowContext.Provider>
  );
}

/** Current vibe and the settings for vibe, sound and haptics. */
export function useMeadow() {
  return useContext(MeadowContext);
}


/**
 * Renders its children in a different vibe than the rest of the app (for example a Clean summary inside a Personal app).
 * Sets data-theme on a wrapper so tokens switch, and makes Icon and other components follow that vibe. Does not touch html or body.
 */
export function VibeScope({ vibe, children, className }: { vibe: Vibe; children: ReactNode; className?: string }) {
  const parent = useContext(MeadowContext);
  const value = useMemo(() => ({ ...parent, vibe }), [parent, vibe]);
  return (
    <MeadowContext.Provider value={value}>
      <div data-theme={vibe} className={className} style={{ background: 'transparent', color: 'var(--ink)' }}>{children}</div>
    </MeadowContext.Provider>
  );
}
