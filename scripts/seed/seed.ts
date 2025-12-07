import "dotenv/config";
import { seedCollections } from "./seed-collections";
import { seedExamSessions } from "./seed-exam-sessions";
import { seedExams } from "./seed-exams";
import { seedNotifications } from "./seed-notifications";
import { seedProblems } from "./seed-problems";
import { seedResources } from "./seed-resources";
import { seedSubmissions } from "./seed-submissions";
import { seedUserProblemStatus } from "./seed-user-status";
import { seedUsers } from "./seed-users";

async function seed() {
  console.log("Seeding database...\n");

  try {
    // 1. Seed Users
    const users = await seedUsers();
    if (!users) {
      console.error("Failed to seed users");
      return;
    }

    const userId = users.adminUser;

    // 2. Seed Problems
    const problemIds = await seedProblems(userId);
    if (problemIds.length === 0) {
      console.error("Failed to seed problems");
      return;
    }

    // 3. Seed Exams
    const examIds = await seedExams(problemIds);

    // 4. Seed Collections
    const collectionIds = await seedCollections(userId, problemIds);

    // 5. Seed Resources
    const resourceCount = await seedResources(userId);

    // 6. Seed Notifications
    const notificationCount = await seedNotifications(userId);

    // 7. Seed Submissions
    await seedSubmissions(userId, problemIds);

    // 8. Seed User Problem Status
    await seedUserProblemStatus(userId, problemIds);

    // 9. Seed Exam Sessions
    await seedExamSessions(userId, examIds);

    console.log("\n✅ Seeding complete!");
    console.log(`  - ${problemIds.length} problems`);
    console.log(`  - ${examIds.length} exams`);
    console.log(`  - ${collectionIds.length} collections`);
    console.log(`  - ${resourceCount} resources`);
    console.log(`  - ${notificationCount} notifications`);
    console.log(`  - 6+ submissions`);
    console.log(`  - 6+ user problem statuses`);
    console.log(`  - 6+ user exam sessions`);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
  process.exit(0);
}

seed();
