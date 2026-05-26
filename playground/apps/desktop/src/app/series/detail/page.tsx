"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CourseDetailClient from "./client";

function CourseDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";

  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-muted-foreground">未指定系列</p>
      </div>
    );
  }

  return <CourseDetailClient id={id} />;
}

export default function CourseDetailPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full"><span className="text-muted-foreground">加载中...</span></div>}>
      <CourseDetailContent />
    </Suspense>
  );
}
