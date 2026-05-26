"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
  SidebarTrigger,
} from "@innate/ui";
import { Settings, Monitor, KeyRound, Info } from "lucide-react";

export default function SettingsPage() {
  const [platform, setPlatform] = useState("detecting...");

  useEffect(() => {
    if ("__TAURI_INTERNALS__" in window) {
      import("@tauri-apps/api/core").then(({ invoke }) => {
        invoke<string>("get_platform").then(setPlatform).catch(() => setPlatform("unknown"));
      });
    } else {
      setPlatform("web (no Tauri)");
    }
  }, []);

  const platformIcon =
    platform.includes("macos") ? "🍎" :
    platform.includes("windows") ? "🪟" :
    platform.includes("linux") ? "🐧" : "🌐";

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center gap-3 border-b px-4 py-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-5" />
        <Settings className="size-5" />
        <h1 className="text-lg font-semibold">Settings</h1>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Monitor className="size-4" />
                Environment
              </CardTitle>
              <CardDescription>System environment information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform</span>
                <span className="font-mono">{platformIcon} {platform}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">App Version</span>
                <span className="font-mono">0.1.0</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Runtime</span>
                <span className="font-mono">Tauri v2 + Next.js 16</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <KeyRound className="size-4" />
                API Keys
              </CardTitle>
              <CardDescription>Configure API keys for AI services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai-key">OpenAI API Key</Label>
                <Input id="openai-key" type="password" placeholder="sk-..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="anthropic-key">Anthropic API Key</Label>
                <Input id="anthropic-key" type="password" placeholder="sk-ant-..." />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Info className="size-4" />
                About
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Innate Playground — 边做边学的可执行教程练习平台，每一步都可运行、有产出。</p>
              <p className="mt-2">Built with Tauri v2 + Next.js + shadcn/ui</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
