"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@innate/ui";
import {
  ArrowLeft,
  Save,
  Upload,
} from "lucide-react";
import {
  loadTutorialContent,
  saveTutorialToWorkspace,
  parseFrontmatter,
  generateTutorialMDX,
} from "@/lib/tutorial-scanner";

interface TutorialEditClientProps {
  slug: string;
}

export default function TutorialEditClient({ slug }: TutorialEditClientProps) {
  const router = useRouter();
  const { discoveredTutorials, currentWorkspace, workspaces, defaultWorkspaceId } = useAppStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [duration, setDuration] = useState(10);
  const [category, setCategory] = useState("general");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const workspacePath = currentWorkspace?.path ||
    (defaultWorkspaceId ? workspaces.find((w) => w.id === defaultWorkspaceId)?.path : undefined);

  const skill = discoveredTutorials.find((s) => s.slug === slug);

  useEffect(() => {
    async function loadContent() {
      try {
        const result = await loadTutorialContent(slug, workspacePath);
        if (result) {
          const { frontmatter, body: contentBody } = parseFrontmatter(result.content);
          setTitle(frontmatter.title || "");
          setDescription(frontmatter.description || "");
          setDifficulty(frontmatter.difficulty || "beginner");
          setDuration(frontmatter.duration || 10);
          setCategory(frontmatter.category || "general");
          setBody(contentBody);
        } else if (skill) {
          setTitle(skill.title);
          setDescription(skill.description);
          setDifficulty(skill.difficulty);
          setDuration(skill.duration);
          setCategory(skill.category);
          setBody("");
        }
      } catch (err) {
        console.error("Failed to load tutorial content:", err);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, [slug, workspacePath, skill]);

  const handleSave = async () => {
    if (!workspacePath) return;
    setSaving(true);
    try {
      const mdx = generateTutorialMDX({
        title,
        description,
        difficulty,
        duration,
        category,
        tags: skill?.tags || [],
        content: body,
      });
      await saveTutorialToWorkspace(workspacePath, slug, mdx);
      router.back();
    } catch (err) {
      console.error("Failed to save tutorial:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleImport = async () => {
    if (!workspacePath) return;
    try {
      const { open } = await import('@tauri-apps/plugin-dialog');
      const selected = await open({
        multiple: false,
        filters: [{ name: 'MDX/MD', extensions: ['mdx', 'md'] }],
      });
      if (!selected) return;

      const filePath = typeof selected === 'string' ? selected : selected;
      const { readFile } = await import('@tauri-apps/plugin-fs');
      const bytes = await readFile(filePath);
      const content = new TextDecoder().decode(bytes);

      const { frontmatter, body: contentBody } = parseFrontmatter(content);
      if (frontmatter.title) setTitle(frontmatter.title);
      if (frontmatter.description) setDescription(frontmatter.description);
      if (frontmatter.difficulty) setDifficulty(frontmatter.difficulty);
      if (frontmatter.duration) setDuration(frontmatter.duration);
      if (frontmatter.category) setCategory(frontmatter.category);
      setBody(contentBody);
    } catch (err) {
      console.error("Failed to import file:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-muted-foreground">加载中...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft size={16} />
          </Button>
          <h1 className="text-lg font-bold">编辑教程: {title || slug}</h1>
        </div>
        <div className="flex items-center gap-2">
          {workspacePath && (
            <Button variant="outline" size="sm" onClick={handleImport} className="gap-2">
              <Upload size={16} />
              导入文件
            </Button>
          )}
          <Button size="sm" onClick={handleSave} disabled={saving || !workspacePath} className="gap-2">
            <Save size={16} />
            {saving ? '保存中...' : '保存'}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Metadata */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">标题</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-background border rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">描述</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-background border rounded-md text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">难度</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full px-3 py-2 bg-background border rounded-md text-sm"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">时长 (min)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-background border rounded-md text-sm"
                  min={1}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">分类</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-background border rounded-md text-sm"
              />
            </div>
          </div>

          {/* Content Editor */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium mb-1">内容 (Markdown/MDX)</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-3 py-2 bg-background border rounded-md text-sm font-mono"
              rows={30}
              placeholder="# Tutorial Title&#10;&#10;Content goes here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
