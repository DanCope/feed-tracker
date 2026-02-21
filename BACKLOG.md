# Backlog: Feed Tracker

> Derived from: [PROJECT.md](PROJECT.md)
> Generated: 2026-02-17 · Revised: 2026-02-21

## Summary

8 features. MVP (F1–F7) is complete. Phase 2 is F8–F9: F8 extends the existing Google Apps Script with a read endpoint so both parents can see a live "recent activity" summary on the home screen (last breast side used, last bottle amount, last nappy); F9 covers remaining polish (haptic feedback, timestamp override, PWA shortcuts, expandable notes field).

## Feature Index

| ID  | Feature                                   | Phase   | Stories | Parallel Tracks          |
| --- | ----------------------------------------- | ------- | ------- | ------------------------ |
| F1  | Project Scaffolding & GitHub Pages Deploy | MVP     | 3       | 1 (parallel with F2)     |
| F2  | Google Sheet & Apps Script Backend        | MVP     | 3       | 1 (parallel with F1)     |
| F3  | App Shell & Navigation                    | MVP     | 4       | 1                        |
| F4  | Breast Feed Logging                       | MVP     | 3       | 1 (parallel with F6)     |
| F5  | Bottle Feed Logging                       | MVP     | 2       | 1 (parallel with F6)     |
| F6  | Nappy Change Logging                      | MVP     | 2       | 1 (parallel with F4, F5) |
| F7  | PWA Install Experience                    | MVP     | 3       | 1 (parallel with F4–F6)  |
| F8  | GAS Read Endpoint & Recent Activity       | Phase 2 | 3       | 1                        |
| F9  | Polish & Quality of Life                  | Phase 2 | 6       | 2                        |

---

## F1 — Project Scaffolding & GitHub Pages Deploy

**Description:** Initialize the SvelteKit project with all tooling — static adapter, Tailwind CSS, vite-plugin-pwa, TypeScript. Set up GitHub Actions to build and deploy to GitHub Pages. This is the foundation every other feature builds on.

**Source:** Product Brief — Tech Stack, Technical Constraints, GitHub Pages hosting

**Definition of Done:**

- [x] SvelteKit project builds with static adapter
- [x] Tailwind CSS and vite-plugin-pwa configured
- [x] GitHub Actions deploys to Pages on push to main
- [x] Placeholder page visible at the GitHub Pages URL

### Stories

#### F1-S1 — Initialize SvelteKit project with static adapter, Tailwind, and PWA plugin

**Size:** M
**Dependencies:** None — can start immediately
**Blocks:** F1-S2, F3-S1

**User Story:** As a developer, I want a working SvelteKit project with all tooling configured so that I can start building features immediately.

**Acceptance Criteria:**

- [x] SvelteKit project created with TypeScript and Svelte 5
- [x] `@sveltejs/adapter-static` installed and configured in `svelte.config.js`
- [x] Tailwind CSS v4 installed and working (utility classes render correctly)
- [x] `vite-plugin-pwa` installed and configured in `vite.config.ts` with basic manifest (name, icons placeholder, display: standalone)
- [x] `+layout.ts` exports `prerender = true` for static generation
- [x] `pnpm build` produces a static site in `build/`
- [x] Base path configured for GitHub Pages project site

**Technical Notes:** Use `pnpm create svelte@latest`. Static adapter needs `fallback: undefined` (no SPA fallback — all routes prerendered). Base path set via `kit.paths.base` in svelte config.

**Files Likely Affected:** `package.json`, `svelte.config.js`, `vite.config.ts`, `src/app.css`, `src/routes/+layout.ts`, `src/routes/+page.svelte`

**Out of Scope:** GitHub Actions workflow (F1-S2), app content, PWA icons.

---

#### F1-S2 — GitHub Actions workflow for Pages deployment

**Size:** S
**Dependencies:** F1-S1
**Blocks:** F1-S3

**User Story:** As a developer, I want the site to auto-deploy on every push to main so that I don't need to deploy manually.

**Acceptance Criteria:**

- [x] `.github/workflows/deploy.yml` triggers on push to `main`
- [x] Workflow installs deps, builds, and deploys to GitHub Pages using `actions/deploy-pages`
- [x] GitHub Pages source is set to GitHub Actions (not branch)
- [x] `.nojekyll` file included in build output

**Technical Notes:** Use `actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages`. Pnpm needs corepack enable step.

**Files Likely Affected:** `.github/workflows/deploy.yml`, `static/.nojekyll`

**Out of Scope:** Custom domain, caching optimization.

---

#### F1-S3 — Verify deployment with placeholder page

**Size:** S
**Dependencies:** F1-S2
**Blocks:** None

**User Story:** As a developer, I want to confirm the full build → deploy pipeline works before building features.

**Acceptance Criteria:**

- [x] Push to main triggers a successful GitHub Actions run
- [x] Placeholder page ("Feed Tracker" heading) is visible at `https://<user>.github.io/<repo>/`
- [x] No console errors, base path resolves correctly

**Technical Notes:** Smoke test — just verify the pipeline. Fix any base path or build issues before moving on.

**Files Likely Affected:** None (verification only)

**Out of Scope:** Any app functionality.

---

### Sequencing

Linear: S1 → S2 → S3. No parallelism within this feature, but the entire feature runs in parallel with F2 (Google Sheet setup).

### Risks

| Risk                                                    | Impact             | Mitigation                                                                    |
| ------------------------------------------------------- | ------------------ | ----------------------------------------------------------------------------- |
| vite-plugin-pwa conflicts with SvelteKit static adapter | Blocks PWA install | Test early in F1-S1; fall back to SvelteKit's native service worker if needed |
| GitHub Pages base path breaks asset loading             | Broken deploy      | Verify in F1-S3 before building features                                      |

---

## F2 — Google Sheet & Apps Script Backend

