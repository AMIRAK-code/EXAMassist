# Release checklist

Status at 27 September 2026, commit `11d0b77` and later (docs/REDESIGN.md §19).

**Evidence classes.** Every row says which kind of evidence it rests on:

- **automated:** Playwright, axe-core, unit tests;
- **browser-verified:** a real browser setting, driven by a script;
- **manual:** a person, on real hardware or with a real screen reader.

Automated scans and accessibility-tree inspection are not a spoken
screen-reader pass, and they do not establish full WCAG conformance.

**Recommendation:** see the end of this file.

---

## 1. Verified passes

| Check | Evidence | Result |
| --- | --- | --- |
| Unit tests | automated | 372 passed |
| Browser suite, Chrome desktop and Pixel 7 emulation | automated | 197 passed, 7 skipped (desktop-only checks on the phone project) |
| axe-core 4.13, WCAG 2.0/2.1/2.2 A and AA, public, learner and admin pages and their main states, phone and desktop sizes | automated | 0 violations |
| Keyboard: skip link; answering and checking a question; saving a plan; mobile menu opens and Escape returns focus | automated | pass |
| Focus visible and not hidden behind sticky chrome, 1440 × 900 and a 640 × 450 viewport | automated | 576 stops, 0 problems |
| Narrow-screen reflow, 320 CSS px viewport (WCAG 1.4.10) | automated | 24 routes, no sideways scrolling |
| **Actual 200% browser zoom, Chrome** (§3) | browser-verified | 16 pages: no sideways scrolling, no clipped text, 0 axe violations, 442 focus stops all visible and uncovered |
| Layout stability (font-swap tests), performance budgets | automated, lab | unchanged since the Phase 6 acceptance batch; no layout above the fold changed since |
| Planning integrity: what completes an activity | automated | pass (§18.12) |
| Typecheck | automated | clean |

## 2. Defects found and fixed

Each was re-tested in the journeys it touches.

1. **Links in running text were told apart by colour alone.** The
   underline the design styles was never drawn. Fixed in `294305a`.
2. **Scroll regions were unreachable from the keyboard:** wide tables, the
   passage pane, and displayed maths. Fixed in `294305a`.
3. **Reflow at 320 px:** the dashboard skills table and long code paths.
   Fixed in `294305a`.
4. **A new-questions plan activity could be completed by a session with
   repeats.** Fixed in `6227127`.

No defect is open from the automated checks.

## 3. Browser verification

### Actual 200% browser zoom, Chrome 153 on Windows 11

- **The setting:** Chrome's own default page zoom (chrome://settings →
  Appearance → Page zoom), set to 200% in a throwaway profile, in a real
  1280 × 800 window with no viewport emulation.
- **Checked that it applied:** the page reported `devicePixelRatio` 2 and
  a 631 × 352 CSS px viewport.
- **Pages:** 16, each checked for sideways scrolling, clipped text, axe
  (WCAG A/AA), and every focus stop. None had a problem.
- **The layout:** at 200% the site switches to its phone layout, and the
  player keeps most of the screen for the question.
- **Evidence:** screenshots of the whole window in the scratch copy's
  `shots-zoom/`, taken with `real-zoom.mjs`.
- **This is separate from the 320 px reflow check.** That one changes the
  viewport size only.

### Firefox and WebKit

**Not yet run.** Only Chromium browsers (Chrome, Edge) are installed on
this machine, and Playwright's Firefox and WebKit builds are not.

- **To run them, these downloads are needed** (Playwright CDN,
  cdn.playwright.dev):
  - `firefox-win64.zip`, Firefox 155, 122 MB;
  - `webkit-win64.zip`, WebKit 26.6, 59 MB;
  - `ffmpeg-win64.zip`, 1.4 MB, and `winldd-win64.zip`, 0.1 MB.
- **Playwright WebKit is not Safari.** It is the WebKit engine on Windows,
  without Safari's shell, iOS behaviour, VoiceOver or iOS keyboard
  handling. Safari on an iPhone is covered only by the manual phone check
  below.

| Browser | Evidence | Status |
| --- | --- | --- |
| Chrome 153 (desktop, Pixel 7 emulation) | automated | pass |
| Edge | not run separately (same engine as Chrome) | — |
| Firefox (Playwright build) | automated, if downloaded | **pending** |
| WebKit (Playwright build) | automated, if downloaded | **pending** |
| Safari on iPhone | manual | **pending** (§4.1) |

## 4. Pending manual checks

Leave each result **Pending** until it has actually been done. Record
every run, one row per device or assistive technology.

