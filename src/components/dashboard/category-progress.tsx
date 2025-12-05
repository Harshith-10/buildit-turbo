"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockCategoryProgress } from "./mock-data";

interface CategoryProgressProps {
  categoryProgress?: {
    category: string;
    solved: number;
    total: number;
  }[];
}

export function CategoryProgress({
  categoryProgress = mockCategoryProgress,
}: CategoryProgressProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Progress</CardTitle>
        <CardDescription>Problems solved by category</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {categoryProgress.map((cat) => (
          <div key={cat.category} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{cat.category}</span>
              <span className="text-muted-foreground">
                {cat.solved}/{cat.total}
              </span>
            </div>
            <Progress value={(cat.solved / cat.total) * 100} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
