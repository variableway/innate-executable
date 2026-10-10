# Content contract

- `lessons/<phase>/<lesson>/en.md` — English source (required)
- `lessons/<phase>/<lesson>/zh.md` — Chinese (optional; fallback to en)
- `lessons/<phase>/<lesson>/meta.json` — metadata + `needsTranslation`
- `lessons/<phase>/<lesson>/slides.json` — Classic/Slides shared slices (`##` sections + keyPoints + commands)
- `glossary/en.json`, `glossary/zh.json`
- `lessons/index.json`, `lessons/phases.json` — generated

Import: `pnpm import` from repo root (source: `ai-engineering-from-scratch`).

Site must only consume `@aej/content` APIs.
