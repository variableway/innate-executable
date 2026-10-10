import { createFileRoute } from '@tanstack/react-router'
import { useI18n } from '@/i18n'
import { Markdown } from '@/components/lesson/Markdown'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  const { t, locale } = useI18n()
  const md =
    locale === 'zh'
      ? `# 关于

**AI Engineering Journey** 是对 [AI Engineering from Scratch](https://github.com/rohitg00/ai-engineering-from-scratch) 网站的完整改写。

## 特点

- TanStack 静态站，样式与布局沿用 Blueprint 风格
- 课程 **原文 / 幻灯** 双展示模式
- 内容与网站分离：\`content/\` 与 \`site/\`
- 中英双语，默认中文
- shadcn-ui + 三主题（Light / Dark / Shadcn）

## 源站

523 课 · 20 阶段 · 先手写反向传播、分词器、注意力与 Agent 循环，再使用框架。

${t('footerNote')}
`
      : `# About

**AI Engineering Journey** is a full rewrite of the [AI Engineering from Scratch](https://github.com/rohitg00/ai-engineering-from-scratch) website.

## Highlights

- TanStack static site with the original Blueprint visual language
- Dual lesson modes: **Classic / Slides**
- Site and content separated (\`content/\` vs \`site/\`)
- Chinese + English, default Chinese
- shadcn-ui with Light / Dark / Shadcn themes

## Source

523 lessons · 20 phases · backprop, tokenizer, attention, and the agent loop by hand first.

${t('footerNote')}
`

  return (
    <div className="container-page max-w-3xl py-10">
      <Markdown>{md}</Markdown>
    </div>
  )
}
