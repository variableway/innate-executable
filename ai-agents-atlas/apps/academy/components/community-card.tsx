"use client"

import Image from "next/image"
import Link from "next/link"
import type { Community } from "@/lib/types"

interface CommunityCardProps {
  community: Community
  isTrending?: boolean
}

export function CommunityCard({ community, isTrending = false }: CommunityCardProps) {
  return (
    <Link
      href={`/community/${community.id}`}
      className="block group"
    >
      <div className={`relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-3 group-hover:shadow-md transition-shadow ${
        isTrending ? 'aspect-square' : 'aspect-video'
      }`}>
        {community.image ? (
          <Image
            src={community.image}
            alt={community.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-gray-400 text-4xl">🏠</div>
          </div>
        )}
      </div>
      <div>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-sm font-semibold text-foreground">{community.price}</span>
          {community.priceType && (
            <span className="text-xs text-muted-foreground">{community.priceType}</span>
          )}
        </div>
        <p className="text-sm text-foreground leading-snug line-clamp-2 mb-1 font-medium">
          {community.title}
        </p>
        <p className="text-xs text-muted-foreground">{community.organization}</p>
      </div>
    </Link>
  )
}
