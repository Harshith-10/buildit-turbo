"use client";

import { AlertTriangle } from "lucide-react";

interface MalpracticeIndicatorProps {
  count: number;
}

export function MalpracticeIndicator({ count }: MalpracticeIndicatorProps) {
  return (
    <div
      className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium ${
        count > 0
          ? "border-red-500 bg-red-500/10 text-red-500"
          : "bg-background text-muted-foreground"
      }`}
    >
      <AlertTriangle className="h-4 w-4" />
      <span>
        {count} Warning{count !== 1 ? "s" : ""}
      </span>
    </div>
  );
}
