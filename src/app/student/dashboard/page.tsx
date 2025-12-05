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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="xl:col-span-2 space-y-6">
            <PerformanceChart />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UpcomingExamsWidget />
              <RecentActivity />
            </div>
          </div>

          {/* Right Column - Progress & Links */}
          <div className="space-y-6">
            <QuickLinks />
            <CategoryProgress />
            <DifficultyChart />
          </div>
        </div>
      </div>
    </div>
  );
}
