import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AdminRootLayout({
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

  if (session.user.role !== "admin") {
    if (session.user.role === "faculty") {
      redirect("/faculty/dashboard");
    }
    if (session.user.role === "student") {
      redirect("/student/dashboard");
    }
    redirect("/");
  }

  return <>{children}</>;
}
