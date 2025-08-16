export type AnalyticsEventName =
  | 'page_view'
  | 'timer_start'
  | 'timer_pause'
  | 'timer_reset'
  | 'timer_skip'
  | 'phase_change';

export function trackEvent(eventName: AnalyticsEventName, payload?: Record<string, unknown>): void {
  // Stub: replace with real analytics later
  try {
    // eslint-disable-next-line no-console
    console.log('[analytics]', eventName, payload ?? {});
  } catch {
    // ignore
  }
}


