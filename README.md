# PermCompass

A gamified, offline-capable Progressive Web App that helps Microsoft employees and friends navigate the employer-sponsored green card journey.

**Live site:** https://aminuabdusalam.github.io/PermCompass/

## Why

The green card process is opaque and overwhelming. Timelines vary by country, category, employer steps, government processing, and Visa Bulletin movement. PermCompass turns the process into a clearer path with learning, progress, and practical estimates.

## What it does

- Interactive tracker with country-aware date estimates across the green card process.
- Gamified chapters with quizzes, XP, and levels.
- Offline-installable PWA that works from a phone or desktop browser.

## Chapters

1. Employer-Sponsored Green Cards 101
2. Phase 1: PERM Assessment + JD
3. Phase 2: Skills Verification + PWD Request
4. Phase 3: PWD from DOL + Signed EVLs
5. Phase 4: Labor Market Test + PERM Prep
6. Phase 5: PERM Filing
7. Phase 6: I-140 Immigrant Petition
8. Phase 7: Priority Date Wait + The Visa Bulletin
9. Phase 8: I-485 or Consular Processing
10. Phase 9: Green Card Issued
11. After the Green Card: Life as an LPR

Each chapter has structured content and a quiz. Correct answers earn XP, and XP raises your level through the PermCompass tiers.

## Tech

| Piece | What it does |
| --- | --- |
| Vanilla HTML/CSS/JS | Entire UI. No framework, no build step, no npm. |
| `data.js` | Static arrays for phases, countries, waits, chapters, quizzes, and levels. |
| `manifest.json` | PWA manifest. Installable, standalone display, inline SVG icon. |
| `sw.js` | Service worker. Cache-first with `index.html` offline fallback. |
| `localStorage` | Persists XP, level, chapter progress, quiz scores, and tracker setup per browser. |

No backend, no accounts, no analytics. Progress lives in the user's browser via `localStorage`, so it survives refreshes but is per-device.

## Disclaimer

Educational only, not legal advice. Consult your immigration attorney. Priority date estimates are based on mid-2026 Visa Bulletin trends and change monthly - always check the current Visa Bulletin at https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html for real numbers.

## Run locally

Anything that serves the folder over HTTP works. Two easy options:

```bash
# Python
python -m http.server 5173

# Node (npx)
npx serve .
```

Then open http://localhost:5173. Opening `index.html` directly via `file://` will not work because service workers require an HTTP origin.

## Deploy

The site is hosted on GitHub Pages from the `main` branch. Any push to `main` republishes. Because Pages serves the app under the `/PermCompass/` sub-path, all asset paths in `sw.js` and `manifest.json` are relative (`./`), not absolute (`/`).

## License

MIT. See [LICENSE](LICENSE).

