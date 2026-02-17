# Product Brief: Feed Tracker

## Vision

A dead-simple PWA for logging newborn feeds and nappy changes. Designed to be used one-handed by sleep-deprived parents — tap, log, done. Two parents log from separate phones to a shared Google Sheet. No accounts, no servers to maintain, zero cost.

- **Users:** Mum and Dad, logging from their own phones.
- **Platform:** Mobile PWA (installed to home screen via GitHub Pages).
- **Data store:** Google Sheets via Google Apps Script — doubles as the reporting layer.

## MVP (Phase 1)

### Included

- **Home screen:** 3 large buttons — "Breast Feed", "Bottle Feed", "Nappy Change"
- **Breast Feed screen:** Left/Right selector → start/stop timer → save
- **Bottle Feed screen:** Amount before (ml) → start/stop timer → amount after (ml) → save
- **Nappy Change screen:** Poop scale (None / Small / Medium / Large) + Pee scale (None / Small / Medium / Large) → save
- **User toggle:** Persistent name selector in the header (Mum / Dad), stored in `localStorage`, sent with every log
- **Timestamp:** Auto-recorded at save time, sent to the sheet
- **Google Sheets backend:** Single Apps Script `doPost` Web App that appends a row per log entry
- **PWA manifest:** Installable to Android/iOS home screen with app icon and standalone display
- **GitHub Pages hosting:** Static deploy via GitHub Action

### Excluded from MVP

- Breast pump tracking (Phase 2)
- In-app history / log review (Phase 2)
- Timestamp override / retroactive logging (Phase 2)
- Haptic feedback (Phase 2)
- Deep-link app shortcuts (Phase 2)
- Offline support / background sync (Cut)
- Multi-user auth / passwords (Cut)
- In-app charts or analytics (Cut — use Google Sheets pivot tables)

### Success Criteria

1. Can install PWA to home screen on both parents' phones
2. Can log a breast feed (side + duration) in under 10 seconds
3. Can log a bottle feed (before/after amounts + duration) in under 15 seconds
4. Can log a nappy change (poop + pee scale) in under 5 seconds
5. All logs appear as rows in the shared Google Sheet with correct user, type, and timestamp
6. Sheet can be filtered/pivoted to review feeding patterns

### Estimated Complexity

**Low.** Four simple form screens, a timer component, and a single POST to a Google Apps Script endpoint. The hardest part is getting the PWA install experience smooth (manifest, service worker, icons). No complex state management, no routing beyond tab-level navigation, no auth. Svelte 5 is well-suited — each screen is a small component with minimal reactivity.

## Phase 2: Pump Tracking & Polish

**Value:** Adds the pump logging feature (confirmed future need) and quality-of-life improvements.

| Feature                                   | Value  | Complexity | Notes                                               |
| ----------------------------------------- | ------ | ---------- | --------------------------------------------------- |
| Breast pump log (L/R/Both, timer, amount) | High   | Low        | Same pattern as breast feed + amount field          |
| Timestamp override                        | Medium | Low        | "This happened at [time]" for forgot-to-start cases |
| Last 5 logs summary on home screen        | Medium | Low        | Read last N rows from sheet or cache locally        |
| Haptic feedback on save                   | Low    | Trivial    | `navigator.vibrate(50)` on success                  |
| App shortcuts (long-press quick actions)  | Low    | Low        | PWA manifest `shortcuts` array                      |

**Prerequisites from Phase 1:** Working log flow, stable sheet schema, deployed PWA.

**Deployable independently:** Yes — each feature is additive.

## Parked Ideas

| Idea                      | Why Parked                                                                                            |
| ------------------------- | ----------------------------------------------------------------------------------------------------- |
| Offline / background sync | Always-online assumption; IndexedDB + Background Sync API is disproportionate complexity for the risk |
| In-app charts / analytics | Google Sheets pivot tables are free and already better than anything we'd build                       |
| Multi-user authentication | Two trusted users on a family app — a name toggle is sufficient                                       |
| Export / share data       | The data is already in Google Sheets — nothing to export                                              |
| Notifications / reminders | Out of scope; parents don't need an app to remind them the baby is crying                             |
| Dark mode                 | Nice eventually, but not worth the effort in MVP                                                      |

## Open Questions

1. **Sheet schema:** One sheet with a `type` column (breast/bottle/nappy) or separate tabs per type? Single sheet is simpler for logging; separate tabs are easier to read. **Recommendation:** Single sheet, use Sheets filters.
2. **Timer precision:** Nearest minute? Nearest second? **Recommendation:** Track in seconds, display as `mm:ss`.
3. **Bottle units:** ml or oz? **Recommendation:** ml (configurable later via a settings toggle if needed).
4. **Security:** The Apps Script URL is public. A shared secret in the payload stops casual abuse but isn't real security. The sheet itself should NOT be publicly shared — only the script endpoint is exposed. **Recommendation:** Hardcoded API key in the payload, sheet restricted to your Google accounts.
5. **Icon / branding:** Need a simple app icon for the PWA manifest. Can use an emoji-style icon or generate one.

## Technical Constraints

| Constraint                    | Impact                                                                                                           |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Static hosting (GitHub Pages) | All logic client-side; Apps Script is the only "server"                                                          |
| Google Apps Script latency    | POST responses take 1-3 seconds; need a loading/success state so the user knows it worked                        |
| PWA on iOS                    | iOS PWA support is limited — no Background Sync, no push notifications. Fine for MVP since we cut those features |
| No build server               | Vite builds locally or in GitHub Actions; no CI beyond deploy                                                    |
| SvelteKit + static adapter    | Must be fully prerenderable; no server routes. PWA via `vite-plugin-pwa` or SvelteKit service worker hooks       |
| Svelte 5                      | Use runes (`$state`, `$derived`, `$effect`, `$props`), modern component patterns                                 |
| Tailwind CSS                  | Utility-first styling for rapid mobile-first UI development                                                      |
| Base path                     | GitHub Pages project site requires base path handling in all routes and assets                                   |

## Tech Stack

| Layer     | Technology           | Why                                                                              |
| --------- | -------------------- | -------------------------------------------------------------------------------- |
| Framework | SvelteKit (Svelte 5) | Lightweight, fast, static adapter for GitHub Pages, service worker hooks for PWA |
| Bundler   | Vite                 | Standard for SvelteKit                                                           |
| PWA       | vite-plugin-pwa      | Handles manifest generation, service worker, install prompt, offline shell       |
| Styling   | Tailwind CSS         | Fast to build mobile-first UI one-handed-friendly tap targets                    |
| Backend   | Google Apps Script   | Free, zero-maintenance, direct Sheets integration                                |
| Database  | Google Sheets        | Free, shareable, built-in filtering/pivots for reviewing data                    |
| Hosting   | GitHub Pages         | Free static hosting, simple deploy via GitHub Actions                            |
| CI/CD     | GitHub Actions       | Build + deploy on push to main                                                   |

## Proposed Sheet Schema

| Column             | Type     | Example                       |
| ------------------ | -------- | ----------------------------- |
| Timestamp          | DateTime | 2026-03-15 02:34:00           |
| User               | String   | Mum                           |
| Type               | String   | breast / bottle / nappy       |
| Side               | String   | left / right / -              |
| Duration (seconds) | Number   | 420                           |
| Amount Before (ml) | Number   | 120                           |
| Amount After (ml)  | Number   | 30                            |
| Poop               | String   | none / small / medium / large |
| Pee                | String   | none / small / medium / large |
| Notes              | String   | (optional free text)          |

Unused columns per type are left blank. Simple, flat, filterable.
