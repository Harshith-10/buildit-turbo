"use client";

import axios from "axios";
import { Flame, Target, TrendingUp, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { Tilt, TiltContent } from "../animate-ui/primitives/effects/tilt";

export function StatsCards() {
  const [stats, setStats] = useState<{
    problemsSolved: number;
    totalProblems: number;
    examsPassed: number;
    totalExams: number;
    streak: number;
    rank: number;
  } | null>(null);

  useEffect(() => {
    axios.get("/api/student/stats").then((response) => {
      setStats(response.data);
    });
  }, []);

  if (!stats) {
    return null;
  }

  const statsData = [
    {
      title: "Problems Solved",
      value: stats.problemsSolved,
      total: stats.totalProblems.toString(),
      icon: Target,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "group-hover:border-emerald-500",
      progress:
        stats.totalProblems > 0
          ? (stats.problemsSolved / stats.totalProblems) * 100
          : 0,
    },
    {
      title: "Exams Passed",
      value: stats.examsPassed,
      total: stats.totalExams.toString(),
      icon: Trophy,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "group-hover:border-amber-500",
      progress:
        stats.totalExams > 0 ? (stats.examsPassed / stats.totalExams) * 100 : 0,
    },
    {
      title: "Current Streak",
      value: stats.streak,
      suffix: "days",
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "group-hover:border-orange-500",
    },
    {
      title: "Institute Rank",
      value: `#${stats.rank}`,
      total: "0",
      change: "",
      icon: TrendingUp,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "group-hover:border-blue-500",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {statsData.map((stat) => (
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
                      <span className="text-sm text-muted-foreground">
                        {stat.suffix}
                      </span>
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
