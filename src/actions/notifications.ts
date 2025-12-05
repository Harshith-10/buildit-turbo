"use server";

import { db } from "@/db";
import { notifications } from "@/db/schema/notifications";
import { auth } from "@/lib/auth";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function getNotifications() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return [];
  }

  const data = await db
    .select()
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, session.user.id),
        eq(notifications.isRead, false),
      ),
    )
    .orderBy(desc(notifications.createdAt));

  return data;
}

export async function markAsRead(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return;
  }

  await db
    .update(notifications)
    .set({ isRead: true })
    .where(
      and(eq(notifications.id, id), eq(notifications.userId, session.user.id)),
    );

  revalidatePath("/");
}

export async function markAllAsRead() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return;
  }

  await db
    .update(notifications)
    .set({ isRead: true })
    .where(
      and(
        eq(notifications.userId, session.user.id),
        eq(notifications.isRead, false),
      ),
    );

  revalidatePath("/");
}
