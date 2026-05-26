"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import { FileNode } from "@/types";
import { Button } from "@innate/ui";
import {
  FolderKanban,
  Plus,
  FolderOpen,
  Folder,
  FileText,
  FileCode2,
  File,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  Sparkles,
  Star,
  Trash2,
  MoreVertical,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ShikiCodeBlock } from "@/components/tutorial/shiki-code-block";

const DEFAULT_FOLDERS = [
  { name: "skills", description: "教程相关文件" },
  { name: "Apps", description: "应用程序相关文件" },
  { name: "KM", description: "知识库相关文件" },
  { name: "lessons", description: "系列相关文件" }
];

// File tree item with expand/collapse
function FileTreeItem({
  node,
  depth,
  selectedPath,
  onSelect,
}: {
  node: FileNode;
  depth: number;
  selectedPath: string | null;
  onSelect: (node: FileNode) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 1);
  const isSelected = selectedPath === node.path;
  const hasChildren = node.isDirectory && node.children && node.children.length > 0;

  const icon = node.isDirectory ? (
    expanded ? (
      <FolderOpen size={16} className="text-amber-500 shrink-0" />
    ) : (
      <Folder size={16} className="text-amber-500 shrink-0" />
    )
  ) : node.name.endsWith(".md") || node.name.endsWith(".mdx") ? (
    <FileText size={16} className="text-blue-400 shrink-0" />
  ) : node.name.endsWith(".tsx") || node.name.endsWith(".ts") || node.name.endsWith(".js") ? (
    <FileCode2 size={16} className="text-green-400 shrink-0" />
  ) : (
    <File size={16} className="text-muted-foreground shrink-0" />
  );

  return (
    <div>
      <button
        onClick={() => {
          onSelect(node);
          if (node.isDirectory) setExpanded(!expanded);
        }}
        className={`w-full flex items-center gap-1.5 py-1 px-2 rounded-md text-sm transition-colors hover:bg-muted ${
          isSelected ? "bg-muted text-foreground font-medium" : "text-muted-foreground"
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {node.isDirectory ? (
          expanded ? (
            <ChevronDown size={14} className="shrink-0" />
          ) : (
            <ChevronRight size={14} className="shrink-0" />
          )
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        {icon}
        <span className="truncate">{node.name}</span>
      </button>
      {expanded && hasChildren &&
        node.children!.map((child) => (
          <FileTreeItem
            key={child.path}
            node={child}
            depth={depth + 1}
            selectedPath={selectedPath}
            onSelect={onSelect}
          />
        ))}
    </div>
  );
}

// Extract headings from markdown content for ToC
function extractHeadings(content: string): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = [];
  const lines = content.split("\n");
  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/[*_`#]/g, "").trim();
      const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
      headings.push({ id, text, level });
    }
  }
  return headings;
}

