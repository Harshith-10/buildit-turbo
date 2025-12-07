"use server";

import { and, count, countDistinct, eq, gte } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { examSessions, problems, submissions } from "@/db/schema";
import { user } from "@/db/schema/auth";
import { auth } from "@/lib/auth";

export interface StatsData {
  problemsSolved: number | null;
  totalProblems: number | null;
  examsPassed: number | null;
  totalExams: number | null;
  streak: number | null;
  rank: number | null;
}

export interface PerformanceData {
  month: string;
  problemsSolved: number;
  examScore: number;
}

export interface RecentActivityData {
  id: string;
  problemId: string;
  status: string;
  language: string;
  runtime: string;
  memory: string;
  timestamp: string;
  problemTitle: string;
}

export interface UpcomingExamData {
  id: string;
  title: string;
  description: string | null;
  difficulty: "easy" | "medium" | "hard";
  duration: number;
  startDate: Date | null;
  status: string | null;
}

export interface CategoryProgressData {
  category: string;
  solved: number;
  total: number;
}

export interface DifficultyDistributionData {
  name: string;
  value: number;
  color: string;
}

async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function getStats(): Promise<StatsData | null> {
  const session = await getSession();
  if (!session?.user?.id) return null;

  const userData = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
    columns: {
      problemsSolved: true,
      totalProblems: true,
      examsPassed: true,
      totalExams: true,
      streak: true,
      rank: true,
    },
  });

  return userData || null;
}

export async function getPerformanceData(): Promise<PerformanceData[]> {
  const session = await getSession();
  if (!session?.user?.id) return [];

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const userSubmissions = await db.query.submissions.findMany({
    where: and(
      eq(submissions.userId, session.user.id),
      eq(submissions.status, "accepted"),
      gte(submissions.createdAt, sixMonthsAgo),
    ),
    columns: {
      createdAt: true,
    },
  });

  const userExams = await db.query.examSessions.findMany({
    where: and(
      eq(examSessions.userId, session.user.id),
      gte(examSessions.finishTime, sixMonthsAgo),
    ),
    columns: {
      finishTime: true,
      score: true,
    },
  });

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentMonth = new Date().getMonth();

  interface PerformanceEntry {
    month: string;
    problemsSolved: number;
    examScore: number;
    rawMonth: number;
    rawYear: number;
  }

  const performanceData: PerformanceEntry[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(currentMonth - i);
    performanceData.push({
      month: months[d.getMonth()],
      problemsSolved: 0,
      examScore: 0,
      rawMonth: d.getMonth(),
      rawYear: d.getFullYear(),
    });
  }

  userSubmissions.forEach((sub) => {
    const date = new Date(sub.createdAt);
    const entry = performanceData.find(
      (p) => p.rawMonth === date.getMonth() && p.rawYear === date.getFullYear(),
    );
    if (entry) entry.problemsSolved++;
  });

  userExams.forEach((exam) => {
    if (!exam.finishTime) return;
    const date = new Date(exam.finishTime);
    const entry = performanceData.find(
      (p) => p.rawMonth === date.getMonth() && p.rawYear === date.getFullYear(),
    );
    if (entry && exam.score) entry.examScore += exam.score;
  });

  return performanceData.map(({ month, problemsSolved, examScore }) => ({
    month,
    problemsSolved,
    examScore,
  }));
}

export async function getRecentActivity(): Promise<RecentActivityData[]> {
  const session = await getSession();
  if (!session?.user?.id) return [];

  const recentSubmissions = await db.query.submissions.findMany({
    where: eq(submissions.userId, session.user.id),
    orderBy: (submissions, { desc }) => [desc(submissions.createdAt)],
    limit: 5,
    with: {
      problem: true,
    },
  });

  return recentSubmissions.map((sub) => ({
    id: sub.id,
    problemId: sub.problemId,
    status: sub.status,
    language: sub.language,
    runtime: sub.runtime || "N/A",
    memory: sub.memory || "N/A",
    timestamp: sub.createdAt.toISOString(),
    problemTitle: sub.problem.title,
  }));
}

export async function getUpcomingExams(): Promise<UpcomingExamData[]> {
  const session = await getSession();
  if (!session?.user?.id) return [];

  const upcomingExams = await db.query.examSessions.findMany({
    where: and(
      eq(examSessions.userId, session.user.id),
      eq(examSessions.status, "upcoming"),
    ),
    with: {
      exam: true,
    },
    limit: 3,
  });

  return upcomingExams.map((status) => ({
    id: status.exam.id,
    title: status.exam.title,
    description: status.exam.description,
    difficulty: status.exam.difficulty,
    duration: status.exam.duration,
    startDate: status.exam.startDate,
    status: status.status,
  }));
}

export async function getCategoryProgress(): Promise<CategoryProgressData[]> {
  const session = await getSession();
  if (!session?.user?.id) return [];

  const totalProblems = await db
    .select({
      category: problems.category,
      count: count(problems.id),
    })
    .from(problems)
    .groupBy(problems.category);

  const solvedProblems = await db
    .select({
      category: problems.category,
      count: countDistinct(submissions.problemId),
    })
    .from(submissions)
    .innerJoin(problems, eq(submissions.problemId, problems.id))
    .where(
      and(
        eq(submissions.userId, session.user.id),
        eq(submissions.status, "accepted"),
      ),
    )
    .groupBy(problems.category);

  return totalProblems.map((tp) => {
    const solved = solvedProblems.find((sp) => sp.category === tp.category);
    return {
      category: tp.category,
      total: tp.count,
      solved: solved ? solved.count : 0,
    };
  });
}

export async function getDifficultyDistribution(): Promise<
  DifficultyDistributionData[]
> {
  const session = await getSession();
  if (!session?.user?.id) return [];

  const solvedByDifficulty = await db
    .select({
      difficulty: problems.difficulty,
      count: countDistinct(submissions.problemId),
    })
    .from(submissions)
    .innerJoin(problems, eq(submissions.problemId, problems.id))
    .where(
      and(
        eq(submissions.userId, session.user.id),
        eq(submissions.status, "accepted"),
      ),
    )
    .groupBy(problems.difficulty);

  const colors = {
    easy: "#10b981",
    medium: "#f59e0b",
    hard: "#ef4444",
  };

  return solvedByDifficulty.map((item) => ({
    name: item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1),
    value: item.count,
    color: colors[item.difficulty as keyof typeof colors] || "#64748b",
  }));
}
