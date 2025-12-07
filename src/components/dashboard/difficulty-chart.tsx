"use client";

import { PieChartIcon } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
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

interface DifficultyData {
  name: string;
  value: number;
  color: string;
}

interface DifficultyChartProps {
  data: DifficultyData[];
}

export function DifficultyChart({ data }: DifficultyChartProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Difficulty Breakdown</CardTitle>
        <CardDescription>Problems solved by difficulty</CardDescription>
      </CardHeader>
      <CardContent className="h-full flex items-center justify-center">
        {data.length ? (
          <div className="h-[200px] w-full overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyOutline
            title="No Data"
            description="No data available"
            icon={<PieChartIcon />}
          />
        )}
        <div className="flex justify-center gap-4 mt-2">
          {data.map((item) => (
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
