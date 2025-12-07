import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function StudentRootLayout({
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

  if (session.user.role !== "student") {
    if (session.user.role === "admin") {
      redirect("/admin/dashboard");
    }
    if (session.user.role === "faculty") {
      redirect("/faculty/dashboard");
    }
    redirect("/");
  }

  return <>{children}</>;
}
