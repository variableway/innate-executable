"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Home,
  BookOpen,
  FolderOpen,
  Settings,
  Search,
  Sparkles,
  Menu,
  X,
  Sun,
  Moon,
  Shield,
} from "lucide-react";
import { Button } from "@innate/ui";

type Tab = "home" | "tutorials" | "series" | "admin" | "settings";

export function MenuBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const getActiveTab = (): Tab => {
    if (pathname === "/") return "home";
    if (pathname.startsWith("/tutorial")) return "tutorials";
    if (pathname.startsWith("/series")) return "series";
    if (pathname.startsWith("/admin")) return "admin";
    if (pathname.startsWith("/settings")) return "settings";
    return "home";
  };

  const activeTab = getActiveTab();

  const handleTabChange = (tab: Tab) => {
    const routes: Record<Tab, string> = {
      home: "/",
      tutorials: "/tutorials",
      series: "/series",
      admin: "/admin/workspace",
      settings: "/settings",
    };
    router.push(routes[tab]);
  };

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    document.documentElement.classList.toggle("light", !newDark);
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode; description: string }[] = [
    { id: "home", label: "首页", icon: <Home size={18} />, description: "浏览推荐内容" },
    { id: "series", label: "系列", icon: <FolderOpen size={18} />, description: "系列中心" },
    { id: "tutorials", label: "教程", icon: <BookOpen size={18} />, description: "所有教程" },
    { id: "admin", label: "管理", icon: <Shield size={18} />, description: "工作区与系列" },
    { id: "settings", label: "设置", icon: <Settings size={18} />, description: "应用设置" },
  ];

  return (
    <header className="h-14 bg-background/95 backdrop-blur-xl border-b border-border flex items-center px-4 gap-4 shrink-0 relative z-50">
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-md">
          <Sparkles className="text-primary-foreground" size={18} />
        </div>
        <div className="hidden md:block">
          <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Innate
          </span>
          <span className="block text-xs text-muted-foreground -mt-0.5">Playground</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="hidden md:flex items-center gap-1 ml-2 bg-muted/50 rounded-xl p-1 border border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`
              relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === tab.id
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }
            `}
          >
            {activeTab === tab.id && (
              <span className="absolute inset-0 bg-primary rounded-lg opacity-90" />
            )}
            <span className="relative flex items-center gap-1.5">
              {tab.icon}
              {tab.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2 text-muted-foreground hover:text-foreground"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Search Bar */}
      <div className="flex-1 max-w-sm ml-auto">
        <div
          className={`relative transition-all duration-300 ${isSearchFocused ? "scale-105" : ""}`}
        >
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
              isSearchFocused ? "text-primary" : "text-muted-foreground"
            }`}
            size={16}
          />
          <input
            type="text"
            placeholder="搜索教程、系列..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                router.push(`/tutorials?q=${encodeURIComponent(searchQuery.trim())}`);
                (e.target as HTMLInputElement).blur();
              }
            }}
            className={`
              w-full pl-10 pr-4 py-2 bg-background border rounded-lg text-sm
              text-foreground placeholder:text-muted-foreground
              focus:outline-none transition-all duration-200
              ${isSearchFocused
                ? "border-primary ring-1 ring-primary/30"
                : "border-border hover:border-muted-foreground/30"
              }
            `}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="shrink-0"
        title={isDark ? "切换亮色主题" : "切换暗色主题"}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </Button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 md:hidden bg-background/95 backdrop-blur-xl border-b border-border animate-in slide-in-from-top-2">
          <nav className="flex flex-col p-3 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  handleTabChange(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all
                  ${activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                `}
              >
                {tab.icon}
                <div>
                  <span className="font-medium block">{tab.label}</span>
                  <span className="text-xs opacity-70">{tab.description}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
