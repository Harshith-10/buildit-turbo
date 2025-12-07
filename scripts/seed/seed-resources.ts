import { eq } from "drizzle-orm";
import { db } from "@/db";
import { resources } from "@/db/schema";

const resourcesData = [
  {
    title: "System Design Primer",
    url: "https://github.com/donnemartin/system-design-primer",
    type: "link",
  },
  {
    title: "React Documentation",
    url: "https://react.dev",
    type: "link",
  },
  {
    title: "Introduction to Algorithms (CLRS)",
    url: "https://example.com/clrs.pdf",
    type: "pdf",
  },
  {
    title: "TypeScript Handbook",
    url: "https://www.typescriptlang.org/docs/handbook/",
    type: "link",
  },
  {
    title: "JavaScript: The Good Parts",
    url: "https://example.com/js-good-parts.pdf",
    type: "pdf",
  },
  {
    title: "Clean Code Principles",
    url: "https://example.com/clean-code-video.mp4",
    type: "video",
  },
  {
    title: "Big-O Cheat Sheet",
    url: "https://www.bigocheatsheet.com/",
    type: "link",
  },
  {
    title: "Frontend Interview Handbook",
    url: "https://www.frontendinterviewhandbook.com/",
    type: "link",
  },
];

export async function seedResources(userId: string): Promise<number> {
  console.log("Seeding resources...");

  for (const res of resourcesData) {
    const existingRes = await db.query.resources.findFirst({
      where: eq(resources.title, res.title),
    });
    if (!existingRes) {
      console.log(`Creating resource: ${res.title}`);
      await db.insert(resources).values({ ...res, uploadedBy: userId });
    } else {
      console.log(`Resource already exists: ${res.title}`);
    }
  }

  return resourcesData.length;
}
