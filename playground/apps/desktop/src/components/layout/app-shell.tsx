"use client";

import { ReactNode, Suspense, useEffect, useState } from "react";
import { SidebarProvider, SidebarInset } from "@innate/ui";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MenuBar } from "@/components/layout/menu-bar";
import { StatusBar } from "@/components/layout/status-bar";
import { TerminalPanel } from "@/components/terminal-panel";
import { useAppStore } from "@/store/useAppStore";

function AppShellContent({ children }: { children: ReactNode }) {
  const { terminalVisible, terminalPosition } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Disable default right-click context menu in Tauri desktop app
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handler);
    return () => document.removeEventListener("contextmenu", handler);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-muted-foreground">加载中...</span>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Suspense><AppSidebar /></Suspense>
      <SidebarInset className="overflow-hidden">
        {/* Menu Bar */}
        <MenuBar />

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          <div className="flex-1 overflow-auto min-h-0">{children}</div>

          {/* Terminal - Right Side */}
          {terminalVisible && terminalPosition === "right" && (
            <TerminalPanel />
          )}
        </div>

        {/* Terminal - Bottom */}
        {terminalVisible && terminalPosition === "bottom" && (
          <TerminalPanel />
        )}

        <StatusBar />
      </SidebarInset>
    </SidebarProvider>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return <AppShellContent>{children}</AppShellContent>;
}
