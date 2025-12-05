import {
  BookOpen,
  Calendar,
  Code,
  History,
  LayoutDashboard,
  Library,
  MessageCircle,
  NotebookPen,
  PencilLine,
} from "lucide-react";
import {
  AppSidebar,
  type SidebarSection,
} from "@/components/common/app-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

const sidebarSections: SidebarSection[] = [
  {
    label: "Main",
    items: [
      {
        label: "Dashboard",
        href: "/student/dashboard",
        icon: <LayoutDashboard />,
      },
      {
        label: "Exams",
        icon: <NotebookPen />,
        defaultOpen: true,
        submenu: [
          {
            label: "Take Exam",
            href: "/student/exams/take-exam",
            icon: <PencilLine />,
          },
          {
            label: "Upcoming Exams",
            href: "/student/exams/upcoming",
            icon: <Calendar />,
          },
          {
            label: "Past Exams",
            href: "/student/exams/past",
            icon: <History />,
          },
        ],
      },
    ],
  },
  {
    label: "Practice",
    items: [
      {
        label: "All Problems",
        href: "/student/problems",
        icon: <Code />,
      },
      {
        label: "Collections",
        href: "/student/collections",
        icon: <Library />,
      },
    ],
  },
  {
    label: "Explore",
    items: [
      {
        label: "Courses",
        href: "/student/courses",
        icon: <BookOpen />,
      },
      {
        label: "Discussions",
        href: "/student/discussions",
        icon: <MessageCircle />,
      },
    ],
  },
];

import { Header } from "@/components/common/header";
import { getNotifications } from "@/actions/notifications";

// ... existing imports ...

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const notifications = await getNotifications();

  return (
    <div className="flex w-screen h-screen bg-background">
      <AppSidebar sections={sidebarSections} />
      <div className="flex-1 relative h-screen w-full overflow-hidden">
        <div className="absolute top-0 left-0 right-0 z-50">
          <Header notifications={notifications} />
        </div>
        <ScrollArea className="h-full w-full">
          <div className="pt-14">{children}</div>
        </ScrollArea>
      </div>
    </div>
  );
}
