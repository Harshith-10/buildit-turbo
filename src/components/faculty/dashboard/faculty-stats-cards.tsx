import { BookOpen, FileQuestion, GraduationCap, Users } from "lucide-react";
import {
  Tilt,
  TiltContent,
} from "@/components/animate-ui/primitives/effects/tilt";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FacultyStatsData {
  questions: number;
  collections: number;
  exams: number;
  students: number;
}

interface FacultyStatsCardsProps {
  stats: FacultyStatsData;
}

export function FacultyStatsCards({ stats }: FacultyStatsCardsProps) {
  const statsData = [
    {
      title: "Total Questions",
      value: stats.questions,
      icon: FileQuestion,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "group-hover:border-emerald-500",
    },
    {
      title: "Collections",
      value: stats.collections,
      icon: BookOpen,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "group-hover:border-blue-500",
    },
    {
      title: "Exams Created",
      value: stats.exams,
      icon: GraduationCap,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "group-hover:border-amber-500",
    },
    {
      title: "Total Students",
      value: stats.students,
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "group-hover:border-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    </div>
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