**Where to open it:**

- **The same production build as tested:** <http://10.10.18.112:3100>.
  This is the scratch copy's `next start`, running while this session's
  server is up.
- **Your development server:** <http://10.10.18.112:3000>. Same code, in
  development mode.
- **Before you start:**
  - **The network:** the laptop is on the "Edisu Piemonte" Wi-Fi, which
    Windows treats as Public. Node.js is allowed through the firewall, but
    a shared network may keep devices apart, and anyone on it can reach
    the server. If the phone cannot connect, or you would rather not
    expose it, connect the laptop to the phone's hotspot and use the
    laptop's new address (`ipconfig`).
  - **What to sign in with:** use a guest session or a test account, not
    real personal data.

### 4.1 Real phone: sticky header and controls

1. **Open a long question.** Open the URL and tap **Start**. Choose
   **LSAT**, then **Start practising** and **Start 10-question session**; a guest session is
   created for you, with no sign-in needed. LSAT gives long stems and
   passages.
2. **Scroll to the end of a long question.** The top bar (title, save
   status, Leave) and the bottom bar (Previous, Mark, Next) stay pinned,
   with no jump, gap or overlap.
3. **Choose an answer and tap Check answer.** The result and explanation
   appear and can be scrolled to fully; none of it is left hidden behind
   the bottom bar.
4. **Go forward and back.** Tap **Next** and **Previous** several times:
   the bars stay in place, and the question starts at its top.
5. **Type an answer.** Start **Digital SAT** practice (choose the Math
   section in setup if it is offered) and use the question numbers to find
   one with a typed answer box. Tap the box: the on-screen keyboard
   opens, and the box and what you type stay visible above it. Close the
   keyboard; the bars return to their places.
6. **Turn the phone to landscape** and repeat steps 2 to 5.

| Device | OS version | Browser | Orientation | Result | Defect, if any |
| --- | --- | --- | --- | --- | --- |
| | | | portrait | Pending | |
| | | | landscape | Pending | |

Ideally one iPhone (Safari) and one Android phone (Chrome).

### 4.2 Real screen reader

Use NVDA (free) with Chrome or Firefox on Windows, or VoiceOver on iPhone
(Safari) or Mac, or TalkBack on Android (Chrome).

1. **Navigation.**
   - On the home page, the first Tab reaches "Skip to main content", and
     it works.
   - Move by headings and by landmarks: banner, main navigation, main,
     footer.
   - The Menu button says whether it is open.
2. **Question and option labels.** In a practice session:
   - the question number and "of 10" are read;
   - the stem is read, then each option as a radio button in a group
     ("Select one answer"), with its text;
   - the question navigator reads each question's state (for example
     "Question 2, not answered").
