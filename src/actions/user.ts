"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { auth } from "@/lib/auth";

export interface UserFastData {
  username: string | null;
  displayUsername: string | null;
  email: string;
  name: string;
  image: string | null;
}

export interface UserFullData extends UserFastData {
  role: string;
  rank: number | null;
  problemsSolved: number | null;
  totalProblems: number | null;
  examsPassed: number | null;
  totalExams: number | null;
  streak: number | null;
}

/**
 * Get minimal user data from the session (fast, no DB query)
 */
export async function getUserFast(): Promise<UserFastData | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const { username, displayUsername, email, name, image } = session.user;

  return {
    username: username ?? null,
    displayUsername: displayUsername ?? null,
    email,
    name,
    image: image ?? null,
  };
}

/**
 * Get full user data from the database
 */
export async function getUserFull(): Promise<UserFullData | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const [userData] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (!userData) {
    return null;
  }

  return {
    username: userData.username,
    displayUsername: userData.displayUsername,
    email: userData.email,
    name: userData.name,
    role: userData.role,
    image: userData.image,
    rank: userData.rank,
    problemsSolved: userData.problemsSolved,
    totalProblems: userData.totalProblems,
    examsPassed: userData.examsPassed,
    totalExams: userData.totalExams,
    streak: userData.streak,
  };
}
