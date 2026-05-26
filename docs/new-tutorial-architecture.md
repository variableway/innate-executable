# 新建可执行教程系统的架构建议

> 前提：同时支持 Web + 桌面（Tauri），内容用 MDX 文件，状态用数据存储。

---

## 1. 核心决策：为什么不用 Next.js

如果重新创建，建议用 **Vite + React**，而非 Next.js。

| 对比 | Next.js | Vite + React |
|---|---|---|
| 与 monorepo 统一 | ❌ 不一致 | ✅ 和 innate-desktop 相同 |
| SSR/SSG | ✅ 强（但桌面端无用） | ❌ 无（不需要） |
| 路由 | 文件路由（自然适合教程） | react-router-dom（手动配置） |
| MDX | `next-mdx-remote` | `@mdx-js/rollup` |
| Tauri 适配 | 需要额外配置 | 原生支持 |
| Web 部署 | 需要服务器 | 纯静态文件（CDN） |
| 构建速度 | 慢 | 快 |

Next.js 的文件路由确实适合教程，但这个优势不值得为此承受整个框架的差异。Vite 可以用 **约定式路由插件** 或简单的文件扫描来实现类似效果。

---

## 2. 推荐技术栈

```
Frontend
├── Vite 6 + React 19          # 与 monorepo 统一
├── react-router-dom           # 路由（教程章节导航）
├── @mdx-js/rollup             # MDX 编译（Vite 插件）
├── @innate/ui                 # 共享 UI 组件库（Base UI）
├── Zustand                    # 状态管理
├── lucide-react               # 图标
└── Tailwind CSS v4            # 样式

Code Execution
├── Web 模式: @webcontainer/api   # 浏览器内运行 Node.js
├── 桌面模式: xterm.js + PTY      # 本地终端（Tauri sidecar）

Storage
├── Web 模式: localStorage / IndexedDB
├── 桌面模式: tauri-plugin-store
└── 抽象层: 统一 Storage API，底层自动切换

Tauri (桌面端)
├── tauri-plugin-shell         # 执行本地命令
├── tauri-plugin-dialog        # 文件选择
├── tauri-plugin-fs            # 文件系统
├── tauri-plugin-store         # 本地存储
└── portable-pty               # 伪终端
```

---

## 3. 项目结构

```
apps/tutorial/                    # 新教程应用
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── public/
│   └── tutorials/               # 静态教程资源（图片、数据）
├── src/
│   ├── main.tsx                 # 入口
│   ├── App.tsx                  # 根组件
│   ├── router.tsx               # react-router 配置
│   ├── index.css                # Tailwind 入口
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx     # 应用外壳（参考 innate-executable）
│   │   │   ├── Sidebar.tsx      # 教程导航侧边栏
│   │   │   ├── MenuBar.tsx      # 顶部菜单
│   │   │   ├── TerminalPanel.tsx # 终端面板（右/下）
│   │   │   └── StatusBar.tsx    # 底部状态栏
│   │   ├── tutorial/
│   │   │   ├── TutorialView.tsx # 教程内容渲染
│   │   │   ├── CodeBlock.tsx    # 可执行代码块
│   │   │   ├── RunButton.tsx    # 运行按钮
│   │   │   └── ProgressTracker.tsx # 进度追踪
│   │   └── terminal/
│   │       ├── Terminal.tsx     # xterm.js 封装
│   │       └── WebContainer.tsx # WebContainer 封装
│   │
│   ├── hooks/
│   │   ├── useTutorials.ts      # 教程数据加载
│   │   ├── useProgress.ts       # 学习进度管理
│   │   ├── useTerminal.ts       # 终端生命周期
│   │   └── useStorage.ts        # 存储抽象（Web/桌面切换）
│   │
│   ├── lib/
│   │   ├── tutorial-loader.ts   # MDX 文件扫描和加载
│   │   ├── storage.ts           # 存储抽象层
│   │   └── platform.ts          # 平台检测（Web vs Desktop）
│   │
│   ├── store/
│   │   └── useTutorialStore.ts  # Zustand store
│   │
│   ├── types/
│   │   └── tutorial.ts          # Tutorial, Skill, Course 类型
│   │
│   └── tutorials/               # 教程内容（MDX 文件）
│       ├── index.mdx            # 教程目录
│       ├── getting-started/
│       │   ├── intro.mdx
│       │   └── setup.mdx
│       └── advanced/
│           └── ...
│
└── src-tauri/                   # Tauri 桌面端（仅桌面模式需要）
    ├── Cargo.toml
    ├── tauri.conf.json
    └── src/
        └── lib.rs
```

---

## 4. 关键设计：双模式运行

### 4.1 平台检测

```ts
// lib/platform.ts
export const isDesktop = "__TAURI_INTERNALS__" in window;
export const isWeb = !isDesktop;
```

### 4.2 存储抽象

```ts
// lib/storage.ts
export const storage = {
  async get(key: string) {
    if (isDesktop) {
      // tauri-plugin-store
      return await invoke("store_get", { key });
    }
    return localStorage.getItem(key);
  },
  async set(key: string, value: string) {
    if (isDesktop) {
      return await invoke("store_set", { key, value });
    }
    localStorage.setItem(key, value);
  },
};
```

### 4.3 终端抽象

```tsx
// components/terminal/TerminalHost.tsx
export function TerminalHost() {
  if (isDesktop) {
    return <PtyTerminal />;   // xterm.js + PTY
  }
  return <WebContainerTerminal />;  // WebContainer
}
```

