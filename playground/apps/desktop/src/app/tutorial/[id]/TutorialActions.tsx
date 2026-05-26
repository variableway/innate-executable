"use client";

import { Button, Badge } from "@innate/ui";
import { CheckCircle, RotateCcw } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

interface TutorialActionsProps {
  slug: string;
}

export function TutorialActions({ slug }: TutorialActionsProps) {
  const { progress, updateProgress } = useAppStore();
  const tutorialProgress = progress[slug];

  const handleMarkComplete = () => {
    updateProgress({
      skillId: slug,
      completed: true,
      completedSections: [],
      completedAt: new Date().toISOString(),
    });
  };

  const handleReset = () => {
    updateProgress({
      skillId: slug,
      completed: false,
      completedSections: [],
    });
  };

  if (tutorialProgress?.completed) {
    return (
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
    );
  }

  return (
    <Button onClick={handleMarkComplete}>
      <CheckCircle className="mr-2" size={18} />
      标记完成
    </Button>
  );
}
