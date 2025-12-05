"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockDifficultyDistribution } from "./mock-data";

interface DifficultyChartProps {
  difficultyChart?: {
    difficulty: string;
    solved: number;
    total: number;
  }[];
  difficultyDistribution?: {
    name: string;
    value: number;
    color: string;
  }[];
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}) {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="rounded-lg border bg-card p-3 shadow-md">
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: data.payload.color }}
          />
          <span className="font-medium">{data.name}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {data.value} problems
        </p>
      </div>
    );
  }
  return null;
}

export function DifficultyChart({
  difficultyDistribution = mockDifficultyDistribution,
}: DifficultyChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Difficulty Breakdown</CardTitle>
        <CardDescription>Problems solved by difficulty</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[180px] w-full overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={difficultyDistribution}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                {difficultyDistribution.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-2">
          {difficultyDistribution.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-muted-foreground">
                {item.name}:{" "}
                <span className="font-medium text-foreground">
                  {item.value}
                </span>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
