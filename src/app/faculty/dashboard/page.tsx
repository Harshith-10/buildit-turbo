import { desc, eq, sql } from "drizzle-orm";
import {
  FacultyDifficultyChart,
  FacultyExamStatusChart,
} from "@/components/faculty/dashboard/faculty-charts";
import { FacultyQuickActions } from "@/components/faculty/dashboard/faculty-quick-actions";
import { FacultyRecentActivity } from "@/components/faculty/dashboard/faculty-recent-activity";
import { FacultyStatsCards } from "@/components/faculty/dashboard/faculty-stats-cards";
import { db } from "@/db";
import { collections, exams, problems, user } from "@/db/schema";

async function getDashboardData() {
  const statsQuery = Promise.all([
    // Basic Stats
    db
      .select({ count: sql<number>`count(*)` })
      .from(problems),
    db.select({ count: sql<number>`count(*)` }).from(collections),
    db.select({ count: sql<number>`count(*)` }).from(exams),
    db
      .select({ count: sql<number>`count(*)` })
      .from(user)
      .where(eq(user.role, "student")),
  ]);

  const chartsQuery = Promise.all([
    // Charts Data
    db
      .select({
        difficulty: problems.difficulty,
        count: sql<number>`count(*)`,
      })
      .from(problems)
      .groupBy(problems.difficulty),
    db
      .select({
        status: exams.status,
        count: sql<number>`count(*)`,
      })
      .from(exams)
      .groupBy(exams.status),
  ]);

  const activityQuery = Promise.all([
    // Recent Activity
    db
      .select({
        id: problems.id,
        title: problems.title,
        createdAt: problems.createdAt,
      })
      .from(problems)
      .orderBy(desc(problems.createdAt))
      .limit(5),
    db
      .select({
        id: exams.id,
        title: exams.title,
        status: exams.status,
        createdAt: exams.createdAt,
      })
      .from(exams)
      .orderBy(desc(exams.createdAt))
      .limit(5),
  ]);

  const [
    [questionsCount, collectionsCount, examsCount, studentsCount],
    [questionDistribution, examStatusDistribution],
    [recentQuestions, recentExams],
  ] = await Promise.all([statsQuery, chartsQuery, activityQuery]);

  // Process Chart Data
  const difficultyColors: Record<string, string> = {
    easy: "#22c55e", // green-500
    medium: "#eab308", // yellow-500
    hard: "#ef4444", // red-500
  };

  const formattedQuestionDist = questionDistribution.map((item) => ({
    name: item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1),
    value: Number(item.count),
    color: difficultyColors[item.difficulty] || "#888888",
  }));

  const formattedExamStatus = examStatusDistribution.map((item) => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    value: Number(item.count),
  }));

  // Process Recent Activity
  const activities = [
    ...recentQuestions.map((q) => ({
      id: q.id,
      type: "question" as const,
      title: q.title,
      timestamp: q.createdAt,
    })),
    ...recentExams.map((e) => ({
      id: e.id,
      type: "exam" as const,
      title: e.title,
      status: e.status,
      timestamp: e.createdAt,
    })),
  ]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5);

  return {
    stats: {
      questions: Number(questionsCount[0]?.count || 0),
      collections: Number(collectionsCount[0]?.count || 0),
      exams: Number(examsCount[0]?.count || 0),
      students: Number(studentsCount[0]?.count || 0),
    },
    charts: {
      questions: formattedQuestionDist,
      exams: formattedExamStatus,
    },
    recentActivity: activities,
  };
}

export default async function FacultyDashboard() {
  const data = await getDashboardData();

  return (
    <div className="flex flex-col min-h-screen animate-in fade-in duration-500">
      <div className="flex-1 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening in your portal.
          </p>
        </div>

        <FacultyStatsCards stats={data.stats} />

        <div className="grid grid-cols-5 w-full gap-6">
          <div className="col-span-3">
            <FacultyExamStatusChart data={data.charts.exams} />
          </div>
          <div className="col-span-2">
            <FacultyQuickActions />
          </div>
          <div className="col-span-2">
            <FacultyRecentActivity activities={data.recentActivity} />
          </div>
          <div className="col-span-3">
            <FacultyDifficultyChart data={data.charts.questions} />
          </div>
        </div>
      </div>
    </div>
  );
}
