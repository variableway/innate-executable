# 共享 Cargo Target，独立 Frontend

## 架构原则

Innate Executable 与 innate-desktop-mono 共享同一个 Cargo Workspace，但保持独立的 Frontend 构建流程。

```
innate-desktop-mono/                    # Git repo root
├── Cargo.toml                          # Cargo workspace (共享)
│   ├── members:
│   │   ├── apps/desktop/src-tauri          # innate-desktop
│   │   └── apps/innate-executable/
│   │       └── playground/apps/desktop/
│   │           └── src-tauri               # innate-playground ← 共享
│   └── [workspace.dependencies]          # 公共 Rust 依赖
│
├── .cargo/config.toml                  # 统一 target-dir = "target"
│
├── target/                             # 共享编译产物 (~2GB)
│   ├── debug/
│   └── release/
│
├── apps/desktop/                       # Vite + React frontend
│   └── src-tauri/
│
└── apps/innate-executable/
    ├── package.json                    # 集成入口脚本
    ├── Taskfile.yml                    # 任务管理 (可选)
    ├── README.md                       # 集成说明
    ├── INTEGRATION.md                  # 集成策略
    └── playground/                     # 独立 monorepo
        ├── package.json
        ├── pnpm-workspace.yaml         # 自己的 workspace
        ├── apps/desktop/               # Next.js frontend (独立)
        │   ├── src/                    # Next.js App Router
        │   └── src-tauri/              # Rust backend (共享 target)
        └── packages/
            ├── ui/                     # Radix UI 组件库
            ├── utils/                  # 工具库
            └── tsconfig/
```

## 为什么这样设计

### 共享 Cargo Target

Rust 编译产物非常占空间。两个 Tauri 桌面应用如果各自维护 `target/`，磁盘占用会翻倍。

| 方案 | 磁盘占用 | 说明 |
|---|---|---|
| 独立 target | ~4GB (2×2GB) | 每个项目各自编译 |
| 共享 target | ~2GB | 公共 crate 只编译一次 |

**配置方式**：

1. 根目录 `.cargo/config.toml` 设置全局 target 目录：
   ```toml
   [build]
   target-dir = "target"
   ```

2. 根目录 `Cargo.toml` 注册两个 workspace member：
   ```toml
   [workspace]
   members = [
       "apps/desktop/src-tauri",
       "apps/innate-executable/playground/apps/desktop/src-tauri",
   ]
   ```

3. `innate-playground` 的 `Cargo.toml` 使用 workspace 依赖：
   ```toml
   [dependencies]
   serde_json = { workspace = true }
   serde = { workspace = true }
   log = { workspace = true }
   tauri = { workspace = true }
   ```

### 独立 Frontend

Frontend 不共享，原因：

1. **框架不同**：innate-desktop 用 Vite + React，innate-playground 用 Next.js
2. **组件库不同**：innate-desktop 用 Base UI，innate-playground 用 Radix UI
3. **路由方式不同**：Vite 是 SPA，Next.js 是文件路由 + App Router
4. **构建产物不同**：Vite → `dist/`，Next.js → `out/`

强行统一 Frontend 会导致大量重构，收益远低于成本。

## 使用方式

### 方式一：作为 monorepo 成员运行（推荐日常开发）

```bash
# 从 repo root
cd apps/innate-executable

# 查看可用任务
cd playground/apps/desktop && task --list-all

# 启动开发（Next.js + Tauri，共享 target）
task dev

# 完整构建
task default

# 仅构建前端
task build-frontend

# 仅构建 Tauri
task build-tauri
```

### 方式二：独立运行（保持隔离）

```bash
# 进入 playground 子目录
cd apps/innate-executable/playground

# 独立安装依赖
pnpm install

# 启动 Next.js（仅前端）
pnpm dev

# 启动 Tauri（带 Rust 后端）
pnpm --filter desktop tauri dev
```

**注意**：独立运行时，如果根目录没有 `target/`，Cargo 会在 `playground/apps/desktop/src-tauri/target/` 创建新的 target 目录。为避免这种情况，建议始终从 repo root 运行，或手动设置 `CARGO_TARGET_DIR`：

```bash
export CARGO_TARGET_DIR="$(pwd)/../../../target"
```

## 常见问题

### Q: 两个项目会互相干扰吗？

**不会**。Cargo workspace 中每个 crate 有独立的 `name` 和输出文件名：
- `apps/desktop/src-tauri` → crate name: `innate_desktop`
- `apps/innate-executable/.../src-tauri` → crate name: `innate-playground`

编译产物在 `target/` 中按 crate 名称分目录存放。

### Q: 更新 workspace 依赖会影响 innate-playground 吗？

**会，但这是设计意图**。Workspace 统一管理 `serde`、`tauri` 等公共依赖的版本，确保两个 Tauri 应用使用兼容的 Rust crate 版本。

如果 innate-playground 需要特定版本的依赖（如 `tauri-plugin-log`），可以在其 `Cargo.toml` 中保留独立版本：
```toml
tauri-plugin-log = "2"   # 不在 workspace.dependencies 中，独立指定
```

### Q: 如何清理共享 target？

```bash
# 从 repo root
cargo clean

# 这会清理整个 target/ 目录，影响两个项目
```

如果只想清理一个项目：
```bash
# 清理 innate-desktop 的编译产物
cargo clean -p innate_desktop

# 清理 innate-playground 的编译产物
cargo clean -p innate-playground
```
