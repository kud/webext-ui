# Changelog

All notable changes to this project are documented here.

---

## 0.2.0 — 2026-09-27

### Highlights

- The switch's checked thumb now uses `--accent-fg` instead of a hardcoded white, fixing a contrast failure as low as 1.31:1 against light accent colours in dark mode; the off thumb also gains a 1px `--border-control` edge so it reads clearly against the track. ([671e0ad](https://github.com/kud/webext-ui/commit/671e0ad70b9ca47f2ed370641905ea2a421ef390))
- `.btn-primary:hover` now mixes its fill towards `--accent-fg` with `color-mix()` and relative colour syntax rather than a flat `brightness(1.08)`, so hovering a button raises contrast instead of washing it out (white-on-blue goes from 4.51 up to 6.31 on hover, rather than dropping to 3.94). ([671e0ad](https://github.com/kud/webext-ui/commit/671e0ad70b9ca47f2ed370641905ea2a421ef390))
- Invalid form fields are no longer colour-only: `:user-invalid` and the new `.is-invalid` class double the border weight via an inset shadow, and a new `.field-error` class styles an accompanying error message line. ([671e0ad](https://github.com/kud/webext-ui/commit/671e0ad70b9ca47f2ed370641905ea2a421ef390))
- `button.row-bleed` now shows a pointer cursor and an inset focus ring, so it no longer looks unclickable or loses its focus indicator when it bleeds to a popup's edge. ([671e0ad](https://github.com/kud/webext-ui/commit/671e0ad70b9ca47f2ed370641905ea2a421ef390))

### Documentation

- The README now shows the accent colour living in each extension's own `src/theme.css`, linked after the vendor pair on every page, and spells out that `color-mix()` and relative colour syntax require Firefox 128+, so `strict_min_version` must be set to `142.0`. ([671e0ad](https://github.com/kud/webext-ui/commit/671e0ad70b9ca47f2ed370641905ea2a421ef390))

### Upgrading

- Re-sync the vendored CSS: `npx @kud/webext-ui@latest sync src/vendor/`.
- Move your accent colour pair out of the vendored files into your own `src/theme.css`, and link it after the vendor pair on every page.
- Set `strict_min_version` to `142.0` under `browser_specific_settings.gecko` in your `manifest.json`.

---
