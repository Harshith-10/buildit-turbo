import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";

async function checkTablesExist(): Promise<boolean> {
  try {
    // Try a simple query to check if the user table exists
    await db.execute(sql`SELECT 1 FROM "user" LIMIT 1`);
    return true;
  } catch {
    return false;
  }
}

export async function seedUsers(): Promise<{
  facultyUser: string;
  adminUser: string;
  studentUser: string;
} | null> {
  try {
    const tablesExist = await checkTablesExist();
    if (!tablesExist) {
      console.log("Error! Tables do not exist.");
      console.log("Please run the following command to create the tables:");
      console.log("npx drizzle-kit push");
      return null;
    }

    console.log("Resetting users...");
    await db.delete(user);

    console.log("Seeding admin user...");
    const adminUser = await auth.api.signUpEmail({
      body: {
        email: "admin@buildit.com",
        password: "password1234",
        name: "Admin",
        username: "admin",
        displayUsername: "Admin",
      },
    });

    if (!adminUser?.user) {
      throw new Error("Failed to create admin user");
    }

    await db
      .update(user)
      .set({ role: "admin" })
      .where(eq(user.id, adminUser.user.id));
    console.log("Admin user created successfully.");

    console.log("Seeding faculty user...");
    const facultyUser = await auth.api.signUpEmail({
      body: {
        email: "s.lakshmanachari@iare.ac.in",
        password: "password1234",
        name: "S. Lakshman Achari",
        username: "lakshman",
        displayUsername: "Lakshman",
      },
    });

    if (!facultyUser?.user) {
      throw new Error("Failed to create faculty user");
    }

    await db
      .update(user)
      .set({ role: "faculty" })
      .where(eq(user.id, facultyUser.user.id));
    console.log("Faculty user created successfully.");

    console.log("Creating student users...");
    const studentUser = await auth.api.signUpEmail({
      body: {
        email: "harshu@buildit.com",
        password: "password1234",
        name: "Harshith Doddipalli",
        username: "harshu",
        displayUsername: "Harshith",
      },
    });

    if (!studentUser?.user) {
      throw new Error("Failed to create student user");
    }

    // New users are students by default
    // db.update(user).set({ role: "student" }).where(eq(user.id, studentUser.user.id));
    console.log("Student user created successfully.");

    return {
      facultyUser: facultyUser.user.id,
      adminUser: adminUser.user.id,
      studentUser: studentUser.user.id,
    };
  } catch (error) {
    console.error("Error seeding users:", error);
    return null;
  }
}
