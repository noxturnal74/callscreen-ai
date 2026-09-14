# CallScreen AI - UI QA Checklist

## Desktop 1440 and laptop 1280

- [ ] Landing hero fits viewport, headline max 2 lines, subtext max 20 words, both CTAs visible without scroll.
- [ ] Nav stays on one line, height 64px.
- [ ] App sidebar 232px visible, active item has subtle blue bg plus blue icon.
- [ ] Dashboard KPI row shows 6 real counts, no invented deltas.
- [ ] Recent results table columns readable, no overflow.
- [ ] Screening table scannable, filters use aria-pressed.
- [ ] Candidate table masks phones except confirmation modal.
- [ ] Scorecard evidence grid 2 columns, transcript collapsed by default.
- [ ] No em-dash in any visible copy (search for — and –).
- [ ] One accent blue only, no purple glow.

## Tablet 1024

- [ ] Sidebar collapses to hidden with topbar menu button opening drawer.
- [ ] Dashboard two-column section stacks to one column.
- [ ] Tables scroll horizontally without breaking layout.

## Mobile under 768

- [ ] Single column everywhere, `px-4` margins.
- [ ] Hero preview stacks below copy.
- [ ] Tables become horizontal scroll, no text overflow.
- [ ] Call buttons reachable, min 44px touch target.
- [ ] No `h-screen` hero, uses `min-h-[100dvh]`.

## Functionality (must not regress)

- [ ] `/api/candidates`, `/api/jobs`, `/api/settings` load.
- [ ] Start screening opens confirmation modal with masked numbers.
- [ ] `/api/calls/start` posts selected IDs and refreshes list.
- [ ] Live tracker polls `/api/calls/[callRunId]` for calling candidates.
- [ ] Scorecard shows real transcript and evidence from API.
- [ ] Settings mock/live toggle persists via POST `/api/settings`.
- [ ] Seed reset repopulates demo roster.

## States

- [ ] Each list page has empty state with one CTA.
- [ ] Detail pages show skeleton loaders, not bare text.
- [ ] Failed fetch shows action name plus reason plus Retry.
- [ ] Sandbox versus Live pill matches `/api/settings` on every page.

## Accessibility

- [ ] Contrast AA for body, focus-visible rings on all buttons and inputs.
- [ ] Status never color only, always icon plus text.
- [ ] Dialogs keyboard navigable, Escape closes.
- [ ] Filter buttons expose pressed state.
- [ ] Reduced motion disables GSAP reveals.

## Copy audit

- [ ] No fake precise stats, no invented testimonials.
- [ ] Demo data labeled Sandbox where applicable.
- [ ] Phone mask format consistent: `+62 812 ... 1234`.
- [ ] AI language subtle: AI Screening, AI Summary, CALL-E only where meaningful.
