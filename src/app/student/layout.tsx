import {
  BookOpen,
  Code,
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
        submenu: [
          {
            label: "Take Exam",
            href: "/student/exams/ongoing",
            icon: <PencilLine />,
          },
          {
            label: "Upcoming Exams",
            href: "/student/exams/upcoming",
            icon: <PencilLine />,
          },
          {
            label: "Past Exams",
            href: "/student/exams/past",
            icon: <PencilLine />,
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

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-screen h-screen">
      <AppSidebar sections={sidebarSections} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
