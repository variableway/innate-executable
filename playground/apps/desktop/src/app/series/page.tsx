"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from "@innate/ui";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  GraduationCap,
  Sparkles,
  CheckCircle,
} from "lucide-react";

export default function CoursesPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { discoveredSeries, discoveredTutorials, progress, scanContent } = useAppStore();

  useEffect(() => {
    setMounted(true);
    scanContent();
  }, [scanContent]);

  if (!mounted) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Header */}
      <div className="px-8 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <GraduationCap className="text-primary-foreground" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">系列中心</h1>
              <p className="text-sm text-muted-foreground">
                {discoveredSeries.length} 个系列，{discoveredTutorials.length} 个教程
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => router.push("/admin/series")} className="gap-2">
            <Sparkles size={16} />
            管理系列
          </Button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="px-8 pb-8">
        {discoveredSeries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {discoveredSeries.map((c) => {
              const courseSkillSlugs = (c.skills ?? []).map((cs) => cs.slug);
              const courseSkills = courseSkillSlugs
                .map((slug) => discoveredTutorials.find((s) => s.slug === slug))
                .filter((s): s is NonNullable<typeof s> => !!s);
              const totalDuration = courseSkills.reduce((sum, s) => sum + s.duration, 0);
              const completedCount = courseSkills.filter((s) => progress[s.slug]?.completed).length;
              const progressPercent = courseSkills.length > 0 ? (completedCount / courseSkills.length) * 100 : 0;

              return (
                <Card
                  key={c.id}
                  className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50"
                  onClick={() => router.push(`/series/detail?id=${c.id}`)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${c.color || '#3498db'}20 0%, ${c.color || '#3498db'}40 100%)`,
                        }}
                      >
                        {c.icon || "📚"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Badge variant="secondary" className="text-xs">
                          {courseSkills.length} 教程
                        </Badge>
                        <CardTitle className="text-base mt-1 truncate">{c.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{c.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen size={14} />
                        <span>{courseSkills.length} 个教程</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{totalDuration} 分钟</span>
                      </div>
                    </div>
                    {progressPercent > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>学习进度</span>
                          <span>{Math.round(progressPercent)}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              progressPercent === 100
                                ? "bg-emerald-500"
                                : "bg-gradient-to-r from-primary to-secondary"
                            }`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        {progressPercent === 100 && (
                          <div className="flex items-center gap-1 mt-2 text-emerald-500 text-xs">
                            <CheckCircle size={12} />
                            已完成
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 bg-card rounded-2xl border border-dashed">
            <GraduationCap size={64} className="mx-auto mb-4 text-muted-foreground opacity-30" />
            <p className="text-muted-foreground text-lg mb-2">暂无系列</p>
            <p className="text-sm text-muted-foreground mb-4">在管理页面创建或导入系列</p>
            <Button onClick={() => router.push("/admin/series")}>
              前往管理
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
