import './meadow-feedback.js';

export type FeedbackEvent =
  | 'tap' | 'toggle-on' | 'toggle-off' | 'select' | 'success' | 'warning' | 'error'
  | 'sheet-open' | 'sheet-close' | 'toast' | 'delete' | 'notify' | 'tick' | 'refresh';

interface MeadowFeedbackApi {
  configure(o: { vibe?: string; sound?: boolean; haptics?: boolean; volume?: number; soundSet?: string }): MeadowFeedbackApi;
  autowire(): MeadowFeedbackApi;
  event(name: string): void;
}

const api = (): MeadowFeedbackApi | undefined => (window as unknown as { MeadowFeedback?: MeadowFeedbackApi }).MeadowFeedback;

/**
 * Sound and haptic feedback. Sound is off by default and only starts after a user gesture.
 * MeadowProvider configures and autowires it; call feedback.event('success') for outcomes components cannot see.
 */
export const feedback = {
  configure(o: { vibe?: string; sound?: boolean; haptics?: boolean; volume?: number }) { api()?.configure(o); },
  autowire() { api()?.autowire(); },
  event(name: FeedbackEvent) { api()?.event(name); },
};
