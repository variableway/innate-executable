# Setup Innate Exectuble for AI Learning

## Task 1: 请清空目前所有的任务

### ✅ 1. 清空目前所有的任务

已将所有旧任务归档到 `tasks/archive/` 目录：
- `0-overview.md`
- `0-setup/`
- `1-edu/`
- `analysis/`
- `config/`
- `features/`
- `mindstorm/`
- `plan.md`
- `planning/`
- `prd/`
- `tracing/`

当前 `tasks/` 目录仅保留：
- `archive/` — 归档的旧任务
- `issues/0-setup.md` — 本任务文件
- `tutorial-development-workflow.md` — 新产出：教程开发编排步骤
- `workspace-plan.md` — 新产出：Workspace 功能规划

---

### ✅ 2. Tutorial 开发编排步骤

文档位置：`tasks/tutorial-development-workflow.md`

核心步骤（7 步）：
1. **需求分析与选题** — 确定目标用户、平台、耗时、前置依赖
2. **脚本开发** — 编写跨平台、幂等、带验证的安装/配置脚本（`scripts/install/` 或 `scripts/configure/`）
3. **文档编写** — 按模板编写中文 Markdown 教程（`docs/guides/<category>/`）
4. **Skill 定义** — 创建结构化 JSON Skill 文件（`skills/<level>/<id>.json`）
5. **桌面应用集成** — 在 `useAppStore` 中注册教程数据，更新卡片和详情组件
6. **测试验证** — 脚本测试、文档测试、应用测试、跨平台测试
7. **发布与迭代** — 更新 README / GETTING-STARTED，收集反馈，定期维护

---

### ✅ 3. Workspace 功能规划与草图

#### 规划文档
文档位置：`tasks/workspace-plan.md`

#### 设计目标
在一个页面内完成教程的**浏览、学习、执行、创建和管理**所有操作，消除当前多页面切换的割裂感。

#### 布局设计（5 大区）
| 区域 | 功能 |
|------|------|
| **顶部工具栏** | 搜索、全局运行/停止、进度概览、设置 |
| **左侧边栏** | 系列目录树 + 课程管理（可折叠） |
| **主内容区** | Markdown 渲染 + 可执行步骤卡片 + 进度指示 |
| **右侧面板** | 终端输出 / 预览 / 日志（可折叠） |
| **底部状态栏** | 当前教程、平台、耗时、步骤完成数 |

#### 草图代码
组件位置：`apps/desktop/src/components/workspace/WorkspaceSketch.tsx`

已集成到应用导航：
- 在 `Header` 中新增「工作台」Tab
- 在 `App.tsx` 中新增 `workspace` 视图路由
- 运行应用后，点击顶部导航栏「工作台」即可查看草图

#### 实现阶段
- **Phase 1（MVP）**：三栏布局、目录树、步骤执行、终端联动
- **Phase 2（增强）**：课程管理、面板标签页、全局运行、步骤依赖检查
- **Phase 3（高级）**：执行历史、教程内搜索、多终端分屏、布局持久化

---

## 下一步建议

1. **运行桌面应用**：`cd apps/desktop && npm run dev`（或 `pnpm dev`），点击「工作台」查看草图效果
2. **评审 Workspace 草图**：根据实际视觉效果调整布局比例和交互细节
3. **确定 Phase 1 开发排期**：将 MVP 功能拆解为具体的开发任务

## Task 2: 请更新代码到playground/app/desktop 目录中

### ✅ 1. 代码同步到 playground/apps/desktop

**分析结论**：`playground/apps/desktop` 是当前主项目，采用 **Next.js App Router + Tauri v2 + shadcn/ui** 架构，比根目录 `apps/desktop`（Vite + React）更完善：

| 模块 | 说明 |
|------|------|
| `app/` | Next.js App Router 页面路由 |
| `components/layout/` | AppShell（侧边栏+菜单栏+终端+状态栏） |
| `components/workspace/` | 工作区组件（已有文件管理工作区 workspace-page.tsx） |
| `store/useAppStore.ts` | Zustand + persist，含终端、工作区、教程扫描状态 |
| `lib/` | 教程扫描器（scanBuiltin / scanWorkspace）— 当前缺失，为已知问题 |
| `src-tauri/` | Tauri v2 Rust 后端，含 PTY 终端支持 |

**同步内容**：
- `playground/apps/desktop/tasks/tutorial-development-workflow.md` — 教程开发编排步骤
- `playground/apps/desktop/tasks/workspace-plan.md` — Workspace 功能规划
- `playground/apps/desktop/src/components/workspace/tutorial-workspace-sketch.tsx` — 适配后的 All-in-One 教程学习工作台草图（使用 `@innate/ui` + Tailwind v4 语义化类名）
- `playground/apps/desktop/src/app/learn/page.tsx` — 新的「学习工作台」页面路由
- `playground/apps/desktop/src/components/layout/app-sidebar.tsx` — 侧边栏新增「学习工作台」导航入口

**关键适配**：
- 样式系统从自定义类名（`bg-bg-primary`、`text-text-primary`）迁移到 shadcn/ui 语义化类名（`bg-background`、`text-foreground`）
- 按钮使用 `@innate/ui` 的 `<Button>` 组件
- 布局集成到现有 AppShell（侧边栏、终端面板、状态栏已存在，无需重复实现）

### ✅ 2. 更新一键启动脚本

| 脚本 | 更新内容 |
|------|----------|
| `start-playground.sh` | 增加依赖检查（node、pnpm、cargo）、条件安装（仅在 node_modules 缺失时安装）、更友好的中文提示 |
| `start-playground.bat` | 增加依赖检查（node、pnpm、cargo/ServBay）、条件安装、中文提示 |

### ✅ 3. playground 代码分析

**架构特点**：
1. **All-in-One 布局已基本成型**：AppShell 已包含侧边栏导航（课程/技能树）、顶部菜单栏、可切换位置的终端面板、底部状态栏
2. **教程内容自动发现**：通过 `scanBuiltin()` 扫描内置教程，`scanWorkspace()` 扫描用户工作区教程，合并去重后展示
3. **终端集成深度**：通过 Tauri PTY 命令 `pty_write` 实现真实 shell 交互，支持工作区路径自动 `cd`
4. **状态持久化**：Zustand persist 使用 `tauriStorage`，保存工作区列表、学习进度、默认工作区

**已知问题**（项目原有）：
- `src/lib/tutorial-scanner.ts` 模块缺失，导致 `admin/courses`、`courses/detail` 等页面编译报错
- 部分页面（`series/[id]`、`tutorial-mdx/[slug]`、`admin/lesson`）在 `.next/types` 中有引用但源文件不存在
- 多个组件中存在隐式 `any` 类型

> 上述问题不影响本次同步的文件，`learn` 页面和 `tutorial-workspace-sketch` 组件编译无新增错误。

---

### 运行方式

```bash
# Mac/Linux
./start-playground.sh

# Windows
start-playground.bat
```

启动后点击侧边栏「学习工作台」即可查看同步后的草图效果。
