"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type StarRatingProps = {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readOnly?: boolean;
};

export function StarRating({ value, onChange, size = 18, readOnly = true }: StarRatingProps) {
  const rounded = Math.round(value);

  return (
    <div className="inline-flex items-center gap-1" role={readOnly ? "img" : "radiogroup"} aria-label={`Rating: ${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1;
        const active = starValue <= rounded;
        return (
          <button
            key={starValue}
            type="button"
            disabled={readOnly}
            role={readOnly ? undefined : "radio"}
            aria-checked={readOnly ? undefined : value === starValue}
            aria-label={`Set rating to ${starValue}`}
            className={cn(
              "transition",
              readOnly ? "cursor-default" : "cursor-pointer hover:scale-105",
              active ? "text-amber-400" : "text-slate-300",
            )}
            onClick={() => onChange?.(starValue)}
          >
            <Star size={size} fill={active ? "currentColor" : "none"} />
          </button>
        );
      })}
    </div>
  );
}