// Table of Contents sidebar
function TableOfContents({ headings }: { headings: { id: string; text: string; level: number }[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );

    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const minLevel = Math.min(...headings.map((h) => h.level));

  return (
    <div className="w-52 shrink-0 border-l bg-muted/20 overflow-y-auto">
      <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b sticky top-0 bg-muted/20">
        目录
      </div>
      <nav className="p-2">
        {headings.map((h) => (
          <a
            key={h.id}
            href={`#${h.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className={`block text-xs py-1 px-2 rounded transition-colors truncate ${
              h.level > minLevel ? "ml-3" : ""
            } ${
              activeId === h.id
                ? "text-primary font-medium bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            title={h.text}
          >
            {h.text}
          </a>
        ))}
      </nav>
    </div>
  );
}

// File content viewer
function FileViewer({ node, content }: { node: FileNode; content: string }) {
  if (!node) return null;

  const isMarkdown = node.name.endsWith(".md") || node.name.endsWith(".mdx");
  const headings = isMarkdown ? extractHeadings(content) : [];

  // Add ids to markdown headings after render
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (contentRef.current && isMarkdown) {
      contentRef.current.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((el) => {
        const text = el.textContent || "";
        const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
        el.id = id;
      });
    }
  }, [content, isMarkdown]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30 shrink-0">
        <FileText size={16} className="text-muted-foreground" />
        <span className="text-sm font-medium truncate">{node.name}</span>
        <span className="text-xs text-muted-foreground ml-auto">
          {(content.length / 1024).toFixed(1)} KB
        </span>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div ref={contentRef} className="flex-1 overflow-auto p-6">
          {isMarkdown ? (
            <div className="prose prose-sm dark:prose-invert max-w-none
              prose-headings:scroll-mt-4
              prose-headings:font-semibold prose-headings:text-foreground
              prose-h1:text-2xl prose-h1:border-b prose-h1:pb-2 prose-h1:mb-4
              prose-h2:text-xl prose-h2:border-b prose-h2:pb-1 prose-h2:mt-8
              prose-h3:text-lg prose-h3:mt-6
              prose-p:leading-7 prose-p:text-muted-foreground
              prose-strong:text-foreground prose-strong:font-semibold
              prose-a:text-primary prose-a:font-medium hover:prose-a:underline
              prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
              prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:shadow-sm
              prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-lg
              prose-li:text-muted-foreground
              prose-table:border prose-th:border prose-th:px-3 prose-th:py-2 prose-th:bg-muted/50
              prose-td:border prose-td:px-3 prose-td:py-2
              prose-img:rounded-lg prose-img:shadow-md
              prose-hr:border-border
              prose-ul:list-disc prose-ol:list-decimal">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{ pre: ShikiCodeBlock as any }}
              >
                {content}
              </ReactMarkdown>
            </div>
          ) : (
            <pre className="text-sm font-mono whitespace-pre-wrap break-words text-foreground">
              {content}
            </pre>
          )}
        </div>
        {isMarkdown && headings.length > 0 && (
          <TableOfContents headings={headings} />
        )}
      </div>
    </div>
  );
}

// Empty state for no workspace
function EmptyWorkspaceState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
        <FolderKanban size={40} className="text-muted-foreground/50" />
      </div>
      <h2 className="text-2xl font-bold mb-2">还没有工作区</h2>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        创建一个工作区来管理你的项目文件和教程资料
      </p>
      <Button onClick={onCreate} className="gap-2">
        <Plus size={18} />
        创建新工作区
      </Button>
    </div>
  );
}

