import { headers } from "next/headers";
import {
  getCategoryProgress,
  getDifficultyDistribution,
  getPerformanceData,
  getRecentActivity,
  getStats,
  getUpcomingExams,
} from "@/actions/student/dashboard";
import { CategoryProgress } from "@/components/dashboard/category-progress";
import { DifficultyChart } from "@/components/dashboard/difficulty-chart";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { QuickLinks } from "@/components/dashboard/quick-links";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { UpcomingExamsWidget } from "@/components/dashboard/upcoming-exams-widget";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  const name = user?.name || "Student";

  // Time based greeting
  const hour = new Date().getHours();
  let greeting = "Good Morning";
  if (hour >= 12 && hour < 17) greeting = "Good Afternoon";
  if (hour >= 17) greeting = "Good Evening";

  // Random motivation
  const quotes = [
    "Consistency is key to mastery.",
    "Every problem solved is a step forward.",
    "Debug your code, debug your mind.",
    "Small progress is still progress.",
    "The best way to predict the future is to create it.",
  ];
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  // Fetch all dashboard data server-side
  const [
    stats,
    performanceData,
    recentActivity,
    upcomingExams,
    categoryProgress,
    difficultyDistribution,
  ] = await Promise.all([
    getStats(),
    getPerformanceData(),
    getRecentActivity(),
    getUpcomingExams(),
    getCategoryProgress(),
    getDifficultyDistribution(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {greeting}, {name} 👋
          </h1>
          <p className="text-muted-foreground">{quote}</p>
        </div>

        {/* Stats Overview */}
        <StatsCards stats={stats} />

        <div className="grid grid-cols-5 w-full gap-6">
          <div className="col-span-3">
            <PerformanceChart data={performanceData} />
          </div>
          <div className="col-span-2">
            <QuickLinks />
          </div>
          <div className="col-span-2">
            <RecentActivity submissions={recentActivity} />
          </div>
          <div className="col-span-3">
            <UpcomingExamsWidget exams={upcomingExams} />
          </div>
          <div className="col-span-3">
            <CategoryProgress data={categoryProgress} />
          </div>
          <div className="col-span-2">
            <DifficultyChart data={difficultyDistribution} />
          </div>
        </div>
      </div>
    </div>
  );
}
