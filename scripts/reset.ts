import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "../src/db";

async function reset() {
  console.log("Resetting database...");
  try {
    await db.execute(sql`DROP SCHEMA public CASCADE;`);
    await db.execute(sql`CREATE SCHEMA public;`);
    await db.execute(sql`GRANT ALL ON SCHEMA public TO public;`);
    await db.execute(
      sql`COMMENT ON SCHEMA public IS 'standard public schema';`,
    );
    console.log("Database reset complete.");
  } catch (error) {
    console.error("Error resetting database:", error);
    process.exit(1);
  }
  process.exit(0);
}

reset();
