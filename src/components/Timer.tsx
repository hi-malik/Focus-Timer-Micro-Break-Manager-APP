'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Modal from '@/components/Modal';
import { trackEvent } from '@/lib/analytics';

type SessionPhase = 'focus' | 'break';

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

function formatSecondsAsClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');
  return `${paddedMinutes}:${paddedSeconds}`;
}

export default function Timer({
  isPremium = false,
  onUpgradeClick,
}: {
  isPremium?: boolean;
  onUpgradeClick?: () => void;
}): React.ReactElement {
  const [focusDurationMinutes, setFocusDurationMinutes] = useState<number>(25);
  const [breakDurationMinutes, setBreakDurationMinutes] = useState<number>(5);
  const [phase, setPhase] = useState<SessionPhase>('focus');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(focusDurationMinutes * 60);
  const [enableSound, setEnableSound] = useState<boolean>(true);
  const [enableNotifications, setEnableNotifications] = useState<boolean>(false);
  const [autoStartNextPhase, setAutoStartNextPhase] = useState<boolean>(true);
  const [stats, setStats] = useState<{ day: string; focusCompleted: number; breakCompleted: number }>({
    day: new Date().toDateString(),
    focusCompleted: 0,
    breakCompleted: 0,
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);

  const tickIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevFocusDurationRef = useRef<number>(focusDurationMinutes);
  const prevBreakDurationRef = useRef<number>(breakDurationMinutes);
  const prevPhaseRef = useRef<SessionPhase>(phase);
  const audioContextRef = useRef<AudioContext | null>(null);

  const currentTargetSeconds = useMemo(() => {
    return (phase === 'focus' ? focusDurationMinutes : breakDurationMinutes) * 60;
  }, [phase, focusDurationMinutes, breakDurationMinutes]);

  // Only reset timer when durations or phase actually change (not when pausing)
  useEffect(() => {
    const focusChanged = prevFocusDurationRef.current !== focusDurationMinutes;
    const breakChanged = prevBreakDurationRef.current !== breakDurationMinutes;
    const phaseChanged = prevPhaseRef.current !== phase;
    
    if ((focusChanged || breakChanged || phaseChanged) && !isRunning) {
      setSecondsRemaining(currentTargetSeconds);
    }
    
    // Update refs to current values
    prevFocusDurationRef.current = focusDurationMinutes;
    prevBreakDurationRef.current = breakDurationMinutes;
    prevPhaseRef.current = phase;
  }, [focusDurationMinutes, breakDurationMinutes, phase, currentTargetSeconds, isRunning]);

  useEffect(() => {
    if (!isRunning) {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
      return;
    }

    tickIntervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Auto-switch phase when timer hits zero
          const nextPhase: SessionPhase = phase === 'focus' ? 'break' : 'focus';
          setPhase(nextPhase);
          // Update stats on completion
          setStats((prev) => {
            const today = new Date().toDateString();
            const base = prev.day === today ? prev : { day: today, focusCompleted: 0, breakCompleted: 0 };
            return {
              day: base.day,
              focusCompleted: base.focusCompleted + (phase === 'focus' ? 1 : 0),
              breakCompleted: base.breakCompleted + (phase === 'break' ? 1 : 0),
            };
          });
          trackEvent('phase_change', { to: nextPhase });
          // Sound
          if (enableSound) {
            try {
              if (!audioContextRef.current) {
                const Ctor = window.AudioContext || window.webkitAudioContext;
                if (Ctor) {
                  audioContextRef.current = new Ctor();
                }
              }
              const ctx = audioContextRef.current;
              if (ctx) {
                if (ctx.state === 'suspended') {
                  void ctx.resume();
                }
                const duration = 0.15;
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(880, ctx.currentTime);
                gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
                gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);
                oscillator.start();
                oscillator.stop(ctx.currentTime + duration);
              }
            } catch {
              // ignore audio errors
            }
          }
          // Notifications
          try {
            if (enableNotifications && typeof window !== 'undefined' && 'Notification' in window) {
              if (Notification.permission === 'granted') {
                new Notification(nextPhase === 'focus' ? 'Focus session started' : 'Break started', {
                  body: nextPhase === 'focus' ? 'Time to focus.' : 'Time for a quick break.',
                });
              }
            }
          } catch {
            // ignore
          }
          // Pause if auto-start is disabled
          if (!autoStartNextPhase) {
            setIsRunning(false);
          }
          return (nextPhase === 'focus' ? focusDurationMinutes : breakDurationMinutes) * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
    };
    // phase and durations included so the next interval picks up fresh values
  }, [isRunning, phase, focusDurationMinutes, breakDurationMinutes, enableSound, enableNotifications, autoStartNextPhase]);

  const handleStartPause = React.useCallback((): void => {
    setIsRunning((prev) => {
      const next = !prev;
      trackEvent(next ? 'timer_start' : 'timer_pause');
      return next;
    });
  }, []);

  const handleReset = React.useCallback((): void => {
    setIsRunning(false);
    setSecondsRemaining(currentTargetSeconds);
    trackEvent('timer_reset');
  }, [currentTargetSeconds]);

  const handleSkip = React.useCallback((): void => {
    const nextPhase: SessionPhase = phase === 'focus' ? 'break' : 'focus';
    setPhase(nextPhase);
    setSecondsRemaining((nextPhase === 'focus' ? focusDurationMinutes : breakDurationMinutes) * 60);
    trackEvent('timer_skip', { to: nextPhase });
  }, [phase, focusDurationMinutes, breakDurationMinutes]);

  const phaseLabel = phase === 'focus' ? 'Focus' : 'Break';

  // Persist and restore state from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('ft_state_v1');
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        focusDurationMinutes: number;
        breakDurationMinutes: number;
        phase: SessionPhase;
        secondsRemaining: number;
        enableSound?: boolean;
        enableNotifications?: boolean;
        autoStartNextPhase?: boolean;
        stats?: { day: string; focusCompleted: number; breakCompleted: number };
      };
      setFocusDurationMinutes(parsed.focusDurationMinutes);
      setBreakDurationMinutes(parsed.breakDurationMinutes);
      setPhase(parsed.phase);
      setSecondsRemaining(parsed.secondsRemaining);
      if (typeof parsed.enableSound === 'boolean') setEnableSound(parsed.enableSound);
      if (typeof parsed.enableNotifications === 'boolean') setEnableNotifications(parsed.enableNotifications);
      if (typeof parsed.autoStartNextPhase === 'boolean') setAutoStartNextPhase(parsed.autoStartNextPhase);
      if (parsed.stats) setStats(parsed.stats);
    } catch {
      // ignore
    }
    // initialize AudioContext on first user interaction (start/pause/skip/reset)
    const init = () => {
      try {
        if (!audioContextRef.current) {
          const Ctor = window.AudioContext || window.webkitAudioContext;
          if (Ctor) {
            audioContextRef.current = new Ctor();
          }
        }
      } catch {
        // ignore
      }
      document.removeEventListener('click', init, { capture: true });
    };
    document.addEventListener('click', init, { capture: true });
    return () => document.removeEventListener('click', init, { capture: true });
  }, []);

  useEffect(() => {
    try {
      const today = new Date().toDateString();
      const normalizedStats = stats.day === today ? stats : { day: today, focusCompleted: 0, breakCompleted: 0 };
      const payload = JSON.stringify({
        focusDurationMinutes,
        breakDurationMinutes,
        phase,
        secondsRemaining,
        enableSound,
        enableNotifications,
        autoStartNextPhase,
        stats: normalizedStats,
      });
      localStorage.setItem('ft_state_v1', payload);
    } catch {
      // ignore
    }
  }, [focusDurationMinutes, breakDurationMinutes, phase, secondsRemaining, enableSound, enableNotifications, autoStartNextPhase, stats]);

  // Update document title with time remaining
  useEffect(() => {
    const base = `${formatSecondsAsClock(secondsRemaining)} · ${phaseLabel}`;
    const previous = document.title;
    document.title = base;
    return () => {
      document.title = previous;
    };
  }, [secondsRemaining, phaseLabel]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleStartPause();
      } else if (e.key.toLowerCase() === 's') {
        handleSkip();
      } else if (e.key.toLowerCase() === 'r') {
        handleReset();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleStartPause, handleSkip, handleReset]);

  return (
    <div className="w-full max-w-md rounded-xl border border-black/10 dark:border-white/15 p-6 bg-background/60 backdrop-blur">
      <h2 className="text-2xl font-semibold text-center mb-4">{phaseLabel} Session</h2>

      <div className="flex items-baseline justify-center gap-2 mb-6">
        <span className="text-[64px] leading-none font-bold tabular-nums">{formatSecondsAsClock(secondsRemaining)}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm opacity-80">Focus (min)</label>
          <div className="flex gap-2">
            {[25, 45, 90].map((m) => (
              <button
                key={`focus-${m}`}
                className={`flex-1 h-9 rounded-md border text-sm transition-colors ${
                  focusDurationMinutes === m
                    ? 'bg-foreground text-background border-transparent'
                    : 'border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10'
                }`}
                onClick={() => {
                  setFocusDurationMinutes(m);
                  if (phase === 'focus' && !isRunning) {
                    setSecondsRemaining(m * 60);
                  }
                }}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="mt-2">
            {isPremium ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={180}
                  value={focusDurationMinutes}
                  onChange={(e) => {
                    const next = Math.max(1, Math.min(180, Number(e.target.value) || 0));
                    setFocusDurationMinutes(next);
                    if (phase === 'focus' && !isRunning) {
                      setSecondsRemaining(next * 60);
                    }
                  }}
                  className="h-9 w-24 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3"
                />
                <span className="text-sm opacity-80">Custom</span>
              </div>
            ) : (
              <button
                className="h-9 px-3 rounded-md border border-black/10 dark:border-white/15 text-sm hover:bg-black/5 dark:hover:bg-white/10"
                onClick={() => setIsPaywallOpen(true)}
              >
                Custom (Premium)
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm opacity-80">Break (min)</label>
          <div className="flex gap-2">
            {[5, 10, 15].map((m) => (
              <button
                key={`break-${m}`}
                className={`flex-1 h-9 rounded-md border text-sm transition-colors ${
                  breakDurationMinutes === m
                    ? 'bg-foreground text-background border-transparent'
                    : 'border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10'
                }`}
                onClick={() => {
                  setBreakDurationMinutes(m);
                  if (phase === 'break' && !isRunning) {
                    setSecondsRemaining(m * 60);
                  }
                }}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="mt-2">
            {isPremium ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={breakDurationMinutes}
                  onChange={(e) => {
                    const next = Math.max(1, Math.min(60, Number(e.target.value) || 0));
                    setBreakDurationMinutes(next);
                    if (phase === 'break' && !isRunning) {
                      setSecondsRemaining(next * 60);
                    }
                  }}
                  className="h-9 w-24 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3"
                />
                <span className="text-sm opacity-80">Custom</span>
              </div>
            ) : (
              <button
                className="h-9 px-3 rounded-md border border-black/10 dark:border-white/15 text-sm hover:bg-black/5 dark:hover:bg-white/10"
                onClick={() => setIsPaywallOpen(true)}
              >
                Custom (Premium)
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          className="h-10 px-5 rounded-full border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10"
          onClick={handleStartPause}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          className="h-10 px-5 rounded-full border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10"
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          className="h-10 px-5 rounded-full border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10"
          onClick={handleSkip}
        >
          Skip
        </button>
      </div>

      <div className="mt-6 border-t border-black/10 dark:border-white/15 pt-4">
        <h3 className="text-sm font-semibold mb-3 opacity-80">Settings</h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="opacity-80">Completed today</span>
            <span className="tabular-nums">Focus: {stats.focusCompleted} · Breaks: {stats.breakCompleted}</span>
          </div>
          <div className="flex items-center justify-end mt-2">
            <button
              className="h-9 px-4 rounded-full border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 text-sm"
              onClick={() => setIsSettingsOpen(true)}
            >
              Open Settings
            </button>
          </div>
          <p className="text-xs opacity-60 mt-2">Shortcuts: Space = Start/Pause, S = Skip, R = Reset</p>
        </div>
      </div>

      <Modal open={isSettingsOpen} title="Settings" onClose={() => setIsSettingsOpen(false)}>
        <div className="flex flex-col gap-3">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={enableSound} onChange={(e) => setEnableSound(e.target.checked)} />
            Sound on phase change
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={enableNotifications}
              onChange={async (e) => {
                const next = e.target.checked;
                if (next) {
                  try {
                    if (typeof window !== 'undefined' && 'Notification' in window) {
                      const permission = await Notification.requestPermission();
                      if (permission === 'granted') {
                        setEnableNotifications(true);
                      } else {
                        setEnableNotifications(false);
                        alert('Notification permission not granted');
                      }
                    }
                  } catch {
                    setEnableNotifications(false);
                  }
                } else {
                  setEnableNotifications(false);
                }
              }}
            />
            Desktop notifications
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={autoStartNextPhase} onChange={(e) => setAutoStartNextPhase(e.target.checked)} />
            Auto-start next phase
          </label>
        </div>
      </Modal>

      <Modal open={isPaywallOpen} title="Premium Feature" onClose={() => setIsPaywallOpen(false)}>
        <div className="flex flex-col gap-3 text-sm">
          <p>Custom durations are available on the Premium plan.</p>
          <button
            className="h-10 px-5 rounded-full border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10"
            onClick={() => alert('Redirect to checkout (to be implemented).')}
          >
            Upgrade now
          </button>
        </div>
      </Modal>
    </div>
  );
}