**Description:** Create the Google Sheet with the agreed schema and deploy an Apps Script web app that accepts POST requests and appends rows. This is the data layer — every log screen POSTs here.

**Source:** Product Brief — Google Sheets backend, Proposed Sheet Schema, Open Question #1 & #4

**Definition of Done:**

- [x] Google Sheet exists with correct column headers
- [x] Apps Script `doPost` accepts JSON, validates secret, appends row
- [x] Web app deployed and responds to external POST requests
- [x] Sheet is restricted to your Google accounts (not publicly shared)

### Stories

#### F2-S1 — Create Google Sheet with schema

**Size:** S
**Dependencies:** None — can start immediately
**Blocks:** F2-S2

**User Story:** As a developer, I want the Google Sheet ready with the correct columns so that the Apps Script can append rows to it.

**Acceptance Criteria:**

- [x] Google Sheet created with columns: Timestamp, User, Type, Side, Duration (seconds), Amount Before (ml), Amount After (ml), Poop, Pee, Notes
- [x] Header row frozen
- [x] Sheet shared with both parents' Google accounts (edit access)
- [x] Sheet is NOT publicly shared (link sharing off)

**Technical Notes:** Manual step — no code. Consider adding data validation dropdowns on Type (breast/bottle/nappy) and Poop/Pee columns for manual entry.

**Files Likely Affected:** None (Google Sheets, external)

**Out of Scope:** Apps Script, formatting, pivot tables.

---

#### F2-S2 — Write Apps Script doPost function

**Size:** M
**Dependencies:** F2-S1
**Blocks:** F2-S3

**User Story:** As a developer, I want a server endpoint that receives JSON log data and writes it to the sheet so that the app has a backend.

**Acceptance Criteria:**

- [x] `doPost(e)` parses JSON from request body
- [x] Rejects requests where `secret` field doesn't match hardcoded key (returns 403-like JSON error)
- [x] Appends a row with: current timestamp (server-side), user, type, side, duration, amount_before, amount_after, poop, pee, notes
- [x] Returns JSON `{ "status": "ok" }` on success
- [x] Returns JSON `{ "status": "error", "message": "..." }` on failure
- [x] Handles missing/optional fields gracefully (blank cells, not errors)

**Technical Notes:** Use `SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().appendRow([...])`. Timestamp should be server-generated (`new Date()`) for consistency. Parse with `JSON.parse(e.postData.contents)`.

**Files Likely Affected:** Google Apps Script editor (Code.gs)

**Out of Scope:** Rate limiting, input sanitization beyond secret check, CORS (Apps Script handles this).

---

#### F2-S3 — Deploy Apps Script as web app and verify

**Size:** S
**Dependencies:** F2-S2
**Blocks:** F3-S4

**User Story:** As a developer, I want the Apps Script deployed and testable so that I can wire it into the frontend.

**Acceptance Criteria:**

- [x] Apps Script deployed as web app (Execute as: Me, Access: Anyone)
- [x] POST request via curl or Postman with valid secret returns `{ "status": "ok" }`
- [x] Row appears in sheet with correct data
- [x] POST with invalid secret returns error JSON
- [x] Web app URL documented (saved to project config or env)

**Technical Notes:** Deploy → New deployment → Web app. "Anyone" access means no Google sign-in required from the client. The `secret` field is the only guard. Note the URL — the frontend needs it.

**Files Likely Affected:** None (Google Apps Script deployment, external)

