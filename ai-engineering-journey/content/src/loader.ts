import type { GlossaryTerm, Heading, LessonDetail, LessonMeta, Locale, PhaseSummary, Slide } from './schema'

const metaModules = import.meta.glob('../lessons/**/meta.json', { eager: true, import: 'default' }) as Record<string, LessonMeta>
const mdModules = import.meta.glob('../lessons/**/*.md', { query: '?raw', import: 'default' }) as Record<string, () => Promise<string>>
const slideModules = import.meta.glob('../lessons/**/slides.json', { import: 'default' }) as Record<string, () => Promise<Slide[]>>
const indexMod = import.meta.glob('../lessons/index.json', { eager: true, import: 'default' }) as Record<string, LessonMeta[]>
const phasesMod = import.meta.glob('../lessons/phases.json', { eager: true, import: 'default' }) as Record<string, PhaseSummary[]>
const glossaryEn = import.meta.glob('../glossary/en.json', { eager: true, import: 'default' }) as Record<string, GlossaryTerm[]>
const glossaryZh = import.meta.glob('../glossary/zh.json', { eager: true, import: 'default' }) as Record<string, GlossaryTerm[]>

function firstValue<T>(record: Record<string, T>): T | undefined {
  const keys = Object.keys(record)
  return keys.length ? record[keys[0]] : undefined
}

const lessonIndex = firstValue(indexMod) ?? Object.values(metaModules)
const phasesList = firstValue(phasesMod) ?? []

const PHASE_TITLE_ZH: Record<string, string> = {
  '00-setup-and-tooling': '环境与工具',
  '01-math-foundations': '数学基础',
  '02-ml-fundamentals': '机器学习基础',
  '03-deep-learning-core': '深度学习核心',
  '04-computer-vision': '计算机视觉',
  '05-nlp-foundations-to-advanced': 'NLP 基础到进阶',
  '06-speech-and-audio': '语音与音频',
  '07-transformers-deep-dive': 'Transformer 深入',
  '08-generative-ai': '生成式 AI',
  '09-reinforcement-learning': '强化学习',
  '10-llms-from-scratch': '从零构建 LLM',
  '11-llm-engineering': 'LLM 工程',
  '12-multimodal-ai': '多模态 AI',
  '13-tools-and-protocols': '工具与协议',
  '14-agent-engineering': 'Agent 工程',
  '15-autonomous-systems': '自主系统',
  '16-multi-agent-and-swarms': '多智能体与集群',
  '17-infrastructure-and-production': '基础设施与生产',
  '18-ethics-safety-alignment': '伦理、安全与对齐',
  '19-capstone-projects': '毕业项目',
}

const LESSON_TITLE_ZH: Record<string, string> = {
  '00-setup-and-tooling/01-dev-environment': '开发环境',
  '00-setup-and-tooling/02-git-and-collaboration': 'Git 与协作',
  '00-setup-and-tooling/03-gpu-setup-and-cloud': 'GPU 与云端',
  '00-setup-and-tooling/04-apis-and-keys': 'API 与密钥',
  '00-setup-and-tooling/05-jupyter-notebooks': 'Jupyter Notebook',
  '00-setup-and-tooling/06-python-environments': 'Python 环境',
  '00-setup-and-tooling/07-docker-for-ai': 'AI 用 Docker',
  '00-setup-and-tooling/08-editor-setup': '编辑器配置',
  '00-setup-and-tooling/09-data-management': '数据管理',
  '00-setup-and-tooling/10-terminal-and-shell': '终端与 Shell',
  '00-setup-and-tooling/11-linux-for-ai': 'AI 用 Linux',
  '00-setup-and-tooling/12-debugging-and-profiling': '调试与性能分析',
  '01-math-foundations/01-linear-algebra-intuition': '线性代数直觉',
  '01-math-foundations/02-vectors-matrices-operations': '向量与矩阵运算',
  '01-math-foundations/03-matrix-transformations': '矩阵变换',
  '01-math-foundations/04-calculus-for-ml': '机器学习微积分',
  '01-math-foundations/05-chain-rule-and-autodiff': '链式法则与自动微分',
  '01-math-foundations/06-probability-and-distributions': '概率与分布',
  '01-math-foundations/07-bayes-theorem': '贝叶斯定理',
  '01-math-foundations/08-optimization': '优化',
  '01-math-foundations/09-information-theory': '信息论',
  '01-math-foundations/10-dimensionality-reduction': '降维',
  '01-math-foundations/11-singular-value-decomposition': '奇异值分解',
  '01-math-foundations/12-tensor-operations': '张量运算',
  '01-math-foundations/13-numerical-stability': '数值稳定性',
  '01-math-foundations/14-norms-and-distances': '范数与距离',
  '01-math-foundations/15-statistics-for-ml': '机器学习统计',
  '01-math-foundations/16-sampling-methods': '采样方法',
  '01-math-foundations/17-linear-systems': '线性方程组',
  '01-math-foundations/18-convex-optimization': '凸优化',
  '01-math-foundations/19-complex-numbers': '复数',
  '01-math-foundations/20-fourier-transform': '傅里叶变换',
  '01-math-foundations/21-graph-theory': '图论',
  '01-math-foundations/22-stochastic-processes': '随机过程',
}

