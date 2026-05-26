# AppShell Comparison: innate-executable vs Current Workbench

## Overview

| | innate-executable Playground | Current innate-desktop Workbench |
|---|---|---|
| **Framework** | Next.js 16.2 (App Router) | Vite + React 19 |
| **Renderer** | Tauri v2 | Tauri v2 |
| **UI Primitives** | Radix UI | Base UI |
| **Styling** | Tailwind CSS v4 | Tailwind CSS v4 |
| **State Management** | Zustand | React useState/useCallback |
| **Icons** | lucide-react | lucide-react |

---

## Layout Architecture

### innate-executable Playground

```
┌─────────────────────────────────────────────────────────────┐
│  Sidebar (collapsible)  │  Menu Bar                         │
│  ┌───────────────────┐  ├───────────────────────────────────┤
│  │ Brand + Logo      │  │                                   │
│  ├───────────────────┤  │  SidebarInset (main content)      │
│  │ Navigation        │  │                                   │
│  │ - 首页            │  │                                   │
│  │ - 教程中心        │  │                                   │
│  │ - 学习工作台      │  │                                   │
│  ├───────────────────┤  │                                   │
│  │ Courses (expand)  │  │                                   │
│  │   ├─ Skill 1      │  │                                   │
│  │   ├─ Skill 2      │  ├───────────────────────────────────┤
│  ├───────────────────┤  │  Terminal Panel (bottom/right)    │
│  │ Admin / 管理      │  └───────────────────────────────────┘
│  ├───────────────────┤  │  Status Bar                       │
│  │ Platform Info     │  └───────────────────────────────────┘
│  └───────────────────┘
```

**Key features**:
- **Collapsible sidebar** via `SidebarProvider` — can collapse to icon-only mode
- **Menu Bar** at top — app-level navigation/actions
- **Terminal Panel** — embedded terminal (xterm.js), positionable right or bottom
- **Status Bar** at bottom — system info, platform detection
- **Course navigation** — dynamic collapsible course/skill tree with auto-scan

### Current innate-desktop Workbench

```
┌─────────────────────────────────────────────────────────────┐
│  Sidebar Rail (88px)    │  Header (brand + toolbar)         │
│  ┌─────┐                ├───────────────────────────────────┤
│  │ ⚙️  │                │                                   │
│  │Icon │                │  ┌─────────┐ ┌──────────────────┐ │
│  │Label│                │  │ Left    │ │ Main Content     │ │
│  ├─────┤                │  │ Panel   │ │                  │ │
│  │ 📁  │                │  │         │ │                  │ │
│  │Work │                │  ├─────────┤ │                  │ │
│  ├─────┤                │  │         │ │                  │ │
│  │ 📦  │                │  │         │ ├──────────────────┤ │
│  │QA   │                │  └─────────┘ │ Right Panel      │ │
│  ├─────┤                │              │ (Capabilities)   │ │
│  │ ⚙️  │                │              └──────────────────┘ │
│  │Set  │                │                                   │
│  └─────┘                │  Git Status Bar                   │
│                         └───────────────────────────────────┘
```

**Key features**:
- **Fixed icon+label rail** (88px) — always visible, compact
- **Header** with brand and toolbar badges
- **Three-column layout** — left panel (product nav), main (content), right panel (capabilities)
- **Git Status Bar** — branch info, refresh
- **Agent Chat Panel** — integrated AI agent interaction

---

## Detailed Component Comparison

### Sidebar / Navigation

| Feature | innate-executable | Current Workbench |
|---|---|---|
| Width | `16rem` expanded / `3rem` collapsed | Fixed `88px` |
| Style | Full text + icons | Stacked icon-above-label |
| Collapsible | ✅ Yes (SidebarProvider) | ❌ No (fixed rail) |
| Group headers | ✅ Yes (Navigation, Courses, Admin) | ❌ No (flat list) |
| Nested items | ✅ Yes (course → skills) | ❌ No |
| Dynamic content | ✅ Auto-scanned courses/skills | ❌ Static nav items |
| Active state | `isActive` prop on menu button | Manual `activeItemId` check |

