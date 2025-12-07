import { type NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

export default async function proxy(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  const adminRoutes = ["/admin", "/api/admin"];
  const facultyRoutes = ["/faculty", "/api/faculty"];
  const studentRoutes = ["/student", "/api/student"];
  const authPages = ["/auth"];
  const authApiRoutes = ["/api/auth"];

  const isRoute = (routes: string[]) =>
    routes.some((route) => pathName.startsWith(route));

  const isAdminRoute = isRoute(adminRoutes);
  const isFacultyRoute = isRoute(facultyRoutes);
  const isStudentRoute = isRoute(studentRoutes);
  const isAuthPage = isRoute(authPages);
  const isAuthApiRoute = isRoute(authApiRoutes);

  // Allow public API routes immediately
  if (isAuthApiRoute) {
    return NextResponse.next();
  }

  const isProtectedRoute = isAdminRoute || isFacultyRoute || isStudentRoute;

  if (pathName === "/") {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // If it's not a protected route and not an auth page, skip session check
  if (!isProtectedRoute && !isAuthPage) {
    return NextResponse.next();
  }

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      if (isAuthPage) {
        return NextResponse.next();
      }
      // Redirect to login
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    // User is logged in
    if (isAuthPage) {
      if (session.user.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      if (session.user.role === "faculty") {
        return NextResponse.redirect(new URL("/faculty", request.url));
      }
      return NextResponse.redirect(new URL("/student", request.url));
    }

    if (isAdminRoute && session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isFacultyRoute && session.user.role !== "faculty") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (
      isStudentRoute &&
      session.user.role !== "student" &&
      session.user.role !== "faculty"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware auth error:", error);
    if (!isAuthPage) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
