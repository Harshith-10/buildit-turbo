import {
  BookOpen,
  FileText,
  LayoutDashboard,
  Library,
  Trash,
} from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getNotifications } from "@/actions/student/notifications";
import { SidebarProvider } from "@/components/animate-ui/components/radix/sidebar";
import {
  AppSidebar,
  type SidebarSection,
} from "@/components/common/app-sidebar";
import { Header } from "@/components/common/header";
import { auth } from "@/lib/auth";

const facultySections: SidebarSection[] = [
  {
    label: "Management",
    items: [
      {
        icon: <LayoutDashboard className="h-4 w-4" />,
        label: "Dashboard",
        href: "/faculty/dashboard",
      },
      {
        icon: <FileText className="h-4 w-4" />,
        label: "Questions",
        submenu: [
          {
            icon: <FileText className="h-4 w-4" />,
            label: "All Questions",
            href: "/faculty/questions/all-questions",
          },
          {
            icon: <FileText className="h-4 w-4" />,
            label: "Create Question",
            href: "/faculty/questions/create",
          },
        ],
      },
      {
        icon: <Library className="h-4 w-4" />,
        label: "Collections",
        submenu: [
          {
            icon: <Library className="h-4 w-4" />,
            label: "All Collections",
            href: "/faculty/collections/all-collections",
          },
          {
            icon: <Library className="h-4 w-4" />,
            label: "Create Collection",
            href: "/faculty/collections/create",
          },
        ],
      },
      {
        icon: <BookOpen className="h-4 w-4" />,
        label: "Exams",
        submenu: [
          {
            icon: <BookOpen className="h-4 w-4" />,
            label: "All Exams",
            href: "/faculty/exams/all-exams",
          },
          {
            icon: <BookOpen className="h-4 w-4" />,
            label: "Create Exam",
            href: "/faculty/exams/create",
          },
        ],
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        icon: <Trash className="h-4 w-4" />,
        label: "Recycle Bin",
        href: "/faculty/recycle-bin",
      },
    ],
  },
];

export default async function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  if (session.user.role !== "faculty") {
    if (session.user.role === "admin") {
      redirect("/admin/dashboard");
    }
    if (session.user.role === "student") {
      redirect("/student/dashboard");
    }
    redirect("/");
  }

  const notifications = await getNotifications();

  return (
    <SidebarProvider>
      <AppSidebar sections={facultySections} />
      <main className="flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out">
        <Header notifications={notifications} />
        <div className="flex-1 p-6 space-y-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}
