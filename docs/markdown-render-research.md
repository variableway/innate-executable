# Markdown 渲染方案调研

> 目标：改善 innate-executable 教程的阅读体验，同时保持易创作、易维护。

---

## 当前方案的问题

 innate-executable 目前有两套渲染系统：

| 场景 | 库 | 问题 |
|---|---|---|
| `.mdx` 教程 | `next-mdx-remote` + `serialize()` | 异步序列化开销大，需要复杂的 `{}` 转义逻辑，容易解析出错 |
| `.md` 教程 | `react-markdown` + `remark-gfm` | 无语法高亮，组件映射和 MDX 端重复维护 |
| 代码块 | 纯文本 `<code>` | 没有语法高亮，阅读体验差 |

**核心痛点**：
1. **两套系统** → 维护成本高（组件映射在 `tutorial-markdown.tsx` 和 `client.tsx` 中重复）
2. **无语法高亮** → 代码块是白底黑字，对编程教程来说体验很差
3. **MDX 序列化脆弱** → `serialize()` 遇到 `{}` 或特殊字符会崩溃，需要手动转义
4. **运行时编译** → 每次打开教程都要编译 MDX，有延迟

---

## 调研方案

### 方案 1：Shiki 语法高亮（最推荐）

**Shiki** 是 VS Code 的语法高亮引擎，2024-2025 年已成为前端 Markdown 渲染的事实标准。

```bash
npm install shiki @shikijs/rehype
```

**优点**：
- 渲染效果 = VS Code 同款，180+ 主题
- 支持行号、高亮行、diff 标记
- 支持 `rehype` 插件，和 `react-markdown` / MDX 无缝集成
- 编译时生成（SSR）或运行时生成均可
- 支持 wasm，在浏览器中也能运行

**缺点**：
- wasm 文件需要加载（~300KB），首次渲染有延迟
- 主题文件也需要加载

**使用方式**：

```ts
import { createHighlighter } from 'shiki'
import { transformerMetaHighlight } from '@shikijs/transformers'

const highlighter = await createHighlighter({
  themes: ['github-dark', 'github-light'],
  langs: ['javascript', 'typescript', 'bash', 'python', 'rust'],
})

const html = highlighter.codeToHtml(code, {
  lang: 'bash',
  theme: 'github-dark',
  transformers: [transformerMetaHighlight()],
})
```

**和 react-markdown 集成**：

```tsx
import ReactMarkdown from 'react-markdown'
import { createHighlighter } from 'shiki'

const highlighter = await createHighlighter({ themes: ['github-dark'], langs: ['bash', 'js'] })

function CodeBlock({ children, className }) {
  const code = String(children).trim()
  const lang = className?.replace('language-', '') || 'text'
  const html = highlighter.codeToHtml(code, { lang, theme: 'github-dark' })
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

<ReactMarkdown components={{ code: CodeBlock }}>{content}</ReactMarkdown>
```

---

### 方案 2：统一 MDX 渲染管道

**核心思路**：放弃 `react-markdown`，所有 `.md` 和 `.mdx` 都走 MDX 管道。`.md` 就是没有 JSX 的普通 Markdown。

**工具链**：

```bash
npm install @mdx-js/mdx @mdx-js/react
```

**构建时编译**（Next.js 中推荐）：

```ts
// lib/mdx.ts
import { compileMDX } from 'next-mdx-remote/rsc'  // Server Component 版本
import { RunnableCodeBlock, PlatformTabs } from '@/components/tutorial'

const components = { RunnableCodeBlock, PlatformTabs }

export async function renderMDX(source: string) {
  const { content, frontmatter } = await compileMDX({
    source,
    components,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [[rehypeShiki, { theme: 'github-dark' }]],
      },
    },
  })
  return { content, frontmatter }
}
```

**优点**：
- 一套组件映射，统一处理 `.md` 和 `.mdx`
- 构建时编译，无运行时序列化开销
- 可以用 Next.js Server Component（RSC），数据获取和渲染都在服务端

**缺点**：
- 需要 Next.js App Router + RSC 支持
- 教程内容在编译期确定，运行时从文件系统读取的需要不同处理

---

### 方案 3：Markdoc（Stripe 开源）

```bash
npm install @markdoc/markdoc @markdoc/next.js
```

Markdoc 是 Stripe 文档站使用的 Markdown 扩展，专门为结构化文档设计。

**优点**：
- 严格的标签系统，不容易像 MDX 那样因语法错误而崩溃
- 内置验证（可以定义 schema，检查标签属性）
- 适合团队协作文档，有规范约束

**缺点**：
- 不支持 JSX（无法直接用 `<RunnableCodeBlock>`）
- 语法和 MDX 不同，学习成本
- 生态比 MDX 小得多

**结论**：不适合 innate-executable。MDX 的 JSX 组件是教程的核心（可执行代码块、平台切换），Markdoc 不支持 JSX。

---

### 方案 4：Notion / Outline 等 SaaS 方案

如果教程内容需要**非技术人员**也能编辑，可以考虑：

| 方案 | 优点 | 缺点 |
|---|---|---|
| **Notion** + API | 编辑体验极佳，非技术人员友好 | 依赖网络，无法本地编辑，数据不在自己手上 |
| **Outline** (开源) | 自托管，类似 Notion | 需要部署服务器，架构复杂 |
| **GitBook** | 专为文档设计 | 商业产品，自定义受限 |

**结论**：对于 innate-executable 这种**本地优先**的桌面应用，SaaS 方案不合适。但如果未来要做 Web 版教程站，可以考虑 Notion 作为 CMS。

