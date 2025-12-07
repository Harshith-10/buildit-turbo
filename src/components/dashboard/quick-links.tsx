"use client";

import {
  BarChart3,
  Bookmark,
  BookOpen,
  Code2,
  History,
  Play,
} from "lucide-react";
import Link from "next/link";
import {
  Tilt,
  TiltContent,
} from "@/components/animate-ui/primitives/effects/tilt";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const quickLinks = [
  {
    title: "Take Exam",
    description: "Start a new exam",
    href: "/student/exams/take-exam",
    icon: Play,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
  },
  {
    title: "Practice",
    description: "Solve problems",
    href: "/student/problems",
    icon: Code2,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10 group-hover:bg-blue-500/20",
  },
  {
    title: "Past Exams",
    description: "Review results",
    href: "/student/exams/past",
    icon: History,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10 group-hover:bg-amber-500/20",
  },
  {
    title: "Leaderboard",
    description: "View rankings",
    href: "/student/leaderboard",
    icon: BarChart3,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10 group-hover:bg-purple-500/20",
  },
  {
    title: "Bookmarks",
    description: "Saved problems",
    href: "/student/problems?bookmarked=true",
    icon: Bookmark,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10 group-hover:bg-pink-500/20",
  },
  {
    title: "Study Guide",
    description: "Learning resources",
    href: "/student/resources",
    icon: BookOpen,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10 group-hover:bg-cyan-500/20",
  },
];

export function QuickLinks() {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Quick Links</CardTitle>
        <CardDescription>Jump to common actions</CardDescription>
      </CardHeader>
      <CardContent className="h-full">
        <div className="grid grid-cols-3 gap-3 h-full">
          {quickLinks.map((link) => (
            <Link key={link.title} href={link.href}>
              <Tilt maxTilt={30} className="group w-full h-full ">
                <TiltContent
                  className={cn(
                    "w-full h-full flex flex-col items-center justify-center gap-2 rounded-lg p-4 text-center transition-colors",
                    link.bgColor,
                  )}
                >
                  <link.icon className={cn("h-6 w-6", link.color)} />
                  <div>
                    <p className="text-sm font-medium">{link.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {link.description}
                    </p>
                  </div>
                </TiltContent>
              </Tilt>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
