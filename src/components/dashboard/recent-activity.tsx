"use client";

import axios from "axios";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  History,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { EmptyOutline } from "@/components/common/empty-outline";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const statusConfig: Record<
  string,
  {
    icon: React.FC<{ className?: string }>;
    color: string;
    bg: string;
    label: string;
  }
> = {
  accepted: {
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    label: "Accepted",
  },
  wrong_answer: {
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-500/10",
    label: "Wrong Answer",
  },
  time_limit: {
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    label: "Time Limit",
  },
  runtime_error: {
    icon: AlertCircle,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    label: "Runtime Error",
  },
  compilation_error: {
    icon: AlertCircle,
    color: "text-red-500",
    bg: "bg-red-500/10",
    label: "Compilation Error",
  },
};

interface RecentActivityProps {
  initialSubmissions?: {
    id: string;
    problemId: string;
    status: string;
    language: string;
    runtime: string;
    memory: string;
    timestamp: string;
    problemTitle: string;
  }[];
}

export function RecentActivity({ initialSubmissions }: RecentActivityProps) {
  const [submissions, setSubmissions] = useState<
    {
      id: string;
      problemId: string;
      status: string;
      language: string;
      runtime: string;
      memory: string;
      timestamp: string;
      problemTitle: string;
    }[]
  >(initialSubmissions || []);

  useEffect(() => {
    if (!initialSubmissions) {
      axios.get("/api/student/recent-activity").then((response) => {
        setSubmissions(response.data);
      });
    }
  }, [initialSubmissions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest submissions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!submissions.length && (
          <EmptyOutline
            title="No recent activity"
            description="You have not submitted any problems yet."
            icon={<History />}
          />
        )}
        {submissions.map((sub) => {
          const status = statusConfig[sub.status] || statusConfig.accepted; // Fallback
          const StatusIcon = status.icon;

          return (
            <div
              key={sub.id}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-full p-2 ${status.bg}`}>
                  <StatusIcon className={`h-4 w-4 ${status.color}`} />
                </div>
                <div>
                  <p className="font-medium">{sub.problemTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    {sub.language} •{" "}
                    {new Date(sub.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {sub.status === "accepted" && (
                  <div className="text-right text-xs text-muted-foreground">
                    <p>{sub.runtime}</p>
                    <p>{sub.memory}</p>
                  </div>
                )}
                <Badge
                  variant="secondary"
                  className={`${status.bg} ${status.color}`}
                >
                  {status.label}
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