---

## 推荐方案：Shiki + 统一 MDX 管道

### 架构

```
教程文件 (.md / .mdx)
    ↓
[next-mdx-remote/rsc]  构建时编译 (Server Component)
    ↓
[remark-gfm]          GitHub Flavored Markdown
    ↓
[rehype-shiki]        语法高亮 (Shiki)
    ↓
[自定义组件映射]       RunnableCodeBlock, PlatformTabs, ...
    ↓
React 组件树
```

### 为什么选这个方案

| 维度 | 评分 | 说明 |
|---|---|---|
| 渲染效果 | ⭐⭐⭐⭐⭐ | Shiki = VS Code 同款高亮 |
| 性能 | ⭐⭐⭐⭐⭐ | 构建时编译，无运行时开销 |
| 易创作 | ⭐⭐⭐⭐ | 写教程的人仍然写 Markdown/MDX，无变化 |
| 易维护 | ⭐⭐⭐⭐⭐ | 统一管道，一套组件映射 |
| 可执行组件 | ⭐⭐⭐⭐⭐ | MDX 原生支持 JSX 组件 |

### 实施步骤

#### Step 1：安装依赖

```bash
cd apps/innate-executable/playground/apps/desktop

# Shiki + MDX
pnpm add shiki @shikijs/rehype @shikijs/transformers

# next-mdx-remote RSC 版本（Next.js 15+）
pnpm add next-mdx-remote

# 移除旧的高亮依赖
pnpm remove highlight.js rehype-highlight
```

#### Step 2：创建统一的 MDX 渲染器

```tsx
// lib/mdx-renderer.ts
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { createHighlighter } from 'shiki'
import { RunnableCodeBlock, PlatformTabs, RunButton } from '@/components/tutorial'

const highlighter = await createHighlighter({
  themes: ['github-dark', 'github-light'],
  langs: ['bash', 'javascript', 'typescript', 'python', 'rust', 'json', 'yaml', 'markdown'],
})

const components = {
  RunnableCodeBlock,
  PlatformTabs,
  RunButton,
}

export async function renderTutorial(source: string) {
  const { content, frontmatter } = await compileMDX({
    source,
    components,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [await import('@shikijs/rehype').then(m => m.default), {
            theme: 'github-dark',
            highlighter,
          }],
        ],
      },
    },
  })

  return { content, frontmatter }
}
```

#### Step 3：修改教程页面

```tsx
// app/tutorial/[id]/page.tsx
import { renderTutorial } from '@/lib/mdx-renderer'
import { loadSkillContent } from '@/lib/tutorial-scanner'

export default async function TutorialPage({ params }: { params: { id: string } }) {
  const result = await loadSkillContent(params.id)
  if (!result) return <div>教程未找到</div>

  const { content, frontmatter } = await renderTutorial(result.content)

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-3xl font-bold mb-4">{frontmatter.title}</h1>
      {content}
    </div>
  )
}
```

**关键改变**：
- 从 Client Component (`use client` + `useEffect` + `serialize`) → Server Component (async 函数)
- 不再需要 `MDXErrorBoundary`（构建时编译，出错在 build 阶段暴露）
- 不再需要手动转义 `{}`

#### Step 4：删除旧代码

- 删除 `tutorial-markdown.tsx`（`react-markdown` 版本）
- 删除 `client.tsx` 中的 `serialize` 和 `MDXRemote` 逻辑
- 统一使用 `renderTutorial()`

---

## 语法高亮主题推荐

| 主题 | 风格 | 适合场景 |
|---|---|---|
| `github-dark` | 经典深色 | 通用，大众接受度高 |
| `github-light` | 经典浅色 | 配合浅色模式 |
| `catppuccin-mocha` | 暖色深色 | 现代感，护眼 |
| `dracula` | 紫色调 | 开发者喜欢 |
| `one-dark-pro` | Atom 风格 | 流行度很高 |

建议：**`github-dark` / `github-light`** 作为默认，和 GitHub 一致，用户最熟悉。

---

## WYSIWYG 编辑器（可选）

如果未来需要**非技术人员**也能编写教程，可以考虑：

| 编辑器 | 输出格式 | 特点 |
|---|---|---|
| **Milkdown** | Markdown | 插件化，可定制性强 |
| **BlockNote** | JSON / Markdown | 类似 Notion 的块编辑器 |
| **Editor.js** | JSON | 结构化内容，需要转换 |
| **StackEdit** | Markdown | 在线编辑器，可直接用 |

**短期不需要**。目前教程作者直接写 `.mdx` 文件即可，这是最简单、最可控的方式。

---

## 总结

| 方案 | 效果 | 成本 | 推荐 |
|---|---|---|---|
| 当前（next-mdx-remote + react-markdown）| 差（无高亮，两套系统）| 低 | ❌ |
| Shiki + 统一 MDX 管道 | 优 | 中 | **✅ 推荐** |
| Markdoc | 中 | 高（学习成本）| ❌ |
| SaaS (Notion) | 优（编辑体验）| 高（依赖网络）| ❌ |

**下一步行动**：
1. 安装 `shiki` + `@shikijs/rehype`
2. 创建 `lib/mdx-renderer.ts` 统一渲染器
3. 将教程页面迁移到 Server Component
4. 删除旧的 `react-markdown` 和 `next-mdx-remote` Client 渲染逻辑
5. 预期效果：代码块有语法高亮、无运行时 MDX 编译延迟、维护成本减半
