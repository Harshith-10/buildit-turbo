"use client";

import axios from "axios";
import { History, Library } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EmptyOutline } from "../common/empty-outline";

interface CategoryProgressProps {
  categoryProgress?: {
    category: string;
    solved: number;
    total: number;
  }[];
}

export function CategoryProgress({
  categoryProgress: initialData,
}: CategoryProgressProps) {
  const [categoryProgress, setCategoryProgress] = useState<
    {
      category: string;
      solved: number;
      total: number;
    }[]
  >(initialData || []);

  useEffect(() => {
    if (!initialData) {
      axios.get("/api/student/category-progress").then((response) => {
        setCategoryProgress(response.data);
      });
    }
  }, [initialData]);
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Category Progress</CardTitle>
        <CardDescription>Problems solved by category</CardDescription>
      </CardHeader>
      <CardContent className="h-full space-y-4">
        {!categoryProgress.length && (
          <EmptyOutline
            title="No category progress"
            description="You have not solved any problems yet."
            icon={<Library />}
          />
        )}
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