### 4.4 代码执行策略

| 场景 | Web 模式 | 桌面模式 |
|---|---|---|
| JavaScript/Node.js | WebContainer | 本地 Node.js |
| Shell 命令 | WebContainer (模拟) | 真实 Shell (PTY) |
| 文件操作 | 虚拟文件系统 | 真实文件系统 |
| 网络请求 | 浏览器 fetch | 真实网络 |

---

## 5. MDX 教程系统

### 5.1 内容格式

```mdx
---
title: "Hello World"
course: "getting-started"
order: 1
difficulty: "beginner"
---

# Hello World

这是一个可执行教程。点击下面的代码块可以运行。

<Runnable language="javascript">
{`
console.log("Hello, World!");
`}
</Runnable>

## 练习

修改上面的代码，输出你的名字。

<Exercise id="hello-name" hint="使用 console.log('Your Name')">
  <Solution>
  {`console.log("Alice");`}
  </Solution>
</Exercise>
```

### 5.2 文件扫描

```ts
// lib/tutorial-loader.ts
export async function loadTutorials() {
  // Vite 的 import.meta.glob 可以自动扫描 MDX 文件
  const modules = import.meta.glob("../tutorials/**/*.mdx", { eager: true });

  return Object.entries(modules).map(([path, module]) => ({
    path,
    frontmatter: module.frontmatter,
    Component: module.default,
  }));
}
```

### 5.3 与 innate-executable 的对比

| 特性 | innate-executable (Next.js) | 新系统 (Vite) |
|---|---|---|
| 文件扫描 | Node.js fs (build 时) | `import.meta.glob` (build 时) |
| MDX 渲染 | `next-mdx-remote` | `@mdx-js/rollup` + React |
| 路由 | 文件路由 (`/tutorial/[id]`) | react-router (`/tutorial/:id`) |
| 组件注册 | 全局 MDX components | 全局 MDX components |

---

## 6. 复用 innate-executable 的资产

### 直接复用（复制/引用）

1. **AppShell 布局逻辑** — `app-shell.tsx` 的 SidebarProvider + SidebarInset + MenuBar + TerminalPanel + StatusBar 结构
2. **AppSidebar 导航** — 课程/技能的分组折叠逻辑
3. **终端面板** — `TerminalPanel.tsx` + `terminal-view.tsx` 的 xterm.js 封装
4. **教程扫描器** — `tutorial-scanner.ts` 的内容发现逻辑
5. **Zustand store** — `useAppStore.ts` 的状态管理结构

### 适配修改

1. **Next.js API → Vite 静态加载**
   - `next/navigation` → `react-router-dom`
   - `next/font` → 手动引入字体 CSS
   - `next/head` → `react-helmet-async` 或手动 `<head>`

2. **Radix UI → Base UI**
   - `Sidebar` 组件来自 `@innate/ui`（已共享）
   - `Collapsible` 等组件也已在 `@innate/ui` 中

---

## 7. 在 monorepo 中的位置

推荐位置：`apps/tutorial/`（与 `apps/desktop/`、`apps/web/` 同级）

```
apps/
├── desktop/           # AI Agent Workbench
├── web/               # Web 版 Workbench
└── tutorial/          # 可执行教程系统（新）
    ├── package.json
    ├── vite.config.ts
    ├── src/
    └── src-tauri/     # Tauri 桌面端（可选，如果要桌面版）
```

**不需要**像 innate-executable 那样嵌套一个 playground monorepo。直接使用外层 monorepo 的 `pnpm-workspace.yaml`。

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/desktop"
  - "apps/web"
  - "apps/tutorial"    # ← 新增
  - "packages/*"
```

---

## 8. 实施步骤

### Phase 1: 脚手架（1 天）
1. 创建 `apps/tutorial/` 目录
2. 配置 Vite + React + Tailwind v4
3. 配置 react-router-dom
4. 配置 `@mdx-js/rollup`
5. 引入 `@innate/ui`

### Phase 2: 布局（1-2 天）
1. 复制/适配 innate-executable 的 AppShell
2. 配置 Sidebar + MenuBar + StatusBar
3. 添加 ThemeProvider（复用 `@innate/ui`）

### Phase 3: 教程系统（2-3 天）
1. MDX 文件扫描和加载
2. 教程渲染组件
3. 代码块执行（先实现 WebContainer 版本）
4. 进度追踪和存储

### Phase 4: 桌面适配（1-2 天）
1. 添加 `src-tauri/`
2. 实现存储抽象（tauri-plugin-store）
3. 实现 PTY 终端（桌面模式）
4. 构建和测试

### Phase 5: 内容迁移（1-2 天）
1. 把 innate-executable 的教程内容转为新格式
2. 验证所有可执行代码块

**总估算：1-2 周**

---

## 9. 为什么不直接改造 innate-executable

改造现有项目 vs 重新创建：

| 方案 | 工作量 | 结果质量 | 长期维护 |
|---|---|---|---|
| 改造 innate-executable | 大（Next.js → Vite，Radix → Base UI） | 可能有历史包袱 | 仍然有两套 UI |
| 重新创建 | 中（复用逻辑，新架构） | 干净、一致 | 统一技术栈 |

**建议：重新创建**。innate-executable 的 Next.js + Radix UI 架构和 monorepo 差异太大，改造工作量接近重写。重新创建可以：
1. 完全复用 `@innate/ui`
2. 统一构建工具（Vite）
3. 双模式设计（Web + 桌面）从一开始就内置
4. 更干净的代码，没有历史包袱
