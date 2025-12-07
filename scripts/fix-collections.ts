import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "../src/db";
import { collections } from "../src/db/schema";

async function fix() {
  console.log("Fixing collections...");
  await db
    .update(collections)
    .set({ isPrivate: false })
    .where(eq(collections.isPublic, true));
  console.log("Done.");
  process.exit(0);
}

fix();
