import { Header } from "@/components/common/header";
import { CategoryProgress } from "@/components/dashboard/category-progress";
import { DifficultyChart } from "@/components/dashboard/difficulty-chart";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { QuickLinks } from "@/components/dashboard/quick-links";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { UpcomingExamsWidget } from "@/components/dashboard/upcoming-exams-widget";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 p-6 space-y-6">
        {/* Stats Overview */}
        <StatsCards />

        <div className="grid grid-cols-5 w-full gap-6">
          <div className="col-span-3">
            <PerformanceChart />
          </div>
          <div className="col-span-2">
            <QuickLinks />
          </div>
          <div className="col-span-2">
            <RecentActivity />
          </div>
          <div className="col-span-3">
            <UpcomingExamsWidget />
          </div>
          <div className="col-span-3">
            <CategoryProgress />
          </div>
          <div className="col-span-2">
            <DifficultyChart />
          </div>
        </div>
      </div>
    </div>
  );
}
