"use client";

import { useState, useCallback, useEffect, type ReactNode } from "react";
import { Button } from "@innate/ui";
import { Play, Terminal, Copy, Check, Loader2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { codeToHtml } from "shiki";

const RUNNABLE_LANGS = new Set([
  "bash", "sh", "zsh", "shell",
  "python", "python3",
  "powershell", "ps1",
]);

function getTextContent(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (node && typeof node === "object" && "props" in node) {
    return getTextContent((node as any).props?.children);
  }
  return "";
}

function getRunCommand(code: string, lang: string): string {
  const trimmed = code.trim();
  switch (lang) {
    case "python":
    case "python3":
      return `python3 << 'PYEOF'\n${trimmed}\nPYEOF`;
    case "powershell":
    case "ps1":
      return trimmed;
    case "bash":
    case "sh":
    case "zsh":
    case "shell":
    default: {
      const lines = trimmed.split("\n").filter((l) => l.trim());
      if (lines.length <= 1) return trimmed;
      return `cat << 'EOF' > /tmp/run-tutorial.sh\n${trimmed}\nEOF\nbash /tmp/run-tutorial.sh`;
    }
  }
}

interface ShikiCodeBlockProps {
  children?: ReactNode;
  "data-language"?: string;
  "data-theme"?: string;
}

export function ShikiCodeBlock({
  children,
  "data-language": dataLanguage,
}: ShikiCodeBlockProps) {
  const executeCommandInTerminal = useAppStore((s) => s.executeCommandInTerminal);
  const [copied, setCopied] = useState(false);
  const [runStatus, setRunStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [highlighted, setHighlighted] = useState<string>("");

  const lang = dataLanguage || "text";
  const codeText = getTextContent(children).replace(/\n$/, "");
  const isRunnable = RUNNABLE_LANGS.has(lang);
  const hasContent = codeText.trim().length > 0;

  useEffect(() => {
    let cancelled = false;
    if (!codeText) return;
    codeToHtml(codeText, {
      lang: lang === "text" ? "plaintext" : lang,
      theme: "github-dark",
    }).then((html) => {
      if (!cancelled) setHighlighted(html);
    }).catch(() => {
      // Fallback: plain text
      if (!cancelled) setHighlighted(`<pre><code>${escapeHtml(codeText)}</code></pre>`);
    });
    return () => { cancelled = true; };
  }, [codeText, lang]);

  const handleCopy = useCallback(async () => {
    if (!codeText) return;
    await navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [codeText]);

  const handleRun = useCallback(() => {
    if (!codeText.trim()) return;
    setRunStatus("sending");
    const cmd = getRunCommand(codeText, lang);
    executeCommandInTerminal(cmd);
    setTimeout(() => setRunStatus("sent"), 200);
    setTimeout(() => setRunStatus("idle"), 2000);
  }, [codeText, lang, executeCommandInTerminal]);

  return (
    <div className="my-3 rounded-lg border overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b bg-muted/40">
        <div className="flex items-center gap-2">
          <Terminal className="size-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-mono">{lang}</span>
        </div>
        <div className="flex items-center gap-1">
          {hasContent && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="h-7 w-7"
              title="复制"
            >
              {copied ? (
                <Check className="size-3.5 text-emerald-500" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </Button>
          )}
          {isRunnable && hasContent && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRun}
              className="gap-1.5 h-7 text-xs"
              disabled={runStatus === "sending"}
            >
              {runStatus === "sending" ? (
                <Loader2 className="size-3 animate-spin" />
              ) : runStatus === "sent" ? (
                <Check className="size-3 text-emerald-500" />
              ) : (
                <Play className="size-3 fill-current" />
              )}
              {runStatus === "sending" ? "发送中" : runStatus === "sent" ? "已发送" : "运行"}
            </Button>
          )}
        </div>
      </div>
      {/* Code content */}
      <div className="overflow-x-auto">
        {highlighted ? (
          <div
            className="shiki-code-block"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        ) : (
          <pre className="p-3 text-sm font-mono whitespace-pre">
            <code>{codeText}</code>
          </pre>
        )}
      </div>
    </div>
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
