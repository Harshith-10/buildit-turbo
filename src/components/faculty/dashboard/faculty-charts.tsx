"use client";

import { BarChart3, PieChartIcon } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EmptyOutline } from "@/components/common/empty-outline";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// --- Difficulty Chart ---

function DifficultyTooltip({
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

interface FacultyDifficultyChartProps {
  data: DifficultyData[];
}

export function FacultyDifficultyChart({ data }: FacultyDifficultyChartProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Difficulty Distribution</CardTitle>
        <CardDescription>Problems created by difficulty</CardDescription>
      </CardHeader>
      <CardContent className="h-full flex flex-col items-center justify-center">
        {data.length ? (
          <>
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
                  <Tooltip content={<DifficultyTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
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
          </>
        ) : (
          <EmptyOutline
            title="No Data"
            description="No difficulty data available"
            icon={<PieChartIcon />}
          />
        )}
      </CardContent>
    </Card>
  );
}

// --- Exam Status Chart ---

interface ExamStatusData {
  name: string;
  value: number;
}

interface FacultyExamStatusChartProps {
  data: ExamStatusData[];
}

export function FacultyExamStatusChart({ data }: FacultyExamStatusChartProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Exam Status</CardTitle>
        <CardDescription>Overview of exam statuses</CardDescription>
      </CardHeader>
      <CardContent className="h-full">
        {data.length ? (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  cursor={{ fill: "var(--muted)" }}
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius)",
                  }}
                  itemStyle={{ color: "var(--popover-foreground)" }}
                />
                <Bar
                  dataKey="value"
                  fill="var(--primary)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyOutline
            title="No Data"
            description="No exam status data available"
            icon={<BarChart3 />}
          />
        )}
      </CardContent>
    </Card>
  );
}
