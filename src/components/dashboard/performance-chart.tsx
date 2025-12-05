"use client";

import axios from "axios";
import { Code } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyOutline } from "../common/empty-outline";

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-card p-3 shadow-md">
        <p className="text-sm font-medium mb-2">{label}</p>
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center gap-2 text-sm">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">
              {entry.dataKey === "problemsSolved"
                ? "Problems Solved"
                : "Exam Score"}
            </span>
            <span className="font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

interface PerformanceChartProps {
  initialData?: {
    month: string;
    problemsSolved: number;
    examScore: number;
  }[];
}

export function PerformanceChart({ initialData }: PerformanceChartProps) {
  const [performanceData, setPerformanceData] = useState<
    {
      month: string;
      problemsSolved: number;
      examScore: number;
    }[]
  >(initialData || []);

  useEffect(() => {
    if (!initialData) {
      axios.get("/api/student/performance").then((response) => {
        setPerformanceData(response.data);
      });
    }
  }, [initialData]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
        <CardDescription>Your progress over the past 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full overflow-hidden">
          {!performanceData.length && (
            <EmptyOutline
              title="No performance data"
              description="You have no performance data."
              icon={<Code />}
            />
          )}
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={performanceData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="problemsGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="examGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-border"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="problemsSolved"
                stroke="#22c55e"
                strokeWidth={2}
                fill="url(#problemsGradient)"
              />
              <Area
                type="monotone"
                dataKey="examScore"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#examGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-sm text-muted-foreground">
              Problems Solved
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-sm text-muted-foreground">Exam Score</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
