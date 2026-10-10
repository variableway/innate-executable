"use client"

import { useState } from "react"
import { Search, ChevronRight } from "lucide-react"
import { CommunityCard } from "@/components/community-card"
import { communities, categories } from "@/lib/data"
import { cn } from "@atlas/ui/lib/utils"
import { Avatar, AvatarFallback } from "@atlas/ui/components/ui/avatar"
import { LeftBar } from "@/components/sidebar"

export default function DiscoverPage() {
  const [activeCategory, setActiveCategory] = useState("Explore")
  const [searchQuery, setSearchQuery] = useState("")

  const trending = communities.slice(0, 5)
  const popular = communities.slice(5, 10)

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Icon Bar */}
      <LeftBar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Minimal Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-black">
                Discover<span className="text-blue-500 font-light ml-0.5">+</span>
              </span>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gray-100 text-gray-600 text-sm font-medium">D</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-balance">
              Whatever it is, there&apos;s a Circle for that
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              Find communities, creators, and products that transform your life
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full border whitespace-nowrap transition-colors",
                  activeCategory === category
                    ? "bg-black text-white border-black"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                )}
              >
                {category}
              </button>
            ))}
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          {/* Trending Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Trending</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {trending.map((community) => (
                <CommunityCard key={community.id} community={community} isTrending={true} />
              ))}
            </div>
          </section>

          {/* Popular Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {popular.map((community) => (
                <CommunityCard key={community.id} community={community} isTrending={false} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
