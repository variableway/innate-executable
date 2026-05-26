# 教程示例目录

> 本目录用于存放示例教材，展示 Innate Desktop 教程系统的编写规范和组件用法。
> **这些文件不会被系统扫描加载**，仅作为编写参考。

## 文件说明

| 文件 | 说明 |
|------|------|
| `00-complete-example.mdx` | 展示所有 MDX 组件、Markdown 语法和 frontmatter 的完整用法 |
| `01-source-attribution-example.mdx` | 展示如何标注教材来源和引用外部资料 |

## 如何使用这些示例

### 1. 作为模板使用

复制示例文件到 `public/skills/` 目录，然后修改内容：

```bash
cp docs/tutorial-examples/00-complete-example.mdx public/skills/my-tutorial.mdx
```

### 2. 重新生成 Manifest

```bash
node scripts/generate-skills-manifest.mjs
```

### 3. 重新构建应用

```bash
pnpm next build
```

## 编写规范速查

### Frontmatter 必填字段

```yaml
---
title: "教程标题"
description: "一句话描述"
difficulty: beginner          # beginner | intermediate | advanced
duration: 15                  # 分钟
category: ai-assistant        # 决定归属课程
tags: ["标签1", "标签2"]
---
```

### 可用组件

- `<RunnableCodeBlock code="..." language="bash" />` — 可运行的代码块
- `<PlatformTabs unix={...} windows={...} />` — 平台切换
- `<RunButton command="..." />` — 单行命令按钮

### 来源标注（推荐）

```yaml
sources:
  - name: "原始资料标题"
    url: "https://example.com"
    author: "作者名"
    license: "CC-BY-4.0"
```

详见 `../TUTORIAL_AUTHORING.md` 完整文档。
