"use client";

import { Calendar, Lock, Trophy, Unlock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Collection {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  isPrivate: boolean;
  type: "personal" | "practice_sheet" | "company";
  totalQuestions: number | null;
  updatedAt: Date;
  creatorId: string;
}

interface CollectionCardProps {
  collection: Collection;
  viewMode: "grid" | "list";
  actionLabel: string;
  actionLink?: string;
}

export function CollectionCard({
  collection,
  viewMode,
  actionLabel,
  actionLink,
}: CollectionCardProps) {
  const isGrid = viewMode === "grid";

  const typeColor = {
    personal: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    practice_sheet: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
    company: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
  };

  const privacyColor = {
    true: "bg-rose-500/10 text-rose-500", // Private
    false: "bg-emerald-500/10 text-emerald-500", // Public
  };

  if (isGrid) {
    return (
      <Card className="flex flex-col h-full transition-all hover:shadow-md">
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <Badge
              variant="secondary"
              className={cn("capitalize", typeColor[collection.type])}
            >
              {collection.type.replace("_", " ")}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "capitalize border-0 gap-1",
                privacyColor[String(collection.isPrivate) as "true" | "false"],
              )}
            >
              {collection.isPrivate ? (
                <>
                  <Lock className="h-3 w-3" /> Private
                </>
              ) : (
                <>
                  <Unlock className="h-3 w-3" /> Public
                </>
              )}
            </Badge>
          </div>
          <CardTitle className="line-clamp-1">{collection.title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {collection.description || "No description provided."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span>{collection.totalQuestions || 0} Questions</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Updated {collection.updatedAt.toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href={actionLink || "#"}>{actionLabel}</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col sm:flex-row transition-all hover:shadow-md">
      <div className="flex-1 p-6">
        <div className="flex justify-between items-start mb-2">
          <div className="space-y-1">
            <CardTitle>{collection.title}</CardTitle>
            <CardDescription className="line-clamp-1">
              {collection.description || "No description provided."}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge
              variant="secondary"
              className={cn("capitalize", typeColor[collection.type])}
            >
              {collection.type.replace("_", " ")}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "capitalize border-0 gap-1",
                privacyColor[String(collection.isPrivate) as "true" | "false"],
              )}
            >
              {collection.isPrivate ? (
                <>
                  <Lock className="h-3 w-3" /> Private
                </>
              ) : (
                <>
                  <Unlock className="h-3 w-3" /> Public
                </>
              )}
            </Badge>
          </div>
        </div>
        <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span>{collection.totalQuestions || 0} Questions</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Updated {collection.updatedAt.toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <div className="p-6 pt-0 sm:pt-6 flex items-center justify-end sm:border-l">
        <Button asChild className="w-full sm:w-auto">
          <Link href={actionLink || "#"}>{actionLabel}</Link>
        </Button>
      </div>
    </Card>
  );
}
