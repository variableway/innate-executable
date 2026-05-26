"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import { Button, Badge } from "@innate/ui";
import { ArrowLeft, BookOpen, CheckCircle, Clock, ExternalLink, RotateCcw, Sparkles } from "lucide-react";

import { loadTutorialContent, parseFrontmatter } from "@/lib/tutorial-scanner";
import { useAppStore } from "@/store/useAppStore";
import { ShikiCodeBlock } from "@/components/tutorial/shiki-code-block";
import { RunnableCodeBlock } from "@/components/tutorial/runnable-code-block";
import { PlatformTabs } from "@/components/tutorial/platform-tabs";
import { RunButton } from "@/components/tutorial/run-button";

interface TutorialContentProps {
  id: string;
}

const mdxComponents = {
  pre: ShikiCodeBlock as any,
  RunnableCodeBlock,
  PlatformTabs,
  RunButton,
  h1: ({ children }: { children?: ReactNode }) => (
    <h1 className="text-2xl font-bold mt-0 mb-4 text-foreground">{children}</h1>
  ),
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 className="text-xl font-semibold mt-8 mb-3 border-b border-border/50 pb-2 text-foreground">{children}</h2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3 className="text-lg font-medium mt-6 mb-2 text-foreground">{children}</h3>
  ),
  table: ({ children }: { children?: ReactNode }) => (
    <div className="my-4 overflow-x-auto rounded-lg border border-border/60">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  th: ({ children }: { children?: ReactNode }) => (
    <th className="border-b bg-primary/5 px-3 py-2 text-left font-medium text-foreground">{children}</th>
  ),
  td: ({ children }: { children?: ReactNode }) => (
    <td className="border-b border-border/40 px-3 py-2">{children}</td>
  ),
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote className="my-4 border-l-4 border-primary/50 bg-primary/5 px-4 py-2 rounded-r-md">
      {children}
    </blockquote>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="my-2 ml-6 list-disc space-y-1">{children}</ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="my-2 ml-6 list-decimal space-y-1">{children}</ol>
  ),
  p: ({ children }: { children?: ReactNode }) => (
    <p className="my-3 leading-7">{children}</p>
  ),
  hr: () => <hr className="my-6 border-border/50" />,
  a: ({ href, children }: { href?: string; children?: ReactNode }) => (
    <a href={href} className="text-primary hover:text-primary/80 underline underline-offset-2" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  code: ({ children }: { children?: ReactNode }) => (
    <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">{children}</code>
  ),
};