**Out of Scope:** Frontend integration (that's F3-S4).

---

### Sequencing

Linear: S1 → S2 → S3. Entire feature runs in parallel with F1. The endpoint URL from F2-S3 is needed by F3-S4.

### Risks

| Risk                                | Impact                         | Mitigation                                                     |
| ----------------------------------- | ------------------------------ | -------------------------------------------------------------- |
| Apps Script latency (1-3s per POST) | Sluggish UX                    | Frontend shows loading/success states (F4-S3)                  |
| Apps Script URL is public           | Anyone could POST garbage data | Shared secret rejects requests without key; low-value target   |
| Google rate limits on Apps Script   | Logs fail under heavy use      | Not a real risk for 2 users; Google allows ~20k calls/day free |

---

## F3 — App Shell & Navigation

**Description:** Build the app layout — header with user toggle, home screen with navigation buttons, and the shared API service module. This is the container all log screens live inside.

**Source:** Product Brief — Home screen, User toggle, Timestamp

**Definition of Done:**

- [x] App has a header with title and user toggle
- [x] Home screen shows 3 large, tappable navigation buttons
- [x] User selection persists across sessions
- [x] API service module can POST to Apps Script and handle responses

### Stories

#### F3-S1 — Root layout with header and content area

**Size:** M
**Dependencies:** F1-S1
**Blocks:** F3-S2, F3-S3

**User Story:** As a parent, I want to see a clean app layout when I open the app so that I know where to tap.

**Acceptance Criteria:**

- [x] Root layout renders a header bar with app title ("Feed Tracker")
- [x] Header has a slot/area for the user toggle (implemented in F3-S2)
- [x] Main content area fills remaining viewport height
- [x] Mobile-first styling — full-width, large text, comfortable spacing
- [x] Viewport meta tag set for mobile (`width=device-width, initial-scale=1`)

**Technical Notes:** `src/routes/+layout.svelte`. Use Tailwind for layout. Header is fixed/sticky so it's always visible.

**Files Likely Affected:** `src/routes/+layout.svelte`, `src/app.html`

**Out of Scope:** User toggle logic, navigation buttons, page content.

---

#### F3-S2 — User toggle component (Mum / Dad)

**Size:** S
**Dependencies:** F3-S1
**Blocks:** F4-S2, F5-S2, F6-S2

**User Story:** As a parent, I want to select my name once and have it remembered so that every log is attributed to the right person.

**Acceptance Criteria:**

- [x] Toggle component shows "Mum" and "Dad" as tappable options
- [x] Selected user is visually highlighted
- [x] Selection persists to `localStorage` and survives app restart
- [x] Default is "Mum" on first launch (arbitrary — just needs a default)
- [x] Component exposes the current user as a readable value for other components

**Technical Notes:** Svelte 5 store or context. `localStorage.getItem('user')` on mount, `localStorage.setItem('user', value)` on change. Keep it simple — two buttons in the header.

**Files Likely Affected:** `src/lib/components/UserToggle.svelte`, `src/lib/stores/user.ts` (or context)

**Out of Scope:** Custom names, avatars, multi-user beyond two options.

---

#### F3-S3 — Home screen with navigation buttons

**Size:** S
**Dependencies:** F3-S1
**Blocks:** F4-S2, F5-S2, F6-S2

**User Story:** As a parent, I want to see big obvious buttons for each log type so that I can start logging with one tap.

**Acceptance Criteria:**

- [x] Home screen displays 3 large buttons: "Breast Feed", "Bottle Feed", "Nappy Change"
- [x] Each button navigates to its respective log screen
- [x] Buttons are large enough to tap one-handed on a phone (minimum 48px height, ideally much larger)
- [x] Visual distinction between buttons (icons or color-coding)
- [x] Page is the default route (`/`)

**Technical Notes:** SvelteKit file routing: `src/routes/+page.svelte` for home, `src/routes/breast-feed/+page.svelte`, etc. Use `<a>` tags with `href` for navigation (SvelteKit handles client-side routing). Consider emoji as quick icons: 🤱 🍼 🧷

**Files Likely Affected:** `src/routes/+page.svelte`

**Out of Scope:** Log screen content, back navigation (browser back is fine for MVP).

---

#### F3-S4 — API service module

**Size:** M
**Dependencies:** F2-S3, F1-S1
**Blocks:** F4-S2, F5-S2, F6-S2

**User Story:** As a developer, I want a single module that handles all communication with the Google Apps Script endpoint so that log screens don't duplicate fetch logic.

**Acceptance Criteria:**

- [x] `api.ts` module exports a `submitLog(data)` function
- [x] Function POSTs JSON to the Apps Script web app URL
- [x] Includes the shared secret in the payload
- [x] Returns a typed result: `{ success: true }` or `{ success: false, message: string }`
- [x] Apps Script URL and secret are stored in environment config (not hardcoded in components)
- [x] Handles network errors gracefully (try/catch, timeout)

**Technical Notes:** Use `fetch()`. Apps Script URL goes in a `.env` file or a config module (no real secrets — it's a static site, the values will be in the bundle. The secret just stops random bots). Consider a `$lib/config.ts` that reads from `import.meta.env` or has hardcoded values.

**Files Likely Affected:** `src/lib/services/api.ts`, `src/lib/config.ts` (or `.env`)

**Out of Scope:** Retry logic, offline queueing, response caching.

---

### Sequencing

F3-S1 first (layout). Then F3-S2 and F3-S3 can be parallel (both slot into the layout). F3-S4 depends on F2-S3 (needs the endpoint URL) but can be built with a placeholder URL and wired up when ready.

### Risks

| Risk                               | Impact                      | Mitigation                                                       |
| ---------------------------------- | --------------------------- | ---------------------------------------------------------------- |
| CORS issues with Apps Script       | API calls fail from browser | Apps Script web apps handle CORS natively; test in F2-S3         |
| Environment config for static site | Secret visible in bundle    | Accepted risk — secret only stops bots, not determined attackers |

---

## F4 — Breast Feed Logging

**Description:** The first log screen — the core use case. Parent selects left or right breast, starts a timer, stops it when feeding ends, and saves. This is the vertical slice that proves the whole system works end-to-end.

**Source:** Product Brief — Breast Feed screen (MVP Included)

**Definition of Done:**

- [x] Can log a breast feed with side and duration
- [x] Log appears in Google Sheet with correct data
- [x] Timer works reliably (start, stop, displays elapsed time)
- [x] Success/error feedback shown to user

### Stories

#### F4-S1 — Timer component

**Size:** M
**Dependencies:** F1-S1
**Blocks:** F4-S2, F5-S2, F8-S1

**User Story:** As a parent, I want a start/stop timer so that I can track how long the feed takes without watching the clock.

**Acceptance Criteria:**

- [x] Timer component displays elapsed time as `mm:ss`
- [x] "Start" button begins the timer; button changes to "Stop"
- [x] "Stop" button pauses the timer; button changes to "Start" (resume) with a "Done" option
- [x] Timer exposes elapsed seconds as a bindable/readable value
- [x] Timer visually indicates when running (e.g., pulsing dot, color change)
- [x] Timer handles screen lock / background gracefully (uses wall-clock diff, not `setInterval` counting)

**Technical Notes:** Track `startTime = Date.now()` on start, calculate elapsed as `Date.now() - startTime` on each tick (via `setInterval` for display only). This survives phone sleep. Svelte 5: use `$state` for running/elapsed, `$effect` for the interval.

**Files Likely Affected:** `src/lib/components/Timer.svelte`

**Out of Scope:** Lap times, timer history, sound alerts.

---

#### F4-S2 — Breast Feed screen

**Size:** M
**Dependencies:** F3-S1, F3-S2, F3-S3, F3-S4, F4-S1
**Blocks:** None

**User Story:** As a parent, I want to log which breast the baby fed from and how long the feed lasted so that I can track feeding patterns.

**Acceptance Criteria:**

- [x] Screen shows Left / Right toggle (large, tappable buttons)
- [x] Default: no side selected (must pick one before saving)
- [x] Timer component embedded — can start/stop during the feed
- [x] "Save" button submits: user (from toggle), type ("breast"), side, duration (seconds)
- [x] Save button disabled until side is selected and timer has been started then stopped
- [x] On successful save: show confirmation (e.g., green checkmark, "Logged!"), then return to home after 1–2 seconds
- [x] On error: show error message with "Try Again" option
- [x] Loading state while request is in flight (button disabled, spinner)

**Technical Notes:** Route: `src/routes/breast-feed/+page.svelte`. Calls `submitLog()` from F3-S4. Side selector can be a pair of large buttons with `$state` binding.

**Files Likely Affected:** `src/routes/breast-feed/+page.svelte`

**Out of Scope:** Both-sides logging (would need two timers — park for Phase 2), notes field.

---

#### F4-S3 — Success/error feedback pattern

**Size:** S
**Dependencies:** F4-S2
**Blocks:** F5-S2, F6-S2

**User Story:** As a parent, I want clear feedback when my log is saved so that I'm confident it worked and can put the phone down.

**Acceptance Criteria:**

- [x] Reusable feedback component: loading spinner, success state (checkmark + "Logged!"), error state (message + retry)
- [x] Success auto-navigates to home after ~1.5 seconds
- [x] Error state shows "Try Again" button that re-submits
- [x] States are visually distinct (color, icon) and obvious at a glance

**Technical Notes:** Extract from F4-S2's save flow into a shared `SubmitFeedback.svelte` component. Used by all three log screens.

**Files Likely Affected:** `src/lib/components/SubmitFeedback.svelte`, refactor `src/routes/breast-feed/+page.svelte` to use it

**Out of Scope:** Toast notifications, animation beyond simple transitions.

---

### Sequencing

F4-S1 (timer) can start as soon as F1-S1 lands — it's a standalone component. F4-S2 needs the full shell (F3) and the timer. F4-S3 extracts a pattern from F4-S2 — do it right after. This is the **critical path feature** — everything else follows the patterns established here.

### Risks

| Risk                            | Impact                  | Mitigation                                                           |
| ------------------------------- | ----------------------- | -------------------------------------------------------------------- |
| Timer drifts during phone sleep | Inaccurate duration     | Use wall-clock diff (`Date.now() - startTime`) not interval counting |
| Accidental double-submit        | Duplicate rows in sheet | Disable save button during submission                                |

---

## F5 — Bottle Feed Logging

**Description:** Log a bottle feed with the amount before feeding, a timer for duration, and the amount remaining after. The before/after model avoids mental math and tells parents how much to pump next time.

**Source:** Product Brief — Bottle Feed screen (MVP Included)

**Definition of Done:**

- [x] Can log a bottle feed with before amount, duration, and after amount
- [x] Log appears in Google Sheet with correct data
- [x] Amounts are in ml

### Stories

#### F5-S1 — Amount input component

**Size:** S
**Dependencies:** F1-S1
**Blocks:** F5-S2, F8-S1

**User Story:** As a parent, I want a quick way to enter ml amounts so that logging a bottle feed is fast.

**Acceptance Criteria:**

- [x] Numeric input component with large touch target
- [x] Displays value in ml with unit label
- [x] Increment/decrement buttons (±10ml) for quick adjustment
- [x] Can also type directly for exact values
- [x] Minimum 0, reasonable maximum (e.g., 500ml)
- [x] Component exposes value as a bindable number

**Technical Notes:** A `<input type="number">` with large step buttons on either side. Mobile keyboards show numeric pad with `inputmode="numeric"`. Step buttons are faster than typing for common amounts.

**Files Likely Affected:** `src/lib/components/AmountInput.svelte`

**Out of Scope:** Unit conversion (ml/oz), presets.

---

#### F5-S2 — Bottle Feed screen

**Size:** M
**Dependencies:** F3-S1, F3-S2, F3-S3, F3-S4, F4-S1, F4-S3, F5-S1
**Blocks:** None

**User Story:** As a parent, I want to log how much milk was in the bottle before and after feeding so that I know how much the baby actually drank.

**Acceptance Criteria:**

- [x] Screen shows: Amount Before input → Timer → Amount After input → Save
- [x] Flow guides the user: before amount first, then start timer, then after amount when done
- [x] "Save" submits: user, type ("bottle"), duration, amount_before, amount_after
- [x] Save button disabled until before amount > 0 and timer has run
- [x] Uses shared SubmitFeedback component for loading/success/error
- [x] After amount defaults to 0 (can be left at 0 if bottle emptied)

**Technical Notes:** Route: `src/routes/bottle-feed/+page.svelte`. Reuses Timer (F4-S1), AmountInput (F5-S1), SubmitFeedback (F4-S3).

**Files Likely Affected:** `src/routes/bottle-feed/+page.svelte`

**Out of Scope:** "Amount consumed" calculated field (parent can see this in the sheet), formula milk vs breast milk distinction.

---

### Sequencing

F5-S1 (amount input) can start in parallel with F4. F5-S2 needs the timer (F4-S1) and feedback (F4-S3) components to exist. Can be worked in parallel with F6 once F4 is done.

### Risks

| Risk                                           | Impact                       | Mitigation                                                     |
| ---------------------------------------------- | ---------------------------- | -------------------------------------------------------------- |
| Numeric input UX varies across mobile browsers | Frustrating to enter amounts | Provide ±10ml buttons as primary input, text field as fallback |

---

## F6 — Nappy Change Logging

**Description:** Log a nappy change with poop and pee amounts on a simple scale. No timer needed — this is the fastest log type. Tap, rate, save.

**Source:** Product Brief — Nappy Change screen (MVP Included)

**Definition of Done:**

- [x] Can log a nappy change with poop and pee scale
- [x] Log appears in Google Sheet with correct data
- [x] Logging takes under 5 seconds

### Stories

#### F6-S1 — Scale selector component

**Size:** S
**Dependencies:** F1-S1
**Blocks:** F6-S2

**User Story:** As a parent, I want to quickly rate poop/pee amount by tapping a scale so that I don't have to type anything.

**Acceptance Criteria:**

- [x] Component shows 4 tappable options: None, Small, Medium, Large
- [x] Options are visually distinct (size, color, or emoji)
- [x] Selected option is highlighted; only one can be selected
- [x] Defaults to "None" (pre-selected)
- [x] Component exposes selected value as a bindable string
- [x] Label prop to distinguish "Poop" vs "Pee" usage

**Technical Notes:** Four large buttons in a row. Consider emoji: 💩 for poop scale, 💧 for pee scale. Or simple colored squares that grow in size. Keep it visual — no text needed to understand the scale.

**Files Likely Affected:** `src/lib/components/ScaleSelector.svelte`

**Out of Scope:** Custom scale sizes, numeric values, free-text input.

---

#### F6-S2 — Nappy Change screen

**Size:** S
**Dependencies:** F3-S1, F3-S2, F3-S3, F3-S4, F4-S3, F6-S1
**Blocks:** None

**User Story:** As a parent, I want to log a nappy change in a few taps so that I can get back to the baby.

**Acceptance Criteria:**

- [x] Screen shows: Poop scale selector → Pee scale selector → Save
- [x] Both default to "None" — can save immediately if it's a dry nappy (still worth logging)
- [x] "Save" submits: user, type ("nappy"), poop, pee
- [x] Uses shared SubmitFeedback component
- [x] No timer — this is intentionally the fastest screen

**Technical Notes:** Route: `src/routes/nappy-change/+page.svelte`. Two ScaleSelector instances with different labels. Simplest screen in the app.

**Files Likely Affected:** `src/routes/nappy-change/+page.svelte`

**Out of Scope:** Nappy brand tracking, diaper rash notes (use Notes column in sheet manually if needed).

---

### Sequencing

F6-S1 can start in parallel with F4 and F5 (independent component). F6-S2 needs the feedback component (F4-S3). This feature is fully independent of F4 and F5 — can be worked simultaneously.

### Risks

| Risk            | Impact | Mitigation                  |
| --------------- | ------ | --------------------------- |
| None identified | —      | Simplest feature in the app |

---

## F7 — PWA Install Experience

**Description:** Polish the PWA manifest, generate proper icons, and verify the install-to-home-screen flow on both Android and iOS. The app should feel native when launched from the home screen — no browser chrome, correct splash screen.

**Source:** Product Brief — PWA manifest (MVP Included)

**Definition of Done:**

- [ ] App is installable on Android and iOS
- [ ] Launches in standalone mode (no browser bar)
- [x] Has a proper icon on the home screen
- [x] Correct app name and theme color

### Stories

#### F7-S1 — Generate app icons

**Size:** S
**Dependencies:** F1-S1
**Blocks:** F7-S2

**User Story:** As a parent, I want a recognizable icon on my home screen so that I can find the app quickly at 3am.

**Acceptance Criteria:**

- [x] App icon generated in required sizes: 192×192, 512×512
- [x] Maskable variant included for Android adaptive icons
- [x] Icon is simple and recognizable (e.g., baby bottle emoji/illustration)
- [x] Icons placed in `static/` directory

**Technical Notes:** Use a PWA icon generator (e.g., realfavicongenerator.net or pwa-asset-generator). Keep it simple — a single emoji-style image works fine. Maskable icon needs safe zone padding.

**Files Likely Affected:** `static/icon-192.png`, `static/icon-512.png`, `static/icon-maskable-192.png`, `static/icon-maskable-512.png`

**Out of Scope:** Favicon, Apple touch icons (vite-plugin-pwa can generate these), splash screens beyond what the manifest provides.

---

#### F7-S2 — PWA manifest and service worker configuration

**Size:** S
**Dependencies:** F7-S1, F1-S1
**Blocks:** F7-S3

**User Story:** As a parent, I want to install the app to my home screen so that it's always one tap away.

**Acceptance Criteria:**

- [x] Manifest includes: name ("Feed Tracker"), short_name ("FeedTrack"), icons, display ("standalone"), theme_color, background_color, start_url (with base path)
- [x] Service worker precaches the app shell for fast loading
- [x] `vite-plugin-pwa` configured with `registerType: 'autoUpdate'`
- [x] Manifest `start_url` accounts for GitHub Pages base path

**Technical Notes:** Configure in `vite.config.ts` under the PWA plugin options. Theme color should match the header. Use `scope` and `start_url` carefully with the base path.

**Files Likely Affected:** `vite.config.ts`

**Out of Scope:** App shortcuts (Phase 2), push notifications (Cut).

---

#### F7-S3 — Test install on Android and iOS

**Size:** S
**Dependencies:** F7-S2, F1-S3 (deployed to Pages)
**Blocks:** None

**User Story:** As a parent, I want to verify the app installs and works correctly on my actual phone.

**Acceptance Criteria:**

- [ ] Android: "Add to Home Screen" prompt appears (or manual: Chrome menu → Install)
- [ ] Android: App launches in standalone mode, icon visible on home screen
- [ ] iOS: Add to Home Screen via Safari share sheet works
- [ ] iOS: App launches in standalone mode (no Safari bar)
- [ ] App name and icon display correctly on both platforms
- [ ] Navigation works correctly in standalone mode

**Technical Notes:** This is a manual testing story. iOS requires Safari (Chrome on iOS doesn't support PWA install). Test both phones.

**Files Likely Affected:** None (testing only)

**Out of Scope:** Automated testing, install prompt UX.

---

### Sequencing

F7-S1 (icons) can start anytime after F1-S1. F7-S2 needs the icons. F7-S3 needs the full app deployed. This feature is parallelizable with F4–F6 — purely configuration and assets.

### Risks

| Risk                               | Impact                            | Mitigation                                                  |
| ---------------------------------- | --------------------------------- | ----------------------------------------------------------- |
| iOS PWA limitations                | No install prompt, manual process | Document the "Add to Home Screen" steps for your wife       |
| Base path breaks standalone launch | App opens to 404                  | Test `start_url` carefully in F7-S3; must include base path |

---

## F8 — GAS Read Endpoint & Recent Activity

**Description:** Add a `doGet` handler to the existing Google Apps Script so the app can read recent log entries from the shared sheet. Wire this into a home screen "Recent activity" summary showing the last breast feed side used, last bottle feed, and last nappy change — a live view shared across both parents' devices so either parent can see what happened most recently without checking the sheet.

**Source:** Conversation 2026-02-19 — "which breast she last fed off, or when was the last bottle feed"

**Definition of Done:**

- [x] Apps Script handles `doGet` requests and returns recent rows as JSON
- [x] Client can fetch and display the last event per log type
- [x] Home screen shows last breast feed (side), last bottle feed (amount consumed), and last nappy change with relative time and which parent logged it
- [x] Data is shared across both parents' devices (reads from the sheet, not device-local cache)

### Stories

#### F8-S1 — Add doGet handler to Apps Script

**Size:** S
**Dependencies:** F2-S2 (existing doPost script), F2-S3 (deployed web app)
**Blocks:** F8-S2

**User Story:** As a developer, I want the Apps Script to return recent log rows via GET so that the client can read shared data from the sheet.

**Acceptance Criteria:**

- [x] `doGet(e)` validates the shared secret from `e.parameter.secret`
- [x] Reads the last N rows from the sheet (default 20, max 100, configurable via `e.parameter.limit`)
- [x] Returns JSON: `{ "status": "ok", "data": [{ timestamp, user, type, side, duration, amountBefore, amountAfter, poop, pee, notes }, ...] }` ordered newest-first
- [x] Returns `{ "status": "error", "message": "Unauthorized" }` on invalid secret
- [x] Derives column order from the header row (row 1) rather than hardcoded indices for resilience
- [x] Same deployment ID and URL — only a new deployment _version_ needs to be published (Manage deployments → edit → New version)

**Technical Notes:** `ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON)`. GAS handles CORS automatically. GET requests from `fetch()` follow the 302 redirect GAS issues — the default `redirect: "follow"` handles this. Publishing a new version under the same deployment keeps the existing client config unchanged.

**Files Likely Affected:** Google Apps Script (Code.gs)

**Out of Scope:** Filtering by user or date range, pagination beyond the `limit` param.

---

#### F8-S2 — fetchLatestLogs() service function and reactive store

**Size:** M
**Dependencies:** F8-S1
**Blocks:** F8-S3

**User Story:** As a developer, I want a typed client service and reactive store for recent logs so that components can easily display up-to-date shared data.

**Acceptance Criteria:**

- [x] `fetchLatestLogs(limit?: number): Promise<FetchLogsResult>` added to `src/lib/services/api.ts`
  - GETs the Apps Script URL with `?secret=xxx&limit=N` query params
  - Returns `{ success: true; data: LogEntry[] }` or `{ success: false; message: string }`
  - Same 15s timeout and error-handling pattern as `submitLog`
- [x] `LogEntry` interface exported from `api.ts` matching the sheet columns
- [x] `latestStore` created in `src/lib/stores/latest.svelte.ts` using `$state`/`$derived` runes
  - `$derived` helpers: `lastBreastFeed`, `lastBottleFeed`, `lastNappyChange` (most recent entry per type)
  - `refresh()` method with 30-second TTL — skips fetch if data was loaded recently
  - `init()` restores the last response from `localStorage` for instant paint on next visit; `refresh()` then updates in background
  - `isLoading` state exposed for spinner
- [x] All fetch calls inside `$effect()` or explicit `refresh()` — never at module level (prerender safety)

**Technical Notes:** Secret appears in the GET query string — the same exposure level as `localStorage`. Acceptable for this threat model. The store should not call `fetch` at module scope; only trigger inside `$effect()` in the consuming component.

**Files Likely Affected:** `src/lib/services/api.ts`, `src/lib/stores/latest.svelte.ts`

**Out of Scope:** Real-time polling, push updates, write-side caching.

---

#### F8-S3 — Recent activity section on home screen

**Size:** M
**Dependencies:** F8-S2, F3-S3 (home screen)
**Blocks:** None

**User Story:** As a parent, I want to see at a glance when the last feed was and which breast was used so that I don't have to ask my partner or open the sheet.

**Acceptance Criteria:**

- [x] Home screen displays a "Recent" section below the navigation buttons
- [x] Shows one summary row per log type (breast, bottle, nappy) — each row shows type emoji, key detail (side / amount consumed / poop+pee scale), relative time (e.g., "2h ago"), and which parent logged it
- [x] Relative time recalculates client-side without re-fetching
- [x] Uses `localStorage`-cached data for instant display on load; fetches updated data from the sheet in background
- [x] Shows a "No logs yet" placeholder when cache is empty and no fetch has completed
- [x] Shows a subtle loading indicator while the initial fetch is in flight
- [x] Data is shared across both parents' devices (sourced from the sheet, not per-device cache)

**Technical Notes:** Trigger `latestStore.refresh()` in a `$effect` in `+page.svelte`. Extract a `LastActivity.svelte` component — props: `emoji`, `label`, `detail`, `time`, `user`. Use semantic design tokens (`text-ink-subtle`, `bg-surface-raised`, `border-edge`) per the visual design system. Relative time bands: `"just now"` (<1 min), `"Xm ago"` (<1h), `"Xh ago"` (<24h), `"yesterday"`.

**Files Likely Affected:** `src/routes/+page.svelte`, `src/lib/components/LastActivity.svelte`

**Out of Scope:** Full log history view, filtering, sorting, tapping entries.

---

### Sequencing

Linear within F8: S1 (Apps Script update + publish new version) → S2 (client service + store) → S3 (home screen UI). S1 is a manual step in the Apps Script editor. S2 and the start of S3 can be developed against a mocked API response before S1 is deployed.

### Risks

| Risk                                   | Impact                                         | Mitigation                                                                                |
| -------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------- |
| GAS cold-start latency on doGet (1–3s) | Home screen feels slow on first visit          | Show `localStorage` cache immediately; fetch runs in background                           |
| Secret visible in GET query string     | Slightly less hidden than POST body            | Acceptable — same threat model as existing setup; secret already stored in `localStorage` |
| New deployment version required        | `doGet` not live until version is published    | Document step clearly; same deployment ID, just a new version                             |
| GAS 302 redirect on GET                | fetch may fail with non-default redirect modes | Default `redirect: "follow"` handles this correctly                                       |

---

## F9 — Polish & Quality of Life (Phase 2)

**Description:** Small improvements that make the app more pleasant to use — haptic feedback, timestamp override for retroactive logging, PWA app shortcuts, an optional notes field, contextual “last feed” hints on each log screen, and a polished back button.

**Source:** Product Brief — Phase 2: Polish

**Definition of Done:**

- [ ] All Phase 2 polish items implemented
- [ ] App feels snappier and more forgiving of human error

### Stories

#### F9-S1 — Haptic feedback on save

**Size:** S
**Dependencies:** F4-S3 (SubmitFeedback component)
**Blocks:** None

**User Story:** As a parent, I want to feel a vibration when a log is saved so that I know it worked without looking at the screen.

**Acceptance Criteria:**

- [ ] `navigator.vibrate(50)` fires on successful save
- [ ] No vibration on error
- [ ] Gracefully degrades if vibration API not available (no error thrown)
- [ ] Works on Android; silently skipped on iOS (no vibration API support)

**Technical Notes:** Add to SubmitFeedback component's success state. One line of code: `navigator.vibrate?.(50)`.

**Files Likely Affected:** `src/lib/components/SubmitFeedback.svelte`

**Out of Scope:** Custom vibration patterns, sound effects.

---

#### F9-S2 — Timestamp override

**Size:** M
**Dependencies:** F3-S4 (API service), F4-S2
**Blocks:** None

**User Story:** As a parent, I want to override the timestamp when I forgot to log in real-time so that the data is accurate.

**Acceptance Criteria:**

- [ ] Optional "Change time" link/button on all log screens
- [ ] Tapping it reveals a datetime picker pre-filled with "now"
- [ ] If overridden, the custom timestamp is sent in the payload instead of relying on server time
- [ ] Apps Script `doPost` updated: uses client timestamp if provided, else server `new Date()`
- [ ] Collapsed by default — doesn't clutter the normal flow

**Technical Notes:** `<input type="datetime-local">` works on mobile browsers. Send as ISO string. Update Apps Script to check for a `timestamp` field in the payload.

**Files Likely Affected:** All log screen pages, `src/lib/services/api.ts`, Apps Script (Code.gs)

**Out of Scope:** Editing past logs, deleting logs.

---

#### F9-S3 — PWA app shortcuts

**Size:** S
**Dependencies:** F7-S2 (manifest config)
**Blocks:** None

**User Story:** As a parent, I want to long-press the app icon to jump directly to a log screen so that I skip the home screen entirely.

**Acceptance Criteria:**

- [ ] Long-press on Android shows shortcuts: "Breast Feed", "Bottle Feed", "Nappy Change"
- [ ] Each shortcut opens the corresponding route directly
- [ ] Shortcut icons distinguish each log type
- [ ] Shortcuts work with GitHub Pages base path

**Technical Notes:** Add `shortcuts` array to PWA manifest in `vite.config.ts`. Each shortcut needs `name`, `url`, and `icons`. URLs must include the base path.

**Files Likely Affected:** `vite.config.ts`

**Out of Scope:** iOS shortcuts (not supported in PWA), customizable shortcuts.

---

#### F9-S4 — Expandable notes field on all log screens

**Size:** S
**Dependencies:** F4-S2, F5-S2, F6-S2 (all log screens exist)
**Blocks:** None

**User Story:** As a parent, I want to optionally add a short note to any log entry so that I can capture context that doesn't fit the standard fields (e.g. "fussy during feed", "tried new formula").

**Acceptance Criteria:**

- [ ] All three log screens (breast feed, bottle feed, nappy change) have an optional "Add a note" toggle below the main form controls
- [ ] Tapping "Add a note" expands a `<textarea>` inline — collapsed and hidden by default
- [ ] When collapsed with text already entered, a summary (e.g. "Note: fussy during feed") is shown so the note isn't silently lost
- [ ] Note value is included in the `submitLog` payload as `notes` (field already exists in the API and sheet schema)
- [ ] Textarea is cleared and collapsed after a successful save
- [ ] No note = empty string sent — sheet cell left blank (existing `doPost` behaviour unchanged)

**Technical Notes:** Use a `$state` boolean `showNotes` per screen toggled by the button. The `notes` field in `LogPayload` is already defined in `api.ts` and `doPost` already handles it — no backend changes needed. Keep the textarea `rows=3`, `maxlength=500`. Use `text-ink`, `bg-surface-raised`, `border-edge` tokens per the design system.

**Files Likely Affected:** `src/routes/breast-feed/+page.svelte`, `src/routes/bottle-feed/+page.svelte`, `src/routes/nappy-change/+page.svelte`

**Out of Scope:** Notes on the home screen recent-activity summary, editing notes after save, character count display.

---

#### F9-S5 — Contextual last-log hints on each log screen

**Size:** S
**Dependencies:** F8-S2 (`latestStore` with per-type derived values), F4-S2, F5-S2, F6-S2
**Blocks:** None

**User Story:** As a parent, I want to see relevant context from the last log of the same type so that I can make a more informed choice (e.g. which breast to use, how much to put in the bottle).

**Acceptance Criteria:**

- [ ] **Breast feed screen:** A "Last" badge appears on the Left or Right button that was most recently used, with a time and user hint below the selector (e.g. “Last: Right · 2h ago · Mum”). No side is pre-selected — the badge informs, the parent still taps deliberately.
- [ ] **Bottle feed screen:** A reference line above the Amount Before input shows the last bottle's consumption (`amount_before − amount_after`), the full before/after breakdown, and relative time (e.g. “Last bottle: 90 ml consumed (120 → 30 ml) · 3h ago · Dad”). No value is pre-filled.
- [ ] **Nappy change screen:** A single summary line at the top of the form shows the last nappy entry (e.g. “Last nappy: Medium poop · Small pee · 4h ago · Mum”). Poop and pee selectors remain at their default “None” state.
- [ ] Hints are hidden (not rendered) when no relevant log exists yet in the store
- [ ] Hints use `text-ink-subtle` and `text-sm` — clearly secondary to the interactive controls
- [ ] Relative times use the same bands as F8-S3 (“just now” / “Xm ago” / “Xh ago” / “yesterday”)

**Technical Notes:** All data comes from `lastBreastFeed`, `lastBottleFeed`, `lastNappyChange` derived values already computed by `latestStore` in F8-S2. Trigger `latestStore.refresh()` in a `$effect` on the log screen (same pattern as the home screen). No additional fetch — the store cache means data is available instantly if the home screen was visited first. Bottle consumption is a client-side calculation: `entry.amountBefore - entry.amountAfter`.

**Files Likely Affected:** `src/routes/breast-feed/+page.svelte`, `src/routes/bottle-feed/+page.svelte`, `src/routes/nappy-change/+page.svelte`

**Out of Scope:** Pre-filling inputs based on last values, per-user filtering of hints, hints on the pump screen.

---

#### F9-S6 — Restyle back button on log and settings screens

**Size:** XS
**Dependencies:** F4-S2, F5-S2, F6-S2 (log screens exist)
**Blocks:** None

**User Story:** As a parent, I want the back button to look like a button so that it’s obviously tappable, while keeping it small and out of the way so I don’t hit it by accident.

**Acceptance Criteria:**

- [ ] Back button on all three log screens and the settings screen is styled as a small ghost/secondary button: `bg-surface-raised border border-edge text-ink hover:bg-surface-tint rounded-xl`
- [ ] Size kept deliberately small (`text-sm`, `px-3 py-2`) — not a full-width or primary-CTA style
- [ ] Arrow and label unchanged: `← Back` on log screens, `← Back to home` on settings
- [ ] Position unchanged (top-left of the screen header area, before the page title)
- [ ] Focus ring uses `focus:ring-2 focus:ring-brand/25 focus:border-brand` per design system

**Technical Notes:** Replace the current `class="text-sm text-brand hover:underline"` with the ghost button classes. `<a>` element stays — no change to routing or `href`. Apply consistently across all four screens.

**Files Likely Affected:** `src/routes/breast-feed/+page.svelte`, `src/routes/bottle-feed/+page.svelte`, `src/routes/nappy-change/+page.svelte`, `src/routes/settings/+page.svelte`

**Out of Scope:** Swipe-back gesture, custom back icon, animated transitions.

---

### Sequencing

All six stories are independent — can be worked in any order or in parallel. F9-S1, F9-S4, F9-S5, and F9-S6 are all small-to-trivial and make ideal quick wins. F9-S2 is the meatiest.

### Risks

| Risk                                             | Impact             | Mitigation                                                     |
| ------------------------------------------------ | ------------------ | -------------------------------------------------------------- |
| Datetime picker UX varies across mobile browsers | Hard to use at 3am | Test on target devices; keep it optional and hidden by default |

---

## Cross-Feature Dependencies

| Dependency                      | Reason                                                       |
| ------------------------------- | ------------------------------------------------------------ |
| F3-S4 requires F2-S3            | API service needs the Apps Script web app URL                |
| F4-S2 requires F3 (all stories) | Breast feed screen lives inside the app shell                |
| F4-S2 requires F4-S1            | Screen uses the timer component                              |
| F5-S2 requires F4-S1            | Bottle feed reuses the timer component                       |
| F5-S2 requires F4-S3            | Bottle feed reuses the feedback component                    |
| F5-S2 requires F5-S1            | Bottle feed uses the amount input component                  |
| F6-S2 requires F4-S3            | Nappy change reuses the feedback component                   |
| F6-S2 requires F6-S1            | Nappy change uses the scale selector component               |
| F7-S3 requires F1-S3            | PWA install test needs a live deploy                         |
| F8-S1 requires F2-S2, F2-S3     | `doGet` built on the same Apps Script as `doPost`            |
| F8-S2 requires F8-S1            | Service function needs a working `doGet` endpoint            |
| F8-S3 requires F8-S2, F3-S3     | Home screen UI needs the store and existing home page        |
| F9-S2 requires F2-S2, F8-S1     | Timestamp override needs an Apps Script update (new version) |
| F9-S5 requires F8-S2            | Per-screen hints consume the `latestStore` derived values    |

## Parallel Work Summary

**MVP is complete (F1–F7).** Phase 2 work:

1. **F8 first:** S1 (update Apps Script, publish new version) is a quick manual step. Unblock it early so the 1–3s GAS cold-start risk can be validated before building the UI. S2 and S3 can be developed in parallel against a mocked response.
2. **F9 in parallel with F8-S3:** F9-S1 (haptic), F9-S3 (PWA shortcuts), F9-S4 (notes field), F9-S5 (per-screen hints), and F9-S6 (back button) are all small and independent. F9-S5 depends on F8-S2 (latestStore) so start it once F8-S2 is done. F9-S2 (timestamp override) also requires an Apps Script update — batch that change with F8-S1 to avoid publishing twice.

**Shared components** (Timer, AmountInput, ScaleSelector, SubmitFeedback, and the new LastActivity) continue to be the force multipliers.
