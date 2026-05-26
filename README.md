# Innate Executable Integration

This directory integrates the `innate-executable/playground` project into the `innate-desktop-mono` monorepo.

## Structure

```
apps/innate-executable/
├── README.md                          # This file
├── package.json                       # Integration entry scripts
├── INTEGRATION.md                     # Integration strategy & target sharing
├── APPSHELL_COMPARISON.md             # AppShell comparison with current workbench
└── playground/                        # Original innate-executable project (unchanged)
    ├── package.json
    ├── pnpm-workspace.yaml
    ├── apps/desktop/                  # Next.js + Tauri desktop app
    │   ├── src-tauri/                 # Rust backend (shared target)
    │   └── src/                       # Next.js frontend
    └── packages/                      # ui, utils, tsconfig
```

## Quick Start

### Run within this monorepo (shared target)

```bash
# From repo root
cd apps/innate-executable

# Dev mode (Next.js + Tauri with HMR)
pnpm desktop:dev

# Build (shared target/)
pnpm desktop:build
```

### Run independently (standalone)

```bash
cd apps/innate-executable/playground
pnpm install
pnpm dev          # Next.js only
# or
pnpm --filter desktop tauri dev
```

## Target Sharing

The Rust `src-tauri` project is registered as a member of the root Cargo workspace:

```toml
# Cargo.toml (root)
[workspace]
members = [
    "apps/desktop/src-tauri",
    "apps/innate-executable/playground/apps/desktop/src-tauri",
]
```

With `.cargo/config.toml`:
```toml
[build]
target-dir = "target"
```

Both Tauri projects share the same `target/` directory at the repository root, significantly reducing disk usage.

## Important Notes

- The `playground/` subdirectory is a **complete standalone monorepo** with its own `pnpm-workspace.yaml`.
- No source code in `playground/` has been modified — it remains fully functional independently.
- The `@innate/ui` package inside `playground/packages/ui` is separate from the monorepo's `packages/ui`.
