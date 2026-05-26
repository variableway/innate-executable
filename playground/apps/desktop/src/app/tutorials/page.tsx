"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { Button, Badge, Input, Separator } from "@innate/ui";
import {
  BookOpen,
  Search,
  Clock,
  Play,
  CheckCircle,
  Circle,
  FileText,
  Sparkles,
  FolderOpen,
  Pencil,
} from "lucide-react";

function TutorialsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { discoveredTutorials, discoveredSeries, progress, scanContent, getSeriesForTutorial } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    scanContent();
  }, [scanContent]);

  // Read search query from URL param
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearchQuery(q);
  }, [searchParams]);

  if (!mounted) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-muted-foreground">加载中...</span>
        </div>
      </div>
    );
  }

  const filtered = discoveredTutorials.filter((skill) => {
    const matchesSearch = !searchQuery ||
      skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = !selectedCourse ||
      discoveredSeries
        .find((c) => c.id === selectedCourse)
        ?.skills?.some((cs) => cs.slug === skill.slug);
    return matchesSearch && matchesCourse;
  });

  // Deduplicate by slug (same slug can appear from multiple courses)
  const seen = new Set<string>();
  const uniqueFiltered = filtered.filter((s) => {
    if (seen.has(s.slug)) return false;
    seen.add(s.slug);
    return true;
  });

  const getDifficultyConfig = (d: string) => {
    switch (d) {
      case "beginner": return { text: "入门", color: "text-emerald-500", bg: "bg-emerald-500/10" };
      case "intermediate": return { text: "进阶", color: "text-amber-500", bg: "bg-amber-500/10" };
      case "advanced": return { text: "高级", color: "text-rose-500", bg: "bg-rose-500/10" };
      default: return { text: "入门", color: "text-emerald-500", bg: "bg-emerald-500/10" };
    }
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Header */}
      <div className="px-8 py-6 border-b shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="text-primary" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold">教程中心</h1>
              <p className="text-sm text-muted-foreground">
                {discoveredTutorials.length} 个教程 · {discoveredSeries.length} 个系列
              </p>
            </div>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              type="text"
              placeholder="搜索教程..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={selectedCourse === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCourse(null)}
            >
              全部
            </Button>
            {discoveredSeries.map((c) => {
              const count = discoveredTutorials.filter((skill) =>
                c.skills?.some((cs) => cs.slug === skill.slug)
              ).length;
              if (count === 0) return null;
              return (
                <Button
                  key={c.id}
                  variant={selectedCourse === c.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCourse(selectedCourse === c.id ? null : c.id)}
                  className="gap-1"
                >
                  {c.icon} {c.title}
                  <Badge variant="secondary" className="text-xs ml-1">{count}</Badge>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-8 py-6">
        {uniqueFiltered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {uniqueFiltered.map((skill) => {
              const isCompleted = progress[skill.slug]?.completed;
              const diff = getDifficultyConfig(skill.difficulty);
              const coursesForSkill = getSeriesForTutorial(skill.slug);
              const courseInfo = coursesForSkill.length > 0 ? coursesForSkill[0] : null;

              return (
                <div
                  key={skill.slug}
                  className="group cursor-pointer border rounded-lg p-4 transition-all hover:shadow-lg hover:border-primary/50"
                  onClick={() => router.push(`/tutorial/${skill.slug}`)}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Badge className={`text-xs ${diff.bg} ${diff.color}`}>
                          {diff.text}
                        </Badge>
                        {isCompleted && (
                          <Badge variant="outline" className="text-xs text-emerald-500 border-emerald-500/20">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            已完成
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                        {skill.title}
                      </h3>
                    </div>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isCompleted
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {isCompleted ? <CheckCircle size={14} /> : <Circle size={14} />}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {skill.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {skill.duration} 分钟
                      </span>
                      {courseInfo && (
                        <span>{courseInfo.icon} {courseInfo.title}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/tutorial/edit?slug=${skill.slug}`);
                        }}
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant={isCompleted ? "outline" : "default"}
                        className={`text-xs h-7 ${
                          isCompleted
                            ? "text-emerald-500 border-emerald-500/20"
                            : "bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity"
                        }`}
                      >
                        <Play className="w-3 h-3 mr-1 fill-current" />
                        {isCompleted ? "复习" : "开始"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-2xl border border-dashed">
            <FileText size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">
              {searchQuery || selectedCourse ? "没有找到匹配的教程" : uniqueFiltered.length === 0 && discoveredTutorials.length === 0 ? "暂无教程" : "没有找到匹配的教程"}
            </p>
            {(searchQuery || selectedCourse) && (
              <Button
                variant="link"
                onClick={() => { setSearchQuery(""); setSelectedCourse(null); }}
              >
                清除筛选条件
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TutorialsPage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center"><span className="text-muted-foreground">加载中...</span></div>}>
      <TutorialsContent />
    </Suspense>
  );
}
