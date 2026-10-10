/**
 * UI string dictionary for the bilingual site. Chinese is the default
 * locale (unprefixed URLs); English lives under /en. Only *chrome* and
 * page-level strings live here — article content (markdown bodies and
 * frontmatter) is localized via `src/content/<collection>/<locale>/`.
 */

export const locales = ['zh', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'zh';

const en = {
  // Header / chrome
  'nav.atlas': 'Atlas',
  'nav.lessons': 'Lessons',
  'nav.agents': 'Agents',
  'nav.useCases': 'Use cases',
  'nav.frameworks': 'Frameworks',
  'nav.docs': 'Docs',
  'a11y.skipToContent': 'Skip to content',
  'a11y.mainNav': 'Main',
  'a11y.sections': 'Sections',
  'a11y.openMenu': 'Open navigation menu',
  'a11y.switchLanguage': 'Switch language',
  'action.search': 'Search',
  'action.palette': 'Switch color palette',
  'footer.built': 'Built with Astro + MDX. Source on',
  'footer.license': 'MIT — content CC-BY-SA where attributed.',

  // Sections (icon rail, middle panel, mobile drawer)
  'section.lessons': 'Lessons',
  'section.agents': 'Agents',
  'section.useCases': 'Use cases',
  'section.frameworks': 'Frameworks',
  'section.home': 'Home',
  'section.all.lessons': 'All lessons',
  'section.all.agents': 'All agents',
  'section.all.useCases': 'All use cases',
  'section.all.frameworks': 'All frameworks',
  'section.roadmap': 'Roadmap',

  // Home
  'home.badge': 'v0.1 · Preview',
  'home.title': 'A continuously published atlas of AI agent projects.',
  'home.lede':
    'Long-form lessons, runnable agent code, and curated use cases — all written as typed Markdown so authors ship in minutes and readers learn with state.',
  'home.cta.start': 'Start learning',
  'home.cta.frameworks': 'Browse frameworks',
  'home.stats.lessons': 'Lessons published',
  'home.stats.frameworks': 'Frameworks covered',
  'home.stats.useCases': 'Use cases documented',
  'home.stats.readingTime': 'Reading time, total',
  'home.latest': 'Latest lessons',
  'home.viewAll': 'View all →',
  'home.frameworkMap': 'Framework map',
  'home.recentlyViewed': 'Recently viewed',

  // Lessons
  'lessons.kicker': 'Curriculum',
  'lessons.index.title': 'Lessons',
  'lessons.index.lede':
    'Hand-written, MDX-rendered lessons. Every frontmatter is validated at build time, so you can trust the metadata on every card.',
  'lessons.empty': 'No lessons match your filter.',
  'lessons.done': 'Done',
  'lessons.minUnit': 'min',
  'lessons.filter': 'Filter',
  'lessons.filter.search': 'Search lessons…',
  'lessons.filter.framework': 'Framework',
  'lessons.filter.level': 'Level',
  'lessons.filter.all': 'All',
  'lessons.filter.reset': 'Reset',
  'lessons.action.complete': 'Mark complete',
  'lessons.action.completed': 'Completed',
  'lessons.action.save': 'Save',
  'lessons.action.saved': 'Saved',
  'lessons.action.toastCompleted': 'Completed “{title}”',
  'lessons.action.toastUnmarked': 'Unmarked “{title}”',
  'lessons.action.toastSaved': 'Saved to favorites',
  'lessons.action.toastRemoved': 'Removed from favorites',
  'lessons.notes': 'Lesson notes',
  'lesson.objectives': 'Objectives',
  'lesson.onThisPage': 'On this page',
  'lesson.minRead': 'min read',
  'lesson.by': 'By',
  'lessons.roadmapCta': 'Follow the ordered roadmap →',

  // Roadmap (ordered learning path)
  'roadmap.kicker': 'Ordered path',
  'roadmap.title': 'Learning roadmap',
  'roadmap.lede':
    'The curriculum as a single ordered path — each lesson builds on the previous one. Work top to bottom and watch your progress fill in.',
  'roadmap.badge.lessons': 'lessons',
  'roadmap.badge.minutes': 'min total',
  'roadmap.progress': '{done} of {total} completed',

  // Category browsing (per-framework group descriptions)
  'frameworks.desc.crewai': 'Role-based teams, business automation, rapid prototyping.',
  'frameworks.desc.langgraph': 'Stateful workflows, RAG pipelines, complex graphs.',
  'frameworks.desc.autogen': 'Code generation, multi-agent research, self-healing flows.',
  'frameworks.desc.agno': 'Lightweight single agents, tool integration, fast iteration.',
  'frameworks.desc.llamaindex': 'Document Q&A, enterprise RAG, data pipelines.',
  'frameworks.desc.cross': 'Patterns that work across every agent framework.',

  // Agents
  'agents.kicker': 'Runnable',
  'agents.index.title': 'Agents',
  'agents.index.lede':
    'Each agent is a self-contained folder with an entrypoint, requirements, and metadata. Click any card to see the run commands and architecture.',
  'agents.run': 'Run in 5 minutes',
  'agents.metadata': 'Metadata',
  'agents.source': 'Source',
  'agents.viewOnGithub': 'View on GitHub ↗',
  'agents.meta.framework': 'Framework',
  'agents.meta.difficulty': 'Difficulty',
  'agents.meta.llm': 'LLM',
  'agents.meta.industry': 'Industry',
  'agents.meta.language': 'Language',
  'agents.meta.entrypoint': 'Entrypoint',

  // Use cases
  'useCases.kicker': 'External',
  'useCases.index.title': 'Use cases',
  'useCases.index.lede':
    'Production projects from across the web — each links back to its source.',
  'useCases.openSource': 'Open source ↗',
  'useCases.noLink': 'No external link',
  'useCases.openProject': 'Open source project ↗',

  // Frameworks
  'frameworks.kicker': 'Decision support',
  'frameworks.index.title': 'Frameworks',
  'frameworks.index.lede':
    'Every framework we cover, with a tally of lessons, agents, and external use cases.',
  'frameworks.count.lessons': 'lessons',
  'frameworks.count.agents': 'agents',
  'frameworks.count.useCases': 'use cases',

  // Docs (roadmap)
  'docs.kicker': 'Contributor course',
  'docs.index.title': 'Atlas documentation',
  'docs.index.lede':
    'These pages form a complete course on how the Atlas works. Follow the roadmap top to bottom — each stage builds on the previous one.',
  'docs.badge.pages': 'pages',
  'docs.badge.stages': 'stages',
  'docs.badge.markdown': 'Markdown',
  'docs.reference': 'reference',
  'docs.rail.all': 'All docs',
  'docs.stage.1.title': 'Start here',
  'docs.stage.1.goal': 'Get the site running locally and ship a first change.',
  'docs.stage.2.title': 'Understand the platform',
  'docs.stage.2.goal': 'Learn how the Atlas is structured before touching content.',
  'docs.stage.3.title': 'Author content',
  'docs.stage.3.goal': 'Write lessons, agents, and use cases with typed frontmatter and widgets.',
  'docs.stage.4.title': 'Ship & operate',
  'docs.stage.4.goal': 'Publish, gather feedback, and diagnose problems in production.',
  'docs.stage.5.title': 'Decision log',
  'docs.stage.5.goal':
    'Reference: the ADRs behind key technical choices. Read on demand, not in sequence.',

  // Redirect interstitial + 404
  'go.kicker': 'Leaving the atlas',
  'go.redirecting': 'Redirecting to',
  'go.openNow': 'Open now',
  'go.back': 'Back to use cases',
  'notFound.title': 'Page not found',
  'notFound.body':
    "That URL doesn't match a lesson, agent, or use case. Try the atlas index.",
  'notFound.back': 'Back to atlas',
  'notFound.browse': 'Browse lessons',

  // Islands
  'palette.placeholder': 'Search lessons, agents, use cases…',
  'palette.empty': 'No results found.',
  'feedback.question': 'Was this useful?',
  'feedback.yes': 'Yes',
  'feedback.no': 'No',
  'feedback.toastUp': 'Thanks — glad it helped.',
  'feedback.toastDown': 'Thanks — noted.',
  'notes.saved': 'Saved',
  'notes.saving': 'Saving…',
  'notes.placeholder': 'Write your private notes here…',
  'notes.loading': 'Loading…',
  'notes.toastSaved': 'Note saved',
  'notes.hint': 'Saved locally on this device. Never sent anywhere.',
  'copy.aria': 'Copy code',
  'copy.success': 'Copied to clipboard',
  'copy.error': 'Failed to copy',
};

export type UiKey = keyof typeof en;

const zh: Record<UiKey, string> = {
  'nav.atlas': '首页',
  'nav.lessons': '课程',
  'nav.agents': '智能体',
  'nav.useCases': '应用案例',
  'nav.frameworks': '框架',
  'nav.docs': '文档',
  'a11y.skipToContent': '跳到主要内容',
  'a11y.mainNav': '主导航',
  'a11y.sections': '板块',
  'a11y.openMenu': '打开导航菜单',
  'a11y.switchLanguage': '切换语言',
  'action.search': '搜索',
  'action.palette': '切换配色主题',
  'footer.built': '基于 Astro + MDX 构建。源码见',
  'footer.license': 'MIT — 署名内容采用 CC-BY-SA。',

  'section.lessons': '课程',
  'section.agents': '智能体',
  'section.useCases': '应用案例',
  'section.frameworks': '框架',
  'section.home': '首页',
  'section.all.lessons': '全部课程',
  'section.all.agents': '全部智能体',
  'section.all.useCases': '全部案例',
  'section.all.frameworks': '全部框架',
  'section.roadmap': '学习路径',

  'home.badge': 'v0.1 · 预览版',
  'home.title': '一个持续发布的 AI 智能体项目图谱。',
  'home.lede':
    '长文教程、可运行的智能体代码、精选应用案例——全部以类型化 Markdown 编写，作者几分钟即可发布，读者可以带着学习状态阅读。',
  'home.cta.start': '开始学习',
  'home.cta.frameworks': '浏览框架',
  'home.stats.lessons': '已发布课程',
  'home.stats.frameworks': '覆盖框架',
  'home.stats.useCases': '收录案例',
  'home.stats.readingTime': '总阅读时长',
  'home.latest': '最新课程',
  'home.viewAll': '查看全部 →',
  'home.frameworkMap': '框架地图',
  'home.recentlyViewed': '最近浏览',

  'lessons.kicker': '课程体系',
  'lessons.index.title': '课程',
  'lessons.index.lede':
    '手写的 MDX 渲染课程。每篇 frontmatter 都在构建时校验，卡片上的元数据值得信赖。',
  'lessons.empty': '没有符合筛选条件的课程。',
  'lessons.done': '已完成',
  'lessons.minUnit': '分钟',
  'lessons.filter': '筛选',
  'lessons.filter.search': '搜索课程…',
  'lessons.filter.framework': '框架',
  'lessons.filter.level': '难度',
  'lessons.filter.all': '全部',
  'lessons.filter.reset': '重置',
  'lessons.action.complete': '标记完成',
  'lessons.action.completed': '已完成',
  'lessons.action.save': '收藏',
  'lessons.action.saved': '已收藏',
  'lessons.action.toastCompleted': '已完成「{title}」',
  'lessons.action.toastUnmarked': '已取消完成「{title}」',
  'lessons.action.toastSaved': '已加入收藏',
  'lessons.action.toastRemoved': '已移出收藏',
  'lessons.notes': '课程笔记',
  'lesson.objectives': '学习目标',
  'lesson.onThisPage': '本页目录',
  'lesson.minRead': '分钟阅读',
  'lesson.by': '作者',
  'lessons.roadmapCta': '按顺序路径学习 →',

  'roadmap.kicker': '顺序路径',
  'roadmap.title': '学习路径',
  'roadmap.lede':
    '把课程体系串成一条有序路径——每节课都建立在前一节之上。从上到下依次学习，看着进度一点点填满。',
  'roadmap.badge.lessons': '节课',
  'roadmap.badge.minutes': '分钟总时长',
  'roadmap.progress': '已完成 {done}/{total}',

  'frameworks.desc.crewai': '角色分工的团队协作、业务自动化、快速原型。',
  'frameworks.desc.langgraph': '有状态工作流、RAG 管线、复杂图结构。',
  'frameworks.desc.autogen': '代码生成、多智能体研究、自愈流程。',
  'frameworks.desc.agno': '轻量单智能体、工具集成、快速迭代。',
  'frameworks.desc.llamaindex': '文档问答、企业级 RAG、数据管线。',
  'frameworks.desc.cross': '适用于所有智能体框架的通用模式。',

  'agents.kicker': '可运行',
  'agents.index.title': '智能体',
  'agents.index.lede':
    '每个智能体都是一个自包含的目录，包含入口文件、依赖清单和元数据。点击卡片查看运行命令与架构说明。',
  'agents.run': '5 分钟跑起来',
  'agents.metadata': '元数据',
  'agents.source': '源码',
  'agents.viewOnGithub': '在 GitHub 查看 ↗',
  'agents.meta.framework': '框架',
  'agents.meta.difficulty': '难度',
  'agents.meta.llm': '模型',
  'agents.meta.industry': '行业',
  'agents.meta.language': '语言',
  'agents.meta.entrypoint': '入口文件',

  'useCases.kicker': '外部项目',
  'useCases.index.title': '应用案例',
  'useCases.index.lede': '来自全网的生产级项目——每个都链接回原始出处。',
  'useCases.openSource': '打开源码 ↗',
  'useCases.noLink': '暂无外部链接',
  'useCases.openProject': '打开源项目 ↗',

  'frameworks.kicker': '选型参考',
  'frameworks.index.title': '框架',
  'frameworks.index.lede': '我们覆盖的所有框架，附课程、智能体和外部案例的数量统计。',
  'frameworks.count.lessons': '课程',
  'frameworks.count.agents': '智能体',
  'frameworks.count.useCases': '案例',

  'docs.kicker': '贡献者教程',
  'docs.index.title': 'Atlas 文档',
  'docs.index.lede':
    '这些页面构成一门完整的课程，讲解 Atlas 的运作方式。按 roadmap 从上往下走——每个阶段都建立在前一阶段之上。',
  'docs.badge.pages': '页',
  'docs.badge.stages': '阶段',
  'docs.badge.markdown': 'Markdown',
  'docs.reference': '参考',
  'docs.rail.all': '全部文档',
  'docs.stage.1.title': '从这里开始',
  'docs.stage.1.goal': '在本地跑起站点，并完成第一次改动。',
  'docs.stage.2.title': '理解平台',
  'docs.stage.2.goal': '在动手写内容之前，先了解 Atlas 的结构。',
  'docs.stage.3.title': '创作内容',
  'docs.stage.3.goal': '用类型化 frontmatter 和交互组件编写课程、智能体和案例。',
  'docs.stage.4.title': '发布与运维',
  'docs.stage.4.goal': '发布内容、收集反馈、排查线上问题。',
  'docs.stage.5.title': '决策记录',
  'docs.stage.5.goal': '参考材料：关键技术决策的 ADR。按需查阅，不必按顺序阅读。',

  'go.kicker': '即将离开本站',
  'go.redirecting': '正在跳转到',
  'go.openNow': '立即打开',
  'go.back': '返回应用案例',
  'notFound.title': '页面不存在',
  'notFound.body': '这个 URL 不匹配任何课程、智能体或案例。试试回到图谱首页。',
  'notFound.back': '返回首页',
  'notFound.browse': '浏览课程',

  'palette.placeholder': '搜索课程、智能体、案例…',
  'palette.empty': '没有找到结果。',
  'feedback.question': '这个页面有用吗？',
  'feedback.yes': '有用',
  'feedback.no': '没用',
  'feedback.toastUp': '谢谢——很高兴帮到你。',
  'feedback.toastDown': '谢谢——已记录。',
  'notes.saved': '已保存',
  'notes.saving': '保存中…',
  'notes.placeholder': '在这里写你的私人笔记…',
  'notes.loading': '加载中…',
  'notes.toastSaved': '笔记已保存',
  'notes.hint': '仅保存在本设备上，不会上传到任何地方。',
  'copy.aria': '复制代码',
  'copy.success': '已复制到剪贴板',
  'copy.error': '复制失败',
};

export const ui: Record<Locale, Record<UiKey, string>> = { en, zh };

export function useTranslations(locale: Locale) {
  const dict = ui[locale];
  return (key: UiKey) => dict[key];
}
