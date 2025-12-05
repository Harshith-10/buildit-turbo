import "dotenv/config";
import { execSync } from "node:child_process";
import { db } from "../src/db";
import { user } from "../src/db/schema";

async function setup() {
  console.log("Pushing schema to database...");
  try {
    execSync("npx drizzle-kit push", { stdio: "inherit" });
  } catch (error) {
    console.error("Error pushing schema:", error);
    process.exit(1);
  }

  console.log("Creating default admin user...");
  try {
    await db
      .insert(user)
      .values({
        id: "admin-user",
        name: "Harshith Doddipalli",
        email: "23951A052X@iare.ac.in",
        role: "admin",
        image: "/harsh.png",
      })
      .onConflictDoNothing({ target: user.email });
    console.log("Default user created.");
  } catch (error) {
    console.error("Error creating user:", error);
    process.exit(1);
  }

  console.log("Setup complete.");
  process.exit(0);
}

setup();
