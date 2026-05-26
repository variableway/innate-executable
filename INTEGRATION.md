# Innate Executable Integration Strategy

## Goal

Integrate `innate-executable/playground` into `innate-desktop-mono` while:
1. Preserving full standalone capability
2. Sharing build artifacts to reduce disk usage
3. Minimizing source code modifications

## Integration Approach

### 1. Nested Monorepo Preservation

The `playground/` directory retains its original structure as a self-contained monorepo:

```
playground/
├── package.json
├── pnpm-workspace.yaml          # Own workspace definition
├── apps/desktop/                # Next.js + Tauri app
│   ├── package.json
│   └── src-tauri/
└── packages/                    # ui, utils, tsconfig
    ├── ui/
    ├── utils/
    └── tsconfig/
```

**Rationale**: `playground` has its own `@innate/ui` (Radix UI-based) and `@innate/utils` that differ from the outer monorepo's packages. Merging them would require extensive refactoring. Preserving the nested structure allows both to coexist.

### 2. Cargo Workspace Integration

The Rust Tauri backend is integrated into the root Cargo workspace:

```toml
# Cargo.toml (repo root)
[workspace]
members = [
    "apps/desktop/src-tauri",                                    # existing
    "apps/innate-executable/playground/apps/desktop/src-tauri",  # new
]
```

**Shared dependencies**: `serde`, `serde_json`, `log`, `tauri`, `tauri-build` now use `{ workspace = true }`.

**Target sharing**: The `.cargo/config.toml` at repo root sets:
```toml
[build]
target-dir = "target"
```

This ensures both Tauri projects compile into the same `target/` directory.

### 3. Space Savings Analysis

| Aspect | Before (isolated) | After (shared) | Savings |
|---|---|---|---|
| Rust target/ per project | ~2-4 GB each | 1 shared | ~50-75% |
| Cargo.lock | 2 files (duplicate deps) | 1 unified | Eliminates duplication |
| Compiled crates | 2x cache | 1x cache | Shared incremental builds |

### 4. Independent vs Shared Modes

| Mode | How to run | Target directory | Use case |
|---|---|---|---|
| **Standalone** | `cd playground && pnpm install && pnpm dev` | `playground/apps/desktop/src-tauri/target/` | Development, CI isolation |
| **Shared** | `cd apps/innate-executable && pnpm desktop:dev` | `target/` (repo root) | Daily development, space saving |
| **Monorepo** | `pnpm --filter @innate/desktop tauri dev` | `target/` (repo root) | Cross-project workflows |

### 5. No Code Modifications Policy

- ✅ `playground/` source files remain untouched
- ✅ `playground/pnpm-workspace.yaml` preserved
- ✅ All original scripts and build processes functional
- ✅ Only `Cargo.toml` and integration metadata added

### 6. Future Merge Path (if desired)

If at some point the two `@innate/ui` packages need to be unified:

1. Compare component APIs between `packages/ui` (Base UI) and `playground/packages/ui` (Radix UI)
2. Migrate Radix-based components to Base UI equivalents
3. Update import paths in `playground/apps/desktop/src/`
4. Remove `playground/packages/ui` and redirect to root `packages/ui`

This is intentionally **out of scope** for this integration task.