function pickTitle(title: { en: string; zh: string }, locale: Locale, fallbackZh?: string): string {
  if (locale === 'zh') return title.zh || fallbackZh || title.en || ''
  return title.en || title.zh || ''
}

export function getPhases(_locale: Locale = 'zh'): PhaseSummary[] {
  return [...phasesList].sort((a, b) => a.order - b.order).map((p) => ({
    ...p,
    title: {
      en: p.title.en,
      zh: p.title.zh || PHASE_TITLE_ZH[p.id] || p.title.en,
    },
  }))
}

export function getLessons(phaseId?: string): LessonMeta[] {
  const list = phaseId ? lessonIndex.filter((l) => l.phase === phaseId) : lessonIndex
  return [...list]
    .sort((a, b) => a.phaseOrder - b.phaseOrder || a.order - b.order)
    .map((l) => ({
      ...l,
      title: {
        en: l.title.en,
        zh: l.title.zh || LESSON_TITLE_ZH[l.id] || '',
      },
    }))
}

async function loadMarkdown(id: string, locale: Locale): Promise<string | null> {
  const key = `../lessons/${id}/${locale}.md`
  const loader = mdModules[key]
  if (!loader) return null
  return loader()
}

async function loadSlides(id: string): Promise<Slide[]> {
  const key = `../lessons/${id}/slides.json`
  const loader = slideModules[key]
  if (!loader) return []
  return loader()
}

export async function resolveLocaleLesson(id: string, locale: Locale = 'zh'): Promise<LessonDetail> {
  const metaList = getLessons()
  const meta = metaList.find((l) => l.id === id)
  if (!meta) throw new Error(`Lesson not found: ${id}`)
  const preferred = await loadMarkdown(id, locale)
  const fallback = (await loadMarkdown(id, locale === 'zh' ? 'en' : 'zh')) || (await loadMarkdown(id, 'en')) || ''
  const usedLocale: Locale = preferred ? locale : 'en'
  const markdown = preferred || fallback
  const slides = await loadSlides(id)
  return {
    meta,
    markdown,
    slides,
    usedLocale,
    needsTranslation: usedLocale !== 'zh' || meta.needsTranslation,
  }
}

export async function getLesson(id: string, locale: Locale = 'zh'): Promise<LessonDetail> {
  return resolveLocaleLesson(id, locale)
}

export function getLessonNeighbours(id: string): { prev?: LessonMeta; next?: LessonMeta } {
  const all = getLessons()
  const i = all.findIndex((l) => l.id === id)
  return {
    prev: i > 0 ? all[i - 1] : undefined,
    next: i >= 0 && i < all.length - 1 ? all[i + 1] : undefined,
  }
}

export function getGlossary(locale: Locale = 'zh'): GlossaryTerm[] {
  if (locale === 'zh') {
    const zh = firstValue(glossaryZh)
    if (zh?.length) return zh
  }
  return firstValue(glossaryEn) ?? []
}

export function extractHeadings(markdown: string): Heading[] {
  const out: Heading[] = []
  let inFence = false
  for (const line of markdown.split('\n')) {
    if (line.startsWith('```')) inFence = !inFence
    if (inFence) continue
    const m = line.match(/^(#{2,3})\s+(.+)$/)
    if (m) {
      const level = m[1].length
      const title = m[2].trim()
      out.push({ id: slugify(title), title, level })
    }
  }
  return out
}

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-').replace(/^-|-$/g, '')
}

export function pickLocalized(
  obj: { en: string; zh: string },
  locale: Locale,
  fallbackZh?: string,
): string {
  return pickTitle(obj, locale, fallbackZh)
}

export type { GlossaryTerm, Heading, LessonDetail, LessonMeta, Locale, PhaseSummary, Slide }
