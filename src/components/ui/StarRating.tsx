"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export default function StarRating({ rating, maxRating = 5, size = "md", interactive, onRate }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  const sizes = { sm: "w-3 h-3", md: "w-4 h-4", lg: "w-6 h-6" };

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }).map((_, i) => {
        const filled = interactive ? (hovered || rating) > i : rating > i;
        return (
          <svg
            key={i}
            className={cn(sizes[size], "transition-colors", interactive && "cursor-pointer")}
            fill={filled ? "#FBBF24" : "none"}
            stroke={filled ? "#FBBF24" : "#D1D5DB"}
            viewBox="0 0 24 24"
            onMouseEnter={() => interactive && setHovered(i + 1)}
            onMouseLeave={() => interactive && setHovered(0)}
            onClick={() => interactive && onRate?.(i + 1)}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      })}
    </div>
  );
}