**Verdict**: innate-executable's sidebar is richer for content-heavy apps with hierarchical navigation. Current workbench's rail is simpler and more space-efficient for a fixed set of tools.

### Top Bar / Header

| Feature | innate-executable | Current Workbench |
|---|---|---|
| Component | `MenuBar` | `<header>` in WorkbenchShell |
| Content | Breadcrumbs, actions | Brand name, badges, settings button |
| Height | Standard | `h-11` (compact) |

**Verdict**: innate-executable's MenuBar is more conventional. Current workbench's header is minimal and clean.

### Terminal Integration

| Feature | innate-executable | Current Workbench |
|---|---|---|
| Terminal | ✅ xterm.js embedded | ❌ None |
| Position | Right panel or bottom | N/A |
| Toggle | Via store (Zustand) | N/A |

**Verdict**: innate-executable has a significant advantage for developer tooling. This is a unique feature worth preserving.

### Status Bar

| Feature | innate-executable | Current Workbench |
|---|---|---|
| Content | Platform detection, version | Git status, host info |
| Component | `StatusBar` | Inline footer div |

**Verdict**: Both are functional. innate-executable's platform badge is a nice touch.

### Content Area

| Feature | innate-executable | Current Workbench |
|---|---|---|
| Framework | Next.js pages (App Router) | Single-page React |
| Routing | File-based (`/tutorials`, `/learn`) | Tab switch (workspace/settings/qa) |
| Layout | `SidebarInset` with scroll | Grid-based panels |
| Preview | Tutorial markdown rendering | File tree + code preview |

**Verdict**: Different use cases. innate-executable is content/tutorial-focused. Current workbench is file/workspace-focused.

---

## Strengths & Weaknesses

### innate-executable Playground ✅

**Strengths**:
1. **Rich sidebar navigation** — collapsible groups, nested skills, auto-discovery
2. **Embedded terminal** — xterm.js with PTY support
3. **Course/tutorial system** — dynamic content scanning
4. **Next.js ecosystem** — SSR, file-based routing, font optimization
5. **Platform awareness** — detects macOS/Windows/Linux in status bar
6. **Zustand store** — clean state management with persistence

**Weaknesses**:
1. **Framework lock-in** — Next.js App Router makes it harder to embed in non-Next contexts
2. **Heavy dependencies** — Radix UI primitives, next-mdx-remote, recharts, etc.
3. **Nested monorepo** — adds complexity to outer monorepo integration
4. **No workbench concept** — lacks file browser, git integration, agent chat

### Current innate-desktop Workbench ✅

**Strengths**:
1. **Framework-agnostic** — Vite + React, easy to embed anywhere
2. **Compact density** — small icons, tight spacing (参考 qaworkspace)
3. **Workbench model** — file tree, preview, agent chat, git status
4. **Shared packages** — `@innate/ui`, `@innate/platform` reused across apps
5. **Theme provider** — light/dark/system mode switching
6. **Simpler dependencies** — Base UI is lighter than Radix

**Weaknesses**:
1. **No terminal** — missing embedded terminal
2. **Static sidebar** — no collapsible groups or nested navigation
3. **No content system** — no tutorial/course auto-discovery
4. **No menu bar** — less conventional desktop app feel

---

## Recommendations

### Short-term (keep both)
- Maintain both AppShells for their respective use cases
- Share Cargo target directory (already done)
- Consider extracting common Tauri commands to a shared Rust crate

### Medium-term (selective borrowing)
- **From innate-executable → Workbench**: Terminal panel integration
- **From Workbench → innate-executable**: Theme provider, compact sizing

### Long-term (unified shell)
- Abstract layout primitives (sidebar, header, panel, status bar)
- Create pluggable layout system where terminal/courses/workbench are optional panels
- Unify `@innate/ui` packages (migrate Radix → Base UI or vice versa)
