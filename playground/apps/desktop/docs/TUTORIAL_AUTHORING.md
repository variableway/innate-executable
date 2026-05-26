# 教程编写与导入指南

> 本文档说明 Innate Desktop 中教程（Skill/Tutorial）的存放位置、编写规范、导入方式以及教材来源管理。

---

## 目录

1. [教程原始文件放哪里](#1-教程原始文件放哪里)
2. [教程怎么写（MDX 规范）](#2-教程怎么写mdx-规范)
3. [有哪些可用的 MDX 组件](#3-有哪些可用的-mdx-组件)
4. [教程如何导入系统](#4-教程如何导入系统)
5. [默认内置教程的位置](#5-默认内置教程的位置)
6. [本地工作区教程](#6-本地工作区教程)
7. [教材来源与溯源](#7-教材来源与溯源)
8. [FAQ](#8-faq)

---

## 1. 教程原始文件放哪里

### 1.1 内置教程（Build-in）

内置教程随应用一起打包，用户开箱即用。

```
apps/innate-executable/playground/apps/desktop/public/skills/
├── openclaw-5min-experience.mdx
├── openclaw-search-summarize.mdx
├── install-git.mdx
├── ai-math-basics-part1.mdx
└── ...（更多 .mdx 文件）
```

**规则：**
- 所有 `.mdx` 或 `.md` 文件直接放在 `public/skills/` 目录下（**不能嵌套子目录**）
- 文件名即教程的 `slug`（URL 标识），如 `install-git.mdx` → `/tutorial/install-git`
- 以 `_` 开头的文件会被忽略（可用于草稿）

### 1.2 工作区本地教程（Workspace）

用户可以在自己的工作区中创建和管理教程。

```
<工作区目录>/
├── skills/
│   └── 我的自定义教程.mdx
├── lessons/
│   └── 团队内部分享.mdx
├── KM/
│   └── 知识库文档.mdx
└── Apps/
    └── 应用配置指南.mdx
```

**规则：**
- 工作区根目录及其子目录 `skills/`, `lessons/`, `KM/`, `Apps/` 都会被扫描
- 扫描深度最多 3 层
- 同样以 `_` 开头的文件会被忽略

### 1.3 教材来源目录（演示用）

本项目提供了一个专门的示例目录，用于说明和演示：

```
apps/innate-executable/playground/apps/desktop/docs/tutorial-examples/
├── README.md
├── 00-complete-example.mdx
└── 01-source-attribution-example.mdx
```

> ⚠️ **注意**：`docs/tutorial-examples/` 中的文件**不会被系统扫描加载**，仅作为编写参考和演示用途。如果要加入系统，需复制到 `public/skills/` 目录。

---

## 2. 教程怎么写（MDX 规范）

教程使用 **MDX** 格式（Markdown + JSX），每个文件由两部分组成：

### 2.1 Frontmatter（文件头元数据）

文件必须以 `---` 包裹的 YAML 元数据开头：

```mdx
---
title: "教程标题"
description: "一句话描述这个教程讲什么"
difficulty: beginner        # beginner | intermediate | advanced
duration: 15                # 预计学习时长（分钟）
category: ai-assistant      # 分类，用于自动归类课程
tags: ["openclaw", "入门"]   # 标签数组
---
```

**必填字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | string | 教程标题，显示在列表和页面顶部 |
| `description` | string | 简短描述，显示在卡片上 |
| `difficulty` | string | `beginner` / `intermediate` / `advanced` |
| `duration` | number | 预计学习分钟数 |
| `category` | string | 分类 ID，决定归属哪个课程系列 |

**可选字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `tags` | string[] | 标签数组，用于筛选和搜索 |
| `course` | string | 所属课程 ID（覆盖自动归类） |
| `courseOrder` | number | 在课程中的排序序号 |

**内置分类（category）与课程映射：**

| category | 自动归属课程 |
|----------|-------------|
| `ai-assistant` | AI 助手入门系列 |
| `ai-fundamentals` | AI 基础知识系列 |
| `dev-tools` | 开发环境搭建系列 |
| `general` 或其他 | 不自动归属课程 |

### 2.2 正文（Markdown + JSX）

Frontmatter 之后就是正文，支持标准 Markdown 语法和自定义 JSX 组件。

```mdx
---
title: "示例教程"
---

# 一级标题

普通段落文字。

## 二级标题

- 列表项一
- 列表项二

### 表格

| 列A | 列B |
|-----|-----|
| 内容1 | 内容2 |

### 普通代码块

```bash
# 这是一个普通的代码块，会被 Shiki 高亮显示
ls -la
```

### 可运行代码块

<RunnableCodeBlock code="npm install" language="bash" />

### 平台切换

<PlatformTabs
  unix={<RunnableCodeBlock code="curl example.com" language="bash" />}
  windows={<RunnableCodeBlock code="Invoke-RestMethod example.com" language="powershell" />}
/>
```

---

## 3. 有哪些可用的 MDX 组件

系统内置以下 JSX 组件，可在教程正文中直接使用：

### 3.1 `RunnableCodeBlock` — 可运行的代码块

带 **复制** 和 **运行** 按钮的代码块，代码会被发送到内置终端执行。

```mdx
<RunnableCodeBlock code="npm install -g typescript" language="bash" />
```

**Props：**

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `code` | string | - | 代码内容 |
| `language` | string | `"bash"` | 语言标识（影响高亮） |
| `runnable` | boolean | `true` | 是否显示运行按钮 |

**支持运行的语言：** `bash`, `sh`, `zsh`, `shell`, `python`, `python3`, `powershell`, `ps1`

### 3.2 `PlatformTabs` — 平台切换标签

为 macOS/Linux 和 Windows 提供不同的命令示例。

```mdx
<PlatformTabs
  unix={<RunnableCodeBlock code="curl -fsSL https://example.com/install.sh | bash" language="bash" />}
  windows={<RunnableCodeBlock code="irm https://example.com/install.ps1 | iex" language="powershell" />}
/>
```

**Props：**

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `unix` | ReactNode | - | macOS / Linux 内容 |
| `windows` | ReactNode | - | Windows 内容 |
| `defaultPlatform` | `"unix" \| "windows"` | `"unix"` | 默认选中的平台 |

### 3.3 `RunButton` — 单行命令运行按钮

一个醒目的运行按钮，适合单个命令的执行场景。

```mdx
<RunButton command="claw --version" />
```

**Props：**

| Prop | 类型 | 说明 |
|------|------|------|
| `command` | string | 要执行的命令 |

### 3.4 普通 Markdown 代码块

不使用 JSX 组件的普通 fenced code block 也会自动获得 Shiki 语法高亮：

````md
```python
# 普通代码块，高亮但不可运行
print("Hello, World!")
```
````

**支持的 Markdown 语法：**
- 标题 `#` ~ `######`
- 列表（有序/无序）
- 表格（GFM 扩展）
- 引用块 `>`
- 行内代码 `` `code` ``
- 链接 `[text](url)`
- 分隔线 `---`
- 任务列表 `- [ ]` / `- [x]`（GFM）

---

## 4. 教程如何导入系统

### 4.1 自动导入流程（内置教程）

```
1. 将 .mdx 文件放入 public/skills/
        ↓
2. 运行 manifest 生成脚本
        ↓
3. 重新构建应用
        ↓
4. 教程自动出现在 /tutorials 和 /courses 页面
```

**生成 manifest：**

```bash
# 在 desktop 目录下执行
node scripts/generate-skills-manifest.mjs
```

这会扫描 `public/skills/` 目录，解析所有 `.mdx/.md` 文件的 frontmatter，生成 `public/skills-manifest.json`。manifest 包含：
- 所有教程的元数据列表
- 自动按 category 归组的课程定义

**构建：**

```bash
pnpm next build
```

构建时会根据 manifest 中的 `slug` 列表，为每个教程生成静态页面（SSG）。

### 4.2 动态导入（工作区教程）

工作区中的教程不需要重新构建应用：

1. 用户在工作区目录中创建 `.mdx` 文件
2. 系统在运行时自动扫描工作区的 `skills/`、`lessons/` 等目录
3. 教程即时出现在「我的工作区」→「技能」列表中

### 4.3 从教材来源目录导入

如果你从 `docs/tutorial-examples/` 中开发了新教程，想正式发布：

```bash
# 复制到内置教程目录
cp docs/tutorial-examples/我的新教程.mdx public/skills/

# 重新生成 manifest
node scripts/generate-skills-manifest.mjs

# 重新构建
pnpm next build
```

---

## 5. 默认内置教程的位置

当前默认内置了 **14 个教程**，位于：

```
public/skills/
├── ai-causal-inference.mdx              # 因果推断基础
├── ai-cognitive-science.mdx             # 认知科学入门
├── ai-cybernetics-complexity.mdx        # 控制论与复杂性
├── ai-interdisciplinary-journey.mdx     # AI 跨学科之旅
├── ai-math-basics-part1.mdx             # AI 数学基础（上）
├── ai-math-basics-part2.mdx             # AI 数学基础（下）
├── install-claude-code-glm5-deepseek-v4.mdx  # 安装 Claude Code
├── install-git.mdx                      # 安装 Git
├── install-kimi-cli.mdx                 # 安装 Kimi CLI
├── install-nodejs.mdx                   # 安装 Node.js
├── openclaw-5min-experience.mdx         # OpenClaw 5分钟体验
├── openclaw-custom-skills.mdx           # 自定义技能
├── openclaw-email-calendar.mdx          # 邮件和日程
└── openclaw-search-summarize.mdx        # 搜索和总结
```

这些教程在构建时被打包进应用，用户无需联网即可查看。

---

## 6. 本地工作区教程

### 6.1 工作区目录结构

当用户创建工作区时，系统会自动创建以下子目录：

```
<工作区路径>/
├── skills/     # 技能/教程文件
├── Apps/       # 应用程序相关
├── KM/         # 知识库（Knowledge Management）
└── lessons/    # 课程/学习资料
```

### 6.2 编写工作区教程

在工作区中编写教程与内置教程**格式完全一致**，也是 MDX 格式：

```mdx
---
title: "团队内部部署指南"
description: "如何在团队环境中部署 Innate"
difficulty: intermediate
duration: 30
category: dev-tools
tags: ["部署", "团队", "DevOps"]
---

# 团队内部部署指南

## 前置条件

...
```

将文件保存到工作区的 `skills/` 或 `lessons/` 目录即可自动识别。

### 6.3 工作区教程的加载优先级

当用户打开 `/tutorial/<slug>` 时，加载顺序为：

1. **先查工作区**：如果当前工作区中有同名的 `.mdx` 或 `.md` 文件，优先加载
2. **再查内置**：如果没有找到，从 `public/skills/` 中加载

这意味着用户可以通过在工作区中放置同名文件来**覆盖**内置教程。

---

## 7. 教材来源与溯源

### 7.1 为什么要标注来源

教程内容可能来自：
- 官方文档翻译/改编
- 社区博客文章
- 书籍章节摘录
- 视频教程的文字版
- 团队内部知识沉淀

标注来源有助于：
- 尊重原创作者
- 方便用户追溯更详细的资料
- 维护教程的时效性（原始资料更新时跟进）

### 7.2 来源标注规范

建议在 frontmatter 中增加 `sources` 字段，在文末增加「参考来源」章节：

```mdx
---
title: "xxx"
description: "xxx"
difficulty: beginner
duration: 15
category: general
tags: ["xxx"]
sources:
  - name: "原始文章标题"
    url: "https://example.com/original-article"
    author: "作者名"
    license: "CC-BY-4.0"
  - name: "官方文档"
    url: "https://docs.example.com"
    author: "Example Inc."
    license: "MIT"
---

# 正文...

---

## 参考来源

1. [原始文章标题](https://example.com/original-article) — 作者名，CC-BY-4.0
2. [官方文档](https://docs.example.com) — Example Inc.

*本教程基于上述资料整理改编，如有错误或过时内容，欢迎反馈。*
```

### 7.3 示例教材来源目录

本项目在以下目录提供了示例教材：

```
docs/tutorial-examples/
├── README.md                    # 本目录说明
├── 00-complete-example.mdx          # 展示所有 MDX 组件用法
└── 01-source-attribution-example.mdx          # 展示来源标注规范
```

这些示例文件展示了：
- 如何编写 frontmatter
- 如何使用各种 MDX 组件
- 如何标注教材来源
- 如何组织教程结构

> 💡 **提示**：可以将 `docs/tutorial-examples/` 作为你自己的教程模板库，复制其中的文件作为起点进行修改。

---

## 8. FAQ

### Q: 教程文件名有什么要求？

文件名就是 URL 中的 `slug`，建议使用：
- 小写字母和连字符，如 `install-nodejs.mdx`
- 不要使用中文或特殊字符
- 确保唯一性，避免冲突

### Q: 可以嵌套子目录吗？

**内置教程**：不可以，所有文件必须直接放在 `public/skills/` 下。

**工作区教程**：可以，但扫描深度最多 3 层。

### Q: 修改教程后需要重新构建吗？

- **内置教程**：是的，需要重新运行 `generate-skills-manifest.mjs` 并重新构建
- **工作区教程**：不需要，修改后立即生效

### Q: 可以引用本地图片吗？

可以，将图片放在 `public/` 目录下，然后在 MDX 中：

```mdx
![图片描述](/images/my-image.png)
```

### Q: 教程中的代码块会自动高亮吗？

是的，系统使用 **Shiki** 进行语法高亮，支持所有主流编程语言。普通 fenced code block（```` ``` ````）和 `RunnableCodeBlock` 组件都会自动高亮。

### Q: 如何让教程出现在课程页面中？

只要设置正确的 `category`，运行 `generate-skills-manifest.mjs` 后会自动按 category 分组生成课程。也可以手动在 `scripts/generate-skills-manifest.mjs` 的 `COURSE_TEMPLATES` 中添加新课程模板。

### Q: 可以同时存在同名的内置教程和工作区教程吗？

可以，工作区教程会**优先**加载。这允许用户自定义覆盖内置教程。

---

*文档版本：2026-05-26*
*对应应用版本：Innate Desktop Playground*
