"use client";

import { FileQuestion, GraduationCap, History } from "lucide-react";
import { EmptyOutline } from "@/components/common/empty-outline";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ActivityItem {
  id: string;
  type: "question" | "exam";
  title: string;
  status?: string;
  timestamp: Date;
}

interface FacultyRecentActivityProps {
  activities: ActivityItem[];
}

export function FacultyRecentActivity({
  activities,
}: FacultyRecentActivityProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest contributions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!activities.length && (
          <EmptyOutline
            title="No recent activity"
            description="You have not created any content yet."
            icon={<History />}
          />
        )}
        {activities.map((activity) => {
          const isQuestion = activity.type === "question";
          const Icon = isQuestion ? FileQuestion : GraduationCap;
          const color = isQuestion ? "text-blue-500" : "text-amber-500";
          const bg = isQuestion ? "bg-blue-500/10" : "bg-amber-500/10";
          const label = isQuestion ? "Question" : "Exam";

          return (
            <div
              key={`${activity.type}-${activity.id}`}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-full p-2 ${bg}`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <div>
                  <p className="font-medium line-clamp-1">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {activity.status && (
                  <Badge variant="outline" className="capitalize">
                    {activity.status}
                  </Badge>
                )}
                <Badge variant="secondary" className={`${bg} ${color}`}>
                  {label}
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