function getDifficultyConfig(difficulty: string) {
  switch (difficulty) {
    case "beginner": return { text: "入门", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
    case "intermediate": return { text: "进阶", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" };
    case "advanced": return { text: "高级", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" };
    default: return { text: "入门", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
  }
}

export default function TutorialContent({ id }: TutorialContentProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
  const [meta, setMeta] = useState<Record<string, unknown>>({});

  const { discoveredTutorials, updateProgress, progress } = useAppStore();
  const tutorialProgress = progress[id];

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const state = useAppStore.getState();
        const workspacePath = state.currentWorkspace?.path ||
          (state.defaultWorkspaceId ? state.workspaces.find((w) => w.id === state.defaultWorkspaceId)?.path : undefined);

        const result = await loadTutorialContent(id, workspacePath);
        if (!result) {
          setError("教程内容未找到");
          return;
        }

        const { frontmatter, body } = parseFrontmatter(result.content);
        setMeta({ ...frontmatter, source: result.path.startsWith("/skills/") ? "builtin" : "local" });

        // Escape bare fenced code blocks so MDX/acorn doesn't choke on {} inside them
        const safeBody = body.replace(
          /(```[\s\S]*?```)/g,
          (match) => {
            if (/{[^}]*}/.test(match)) {
              const inner = match.slice(3, -3);
              const firstNewline = inner.indexOf("\n");
              const lang = firstNewline > 0 ? inner.slice(0, firstNewline).trim() : "";
              const code = firstNewline >= 0 ? inner.slice(firstNewline + 1) : "";
              return `<RunnableCodeBlock language="${lang || "text"}" runnable={false} code={\`${code.replace(/`/g, "\\`").replace(/\$/g, "\\$")}\`} />`;
            }
            return match;
          }
        );

        const serialized = await serialize(safeBody, {
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            format: "mdx",
          },
          parseFrontmatter: false,
        });

        setMdxSource(serialized);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleMarkComplete = () => {
    updateProgress({
      tutorialId: id,
      completed: true,
      completedSections: [],
      completedAt: new Date().toISOString(),
    });
  };

  const handleReset = () => {
    updateProgress({
      tutorialId: id,
      completed: false,
      completedSections: [],
    });
  };

  const title = (meta.title as string) || id;
  const description = (meta.description as string) || "";
  const difficulty = (meta.difficulty as string) || "beginner";
  const duration = (meta.duration as number) || 10;
  const tags = Array.isArray(meta.tags) ? (meta.tags as string[]) : [];
  const source = meta.source as string;
  const sources = Array.isArray(meta.sources) ? (meta.sources as Array<{ name?: string; url?: string; author?: string; license?: string; type?: string; note?: string }>) : [];

  const diff = getDifficultyConfig(difficulty);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-muted-foreground">加载教程...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2" size={16} />
          返回
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b px-6 py-5">
        <Button variant="ghost" onClick={() => router.back()} className="mb-3 -ml-2">
          <ArrowLeft className="mr-2" size={16} />
          返回
        </Button>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge className={`${diff.bg} ${diff.color} ${diff.border}`}>{diff.text}</Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock size={14} />
                {duration} 分钟
              </span>
              {source === "local" && <Badge variant="outline">本地</Badge>}
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
              ))}
              {tutorialProgress?.completed && (
                <Badge variant="outline" className="text-emerald-500 border-emerald-500/20">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  已完成
                </Badge>
              )}
            </div>

            <h1 className="text-2xl font-bold mb-2">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>

          <div className="shrink-0">
            {tutorialProgress?.completed ? (
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="mr-2" size={16} />
                  重置进度
                </Button>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-md">
                  <CheckCircle size={18} />
                  <span className="font-medium">已完成</span>
                </div>
              </div>
            ) : (
              <Button onClick={handleMarkComplete}>
                <CheckCircle className="mr-2" size={18} />
                标记完成
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <div
            className="prose prose-slate max-w-none
              [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground
              [&_p]:text-foreground/90 [&_li]:text-foreground/90
              [&_strong]:text-foreground [&_a]:text-primary [&_a]:hover:text-primary/80
              [&_blockquote]:bg-primary/5 [&_blockquote]:border-primary/40
              [&_hr]:border-border
            "
          >
            {mdxSource ? <MDXRemote {...mdxSource} components={mdxComponents} /> : null}
          </div>
        </div>

        {/* Sources */}
        {sources.length > 0 && (
          <div className="mx-auto max-w-3xl px-6 pb-6">
            <div className="rounded-xl border border-border/60 bg-muted/20 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/40 bg-muted/40">
                <BookOpen className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">参考来源</span>
              </div>
              <div className="px-4 py-3">
                <ul className="space-y-2">
                  {sources.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-muted-foreground mt-0.5">{i + 1}.</span>
                      <div className="flex-1">
                        {s.url ? (
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 underline underline-offset-2 inline-flex items-center gap-1"
                          >
                            {s.name || s.url}
                            <ExternalLink className="size-3 opacity-60" />
                          </a>
                        ) : (
                          <span className="text-foreground">{s.name}</span>
                        )}
                        {(s.author || s.license) && (
                          <span className="text-muted-foreground ml-1">
                            — {s.author}{s.author && s.license ? "，" : ""}{s.license}
                          </span>
                        )}
                        {s.note && (
                          <p className="text-xs text-muted-foreground/70 mt-0.5">{s.note}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <div className="mx-auto max-w-3xl px-6 pb-8">
          <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Sparkles className="text-primary-foreground" size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1">
                  {tutorialProgress?.completed ? "想要学习更多？" : "完成本教程！"}
                </h3>
                <p className="text-muted-foreground">
                  {tutorialProgress?.completed
                    ? "继续探索系列中的其他教程，提升你的能力。"
                    : "完成上面的步骤，然后点击\"标记完成\"按钮。"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
