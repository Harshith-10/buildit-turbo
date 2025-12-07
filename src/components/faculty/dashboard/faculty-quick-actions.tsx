"use client";

import {
  BookOpen,
  FilePlus,
  FileQuestion,
  GraduationCap,
  Library,
  PlusCircle,
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

const quickActions = [
  {
    title: "New Question",
    description: "Create a problem",
    href: "/faculty/questions/create",
    icon: FilePlus,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
  },
  {
    title: "New Exam",
    description: "Create an exam",
    href: "/faculty/exams/create",
    icon: PlusCircle,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10 group-hover:bg-blue-500/20",
  },
  {
    title: "New Collection",
    description: "Create a collection",
    href: "/faculty/collections/create",
    icon: Library,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10 group-hover:bg-amber-500/20",
  },
  {
    title: "Questions",
    description: "Manage questions",
    href: "/faculty/questions",
    icon: FileQuestion,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10 group-hover:bg-purple-500/20",
  },
  {
    title: "Exams",
    description: "Manage exams",
    href: "/faculty/exams",
    icon: GraduationCap,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10 group-hover:bg-pink-500/20",
  },
  {
    title: "Collections",
    description: "Manage collections",
    href: "/faculty/collections",
    icon: BookOpen,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10 group-hover:bg-cyan-500/20",
  },
];

export function FacultyQuickActions() {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="h-full">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 h-full">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Tilt maxTilt={30} className="group w-full h-full">
                <TiltContent
                  className={cn(
                    "w-full h-full flex flex-col items-center justify-center gap-2 rounded-lg p-4 text-center transition-colors",
                    action.bgColor,
                  )}
                >
                  <action.icon className={cn("h-6 w-6", action.color)} />
                  <div>
                    <p className="text-sm font-medium">{action.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
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
