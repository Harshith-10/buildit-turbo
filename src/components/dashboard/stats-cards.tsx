"use client";

import axios from "axios";
import { Flame, Target, TrendingUp, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { User } from "@/types/auth";
import { Tilt, TiltContent } from "../animate-ui/primitives/effects/tilt";

export function StatsCards() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    axios.get("/api/me").then((response) => {
      setCurrentUser(response.data);
    });
  }, []);

  if (!currentUser) {
    return null;
  }

  const stats = [
    {
      title: "Problems Solved",
      value: currentUser.problemsSolved,
      total: currentUser.totalProblems,
      icon: Target,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "group-hover:border-emerald-500",
      progress: (currentUser.problemsSolved / currentUser.totalProblems) * 100,
    },
    {
      title: "Exams Passed",
      value: currentUser.examsPassed,
      total: currentUser.totalExams,
      icon: Trophy,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "group-hover:border-amber-500",
      progress: (currentUser.examsPassed / currentUser.totalExams) * 100,
    },
    {
      title: "Current Streak",
      value: currentUser.streak,
      suffix: "days",
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "group-hover:border-orange-500",
    },
    {
      title: "Global Rank",
      value: `#${currentUser.rank}`,
      change: "+5",
      icon: TrendingUp,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "group-hover:border-blue-500",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Tilt key={stat.title} className="h-full group">
          <TiltContent className="h-full">
            <Card
              className={cn(
                "relative overflow-hidden h-full transition-colors duration-500",
                stat.borderColor,
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">{stat.value}</span>
                      {stat.total && (
                        <span className="text-sm text-muted-foreground">
                          / {stat.total}
                        </span>
                      )}
                      {stat.suffix && (
                        <span className="text-sm text-muted-foreground">
                          {stat.suffix}
                        </span>
                      )}
                      {stat.change && (
                        <span className="text-sm text-emerald-500 font-medium">
                          {stat.change}
                        </span>
                      )}
                    </div>
                    {stat.progress !== undefined && (
                      <div className="h-1.5 w-full rounded-full bg-secondary">
                        <div
                          className={`h-full rounded-full ${stat.color.replace("text-", "bg-")}`}
                          style={{ width: `${stat.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TiltContent>
        </Tilt>
      ))}
    </div>
  );
}