// Create workspace form
function CreateWorkspaceForm({
  onCancel,
  onSubmit,
}: {
  onCancel: () => void;
  onSubmit: (name: string, path: string) => void;
}) {
  const [name, setName] = useState("");
  const [path, setPath] = useState("");

  const handleBrowse = async () => {
    if ("__TAURI_INTERNALS__" in window) {
      try {
        const { open } = await import("@tauri-apps/plugin-dialog");
        const selected = await open({ directory: true, multiple: false });
        if (selected) {
          setPath(typeof selected === "string" ? selected : (selected as any).path || String(selected));
        }
      } catch {
        // Fallback: manual input
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && path.trim()) {
      onSubmit(name.trim(), path.trim());
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Sparkles className="text-primary-foreground" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">创建工作区</h2>
            <p className="text-sm text-muted-foreground">选择本地文件夹作为工作区根目录</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">工作区名称</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：My AI Learning"
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">本地文件夹</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder="选择或输入文件夹路径..."
                className="flex-1 px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <Button type="button" variant="outline" onClick={handleBrowse} className="shrink-0 gap-2">
                <FolderOpen size={16} />
                浏览
              </Button>
            </div>
          </div>
        </div>

        {/* Default folders preview */}
        <div>
          <label className="block text-sm font-medium mb-2">将自动创建以下子文件夹：</label>
          <div className="grid grid-cols-2 gap-2">
            {DEFAULT_FOLDERS.map((folder) => (
              <div key={folder.name} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                <Folder size={16} className="text-amber-500" />
                <div>
                  <span className="text-sm font-medium">{folder.name}/</span>
                  <p className="text-xs text-muted-foreground">{folder.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            取消
          </Button>
          <Button
            type="submit"
            disabled={!name.trim() || !path.trim()}
            className="flex-1"
          >
            创建工作区
          </Button>
        </div>
      </form>
    </div>
  );
}

// Two-column workspace browser
function WorkspaceBrowser() {
  const {
    currentWorkspace,
    fileTree,
    selectedFile,
    fileContent,
    selectedFolderPath,
    setSelectedFile,
    setFileContent,
    setSelectedFolderPath,
    setCurrentWorkspace,
  } = useAppStore();

  const [loading, setLoading] = useState(false);

  const handleSelectNode = async (node: FileNode) => {
    if (node.isDirectory) {
      setSelectedFolderPath(node.path);
      setSelectedFile(null);
    } else {
      setSelectedFile(node);
      setLoading(true);
      try {
        if ("__TAURI_INTERNALS__" in window) {
          const { readFile } = await import("@tauri-apps/plugin-fs");
          const bytes = await readFile(node.path);
          const text = new TextDecoder().decode(bytes);
          setFileContent(text);
        } else {
          setFileContent(`// File: ${node.name}\n// Content preview not available in web mode`);
        }
      } catch {
        setFileContent(`// Error reading file: ${node.name}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const folderFiles = selectedFolderPath
    ? fileTree.find((n) => n.path === selectedFolderPath)?.children || []
    : [];

  return (
    <div className="h-full w-full flex flex-col">
      {/* Workspace header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-muted/30 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentWorkspace(null)}
          className="h-8 w-8 shrink-0"
        >
          <ArrowLeft size={16} />
        </Button>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shrink-0">
          <FolderKanban size={16} className="text-primary-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">{currentWorkspace?.name}</h2>
          <p className="text-xs text-muted-foreground truncate">
            {currentWorkspace?.path}
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: File tree */}
        <div className="w-64 border-r flex flex-col shrink-0">
          <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b">
            文件结构
          </div>
          <div className="flex-1 overflow-auto p-1">
            {fileTree.map((node) => (
              <FileTreeItem
                key={node.path}
                node={node}
                depth={0}
                selectedPath={selectedFile?.path || selectedFolderPath}
                onSelect={handleSelectNode}
              />
            ))}
          </div>
        </div>

        {/* Right: Content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedFile ? (
            loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <FileViewer node={selectedFile} content={fileContent} />
            )
          ) : (
            /* Folder contents or welcome */
            <div className="flex-1 overflow-auto p-4">
              {selectedFolderPath && folderFiles.length > 0 ? (
                <div>
                  <h3 className="text-sm font-medium mb-3 text-muted-foreground">
                    {selectedFolderPath.split("/").pop() || selectedFolderPath.split("\\").pop()} 内容
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {folderFiles.map((file) => (
                      <button
                        key={file.path}
                        onClick={() => handleSelectNode(file)}
                        className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-muted transition-colors text-left"
                      >
                        {file.isDirectory ? (
                          <Folder size={18} className="text-amber-500 shrink-0" />
                        ) : (
                          <FileText size={18} className="text-blue-400 shrink-0" />
                        )}
                        <span className="text-sm truncate">{file.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <FileText size={40} className="mb-3 opacity-30" />
                  <p className="text-sm">选择左侧文件查看内容</p>
                  <p className="text-xs mt-1 opacity-60">或点击文件夹查看其内容</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Context menu for workspace cards
function WorkspaceContextMenu({
  ws,
  isDefault,
  position,
  onClose,
}: {
  ws: { id: string; name: string };
  isDefault: boolean;
  position: { x: number; y: number };
  onClose: () => void;
}) {
  const { deleteWorkspace, setDefaultWorkspace } = useAppStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="fixed z-50 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[160px] animate-in fade-in-0 zoom-in-95"
      style={{ left: position.x, top: position.y }}
    >
      <button
        onClick={() => {
          setDefaultWorkspace(isDefault ? null : ws.id);
          onClose();
        }}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors"
      >
        <Star size={14} className={isDefault ? "text-amber-500 fill-amber-500" : "text-muted-foreground"} />
        {isDefault ? "取消默认" : "设为默认"}
      </button>
      <div className="border-t border-border my-1" />
      <button
        onClick={() => {
          deleteWorkspace(ws.id);
          onClose();
        }}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
      >
        <Trash2 size={14} />
        删除工作区
      </button>
    </div>
  );
}

// Main workspace page component
export function WorkspacePage() {
  const {
    workspaces,
    currentWorkspace,
    defaultWorkspaceId,
    createWorkspace,
    setCurrentWorkspace,
    setFileTree,
  } = useAppStore();

  const [showCreate, setShowCreate] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    ws: { id: string; name: string };
    position: { x: number; y: number };
  } | null>(null);

  const handleContextMenu = useCallback((e: React.MouseEvent, ws: { id: string; name: string }) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ ws, position: { x: e.clientX, y: e.clientY } });
  }, []);

  // If we have a current workspace, show the browser
  if (currentWorkspace) {
    return (
      <div className="h-full w-full flex">
        <WorkspaceBrowser />
      </div>
    );
  }

  // If creating a new workspace
  if (showCreate) {
    return (
      <div className="h-full overflow-auto">
        <CreateWorkspaceForm
          onCancel={() => setShowCreate(false)}
          onSubmit={async (name, path) => {
            // Create default subdirectories on disk
            await createWorkspaceFolders(path);
            createWorkspace(name, path);
            // Find the newly created workspace
            const ws = useAppStore.getState().workspaces.find((w) => w.path === path);
            if (ws) {
              setCurrentWorkspace(ws);
              // Build initial file tree
              await buildFileTree(ws.path);
            }
            setShowCreate(false);
          }}
        />
      </div>
    );
  }

  // If workspaces exist but none selected, show workspace list
  if (workspaces.length > 0) {
    return (
      <div className="h-full overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">我的工作区</h2>
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus size={16} />
            新建工作区
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((ws) => {
            const isDefault = defaultWorkspaceId === ws.id;
            return (
              <button
                key={ws.id}
                onClick={async () => {
                  setCurrentWorkspace(ws);
                  await buildFileTree(ws.path);
                }}
                onContextMenu={(e) => handleContextMenu(e, ws)}
                className={`p-4 rounded-xl border transition-all text-left group relative ${
                  isDefault
                    ? "border-primary/50 bg-primary/5 hover:border-primary/70"
                    : "border-border hover:border-primary/30 hover:shadow-md"
                }`}
              >
                {/* More button */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = (e.target as HTMLElement).getBoundingClientRect();
                    setContextMenu({ ws, position: { x: rect.left, y: rect.bottom + 4 } });
                  }}
                  className="absolute top-3 right-3 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-muted transition-all cursor-pointer"
                >
                  <MoreVertical size={14} className="text-muted-foreground" />
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors ${
                    isDefault ? "bg-primary/20" : "bg-primary/10"
                  }`}>
                    <FolderKanban size={20} className="text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold">{ws.name}</h3>
                      {isDefault && (
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {ws.path}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  创建于 {new Date(ws.createdAt).toLocaleDateString("zh-CN")}
                </p>
              </button>
            );
          })}
        </div>

        {/* Context menu */}
        {contextMenu && (
          <WorkspaceContextMenu
            ws={contextMenu.ws}
            isDefault={defaultWorkspaceId === contextMenu.ws.id}
            position={contextMenu.position}
            onClose={() => setContextMenu(null)}
          />
        )}
      </div>
    );
  }

  // No workspaces: show empty state
  return (
    <div className="h-full flex">
      <EmptyWorkspaceState onCreate={() => setShowCreate(true)} />
    </div>
  );
}

// Helper: create workspace subdirectories on disk
async function createWorkspaceFolders(rootPath: string) {
  if ("__TAURI_INTERNALS__" in window) {
    try {
      const { mkdir, exists } = await import("@tauri-apps/plugin-fs");
      for (const folder of DEFAULT_FOLDERS) {
        const folderPath = `${rootPath}/${folder.name}`;
        if (!(await exists(folderPath))) {
          await mkdir(folderPath);
        }
      }
    } catch {
      // Directory creation failed — workspace may still be usable
    }
  }
}

// Helper: build file tree from workspace path
async function buildFileTree(rootPath: string) {
  const { setFileTree } = useAppStore.getState();

  if ("__TAURI_INTERNALS__" in window) {
    try {
      const { readDir } = await import("@tauri-apps/plugin-fs");
      const tree = await readNode(rootPath, readDir, 3);
      setFileTree(tree.children || []);
    } catch {
      setFileTree([]);
    }
  } else {
    // Web fallback: mock default folders
    setFileTree(
      DEFAULT_FOLDERS.map((f) => ({
        name: f.name,
        path: `${rootPath}/${f.name}`,
        isDirectory: true,
        children: [],
      }))
    );
  }
}

async function readNode(
  path: string,
  readDir: (dir: string) => Promise<any[]>,
  maxDepth: number,
  depth = 0
): Promise<FileNode> {
  const name = path.split("/").pop() || path.split("\\").pop() || path;

  if (depth >= maxDepth) {
    return { name, path, isDirectory: true, children: [] };
  }

  try {
    const entries = await readDir(path);
    const children: FileNode[] = await Promise.all(
      entries.map(async (entry: any) => {
        const childPath = entry.path || `${path}/${entry.name}`;
        if (entry.isDirectory || entry.children !== undefined) {
          const node = await readNode(childPath, readDir, maxDepth, depth + 1);
          return node;
        }
        return {
          name: entry.name,
          path: childPath,
          isDirectory: false,
          size: entry.size,
          modifiedAt: entry.modifiedAt?.toString(),
        };
      })
    );

    // Sort: directories first, then files
    children.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });

    return { name, path, isDirectory: true, children };
  } catch {
    return { name, path, isDirectory: true, children: [] };
  }
}
