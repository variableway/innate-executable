# AI Engineering Journey

TanStack 静态站改写自 `ai-engineering-from-scratch`。**网站**（`site/`）与**课程内容**（`content/`）分离。

## 布局

```text
site/      TanStack Router + Vite 静态站（shadcn-ui / 三主题 / 双展示模式）
content/   中英课文、术语、meta（独立内容包）
tools/     导入与验收脚本
```

## 命令

```bash
pnpm install
pnpm import:content   # 从源仓导入 en 课文 + 生成切片
pnpm dev        # 开发
pnpm build      # 静态构建 → site/dist
pnpm preview    # 预览产物
pnpm verify     # 内容与构建清单
```

## 功能

| 项 | 说明 |
|----|------|
| 双模式 | Classic 长文 / Slides（上正文段 + 下要点与命令） |
| 双语 | 中文默认，英文；缺 `zh.md` 回退英文 |
| 主题 | light / dark（Blueprint）+ shadcn 默认，ThemeProvider |
| UI | shadcn-ui 组件，token 对齐源站 |

规划文档：`tasks/project/ai-engineering-journey/0-copy-modify/`
