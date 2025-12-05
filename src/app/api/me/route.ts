import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const [userData] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (!userData) {
    return new NextResponse("User not found", { status: 404 });
  }

  const {
    username,
    displayUsername,
    email,
    name,
    role,
    image,
    rank,
    problemsSolved,
    totalProblems,
    examsPassed,
    totalExams,
    streak,
  } = userData;

  return NextResponse.json({
    username,
    displayUsername,
    email,
    name,
    role,
    image,
    rank,
    problemsSolved,
    totalProblems,
    examsPassed,
    totalExams,
    streak,
  });
}
