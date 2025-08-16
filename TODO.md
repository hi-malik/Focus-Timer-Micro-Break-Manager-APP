### Focus Timer & Micro‑Break Manager — Phase‑1 Web App Checklist

Implemented (ready today):
- [x] Scaffold Next.js + TypeScript + Tailwind app
- [x] Landing page with Timer section and metadata
- [x] Focus/Break timer with auto phase switch
- [x] Controls: Start, Pause/Resume (true pause), Reset, Skip
- [x] Preset durations: Focus (25/45/90), Break (5/10/15)
- [x] Premium gating for custom durations (non‑functional button until paywall)
- [x] Local persistence: durations, phase, time left, settings
- [x] Sound on phase change + toggle
- [x] Desktop notifications + permission request + toggle
- [x] Auto‑start next phase toggle
- [x] Keyboard shortcuts: Space (start/pause), S (skip), R (reset)
- [x] Document title shows remaining time
- [x] Production build is green
- [x] Session stats (today): count completed focus and break sessions; reset daily
- [x] Header with brand and Sign-in placeholder
- [x] Paywall modal for Custom durations (since it’s Premium)
- [x] Settings modal (move inline settings into modal)
- [x] PWA manifest + head meta tags
- [x] Basic analytics stubs (page view + timer events)

MVP remaining (prioritized for ASAP deploy):
- [ ] Unit tests for timer logic
- [ ] CI: lint + typecheck + build on PR

Deployment readiness checklist:
- [ ] App icons + favicon + social image
- [ ] Configure `manifest.json` name/short_name/theme/background
- [ ] Verify build on production (Vercel) and environment (no secrets needed)
- [ ] Create Vercel project and connect repo
- [ ] Set custom domain (optional)

Post‑deploy (nice to have):
- [ ] Onboarding tooltip for controls and settings
- [ ] Sound theme options
- [ ] Long break after N focus sessions (configurable)
- [ ] Export session history (CSV)