3. **Feedback.** After Check answer, whether the answer was correct is
   announced or reachable next, followed by the explanation. Note whether
   the hidden description after each question ("no figures, tables or
   mathematical notation") helps or is too wordy.
4. **Save status.** After choosing an answer, "Saved" is announced
   politely, without moving focus. Offline (flight mode), the waiting
   state is announced.
5. **Planning forms.** Study plan → Make a plan:
   - the date and weekly-time fields read their labels and hints;
   - "Preview with these" and "Save this plan" are buttons;
   - each session reads its day, kind ("New questions only"), state,
     reason, and Start and Skip;
   - if two dates exist, the date choice is announced with both options.
6. **Errors.** On sign-in with a wrong password, the error is announced
   and each field reads it.

| Screen reader and version | Browser | Device and OS | Area (1–6) | Result | Defect, if any |
| --- | --- | --- | --- | --- | --- |
| | | | 1 | Pending | |
| | | | 2 | Pending | |
| | | | 3 | Pending | |
| | | | 4 | Pending | |
| | | | 5 | Pending | |
| | | | 6 | Pending | |

The accessibility tree was inspected in Chrome (§19.1), and it is not a
spoken screen-reader pass.

## 5. Dependency advisory: PostCSS in Next.js

### The advisories

All four are in `postcss` at
`node_modules/next/node_modules/postcss@8.4.31`, which `next@15.5.25`
depends on exactly.

| Advisory | Title | Severity (CVSS 3.1) | Affected | Patched |
| --- | --- | --- | --- | --- |
| GHSA-qx2v-qp2m-jg93 | XSS via unescaped `</style>` in stringify output | moderate (6.1) | < 8.5.10 | 8.5.10 |
| GHSA-6g55-p6wh-862q | arbitrary file read via attacker-controlled `sourceMappingURL` | high (7.5) | ≤ 8.5.11 | 8.5.12 |
| GHSA-r28c-9q8g-f849 | path traversal in source-map auto-loading | high (7.5) | ≤ 8.5.17 | 8.5.18 |
| GHSA-fxqj-rqcc-2cmp | incomplete fix of GHSA-6g55 when `from` is unset | moderate | ≤ 8.5.22 | 8.5.23 |

`npm audit` reports postcss as high and next as moderate (via postcss).

### Does it apply here?

Not at runtime:

- **The running server does not use this copy.** Its bundles load
  `postcss` as an external, which resolves to the app's top-level
  `postcss@8.5.28`, already patched. sanitize-html uses that copy, and
  the sanitiser does not allow `style` attributes.
- **Next's own copy (8.4.31)** is used only by its build tooling, while
  `next build` processes the project's own stylesheets: Tailwind output,
  `globals.css` and KaTeX's CSS.
- **No visitor-supplied CSS** is ever parsed, stringified or given source
  maps.
- **The remaining exposure** is a malicious dependency's CSS at build
  time: a supply-chain scenario, not one a site visitor can trigger.

### Is a major Next.js upgrade necessary?

- **For a fix released by Next.js: yes.** The newest Next 15 release,
  15.5.26 (the `backport` tag), still pins `postcss@8.4.31`. Next 16.3.6,
  the current `latest`, pins 8.5.23, which is patched.
- **To remove the vulnerable version: no.** An npm override inside the
  Next 15 line does it.

### The smallest remediation, verified but not applied

Add to `package.json`, then reinstall:

```json
"overrides": {
  "next": { "postcss": "^8.5.23" }
}
```

npm keeps the old nested version recorded in the lockfile. Remove the
`node_modules/next/node_modules/postcss` entry from `package-lock.json`,
then run `npm install --ignore-scripts`.

**Tested in an isolated copy** with its own `node_modules`, so the repo was
not touched:

- `npm ls postcss` shows Next deduped onto `postcss@8.5.28`;
- `npm audit --omit=dev` reports 0 vulnerabilities;
- `next build` succeeds;
- **the emitted CSS is byte-identical** to the same folder built with
  8.4.31 (both stylesheets compared).

**Caveat:** Next.js does not officially support a different PostCSS than
it pins. The override works for this build and makes no difference to its
output; it is not a Next-sanctioned fix.

**Options, smallest first:**

1. **Accept for this release,** with the justification above, and upgrade
   to Next 16 in a planned change.
2. **Apply the override now:** one `package.json` entry and one lockfile
   entry; verified as above.
3. **Upgrade to Next 16.3.6:** the supported fix, but a major upgrade,
   needing its own migration and a full re-verification, including a
   performance batch.

**Not applied,** pending your choice.

## 6. Known limitations

- **Accessibility:** automated checks cover part of WCAG only. Full
  conformance is not claimed.
- **Browsers:** Firefox and WebKit have not been tested (§3). Safari and
  iOS are covered only by the pending phone check. Keyboard checks ran in
  Chrome only.
- **No CI pipeline:** run `npm run e2e`, or `npm run e2e:a11y` for the
  accessibility checks alone.
- **Study plans:**
  - days are counted in UTC; time-zone-aware scheduling is TASK-BOARD
    item 7;
  - the Bocconi bank is small, so its plans are mostly revision.
- **Out of scope:** guest-history merging and remembered-exam cookies.
- **Performance:**
  - budgets are local lab budgets on one machine, not field data;
  - the SAT format guide read about 100 ms slower in one Phase 6 batch,
    within budget (docs/REDESIGN.md §18.9).
- **Historical data:** assessment data, scores and completed or skipped
  plan history are preserved. No migration has run since 007.

## 7. Release recommendation

**Ready for release once the two manual checks pass: not before.**

- **Everything that can be checked automatically passes,** and no known
  defect is open.
- **The phone check is outstanding.** The sticky player bars on a real
  phone are the one piece of behaviour that emulation could not settle.
- **The screen-reader check is outstanding.** No spoken pass has been
  done.

**The dependency advisory** does not affect the running site and does not
block release. Choose one of the options in §5.

**Your actions:**

1. Run §4.1 on at least one real phone, ideally an iPhone and an Android
   phone, and record the results.
2. Run §4.2 with at least one screen reader, and record the results.
3. Choose a dependency option from §5.
4. Decide whether Firefox and WebKit should be tested with Playwright's
   builds (181 MB of downloads, §3).
5. Report any defect found, for a focused fix and re-test before release.
