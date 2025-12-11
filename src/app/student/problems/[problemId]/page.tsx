import { and, asc, desc, eq, gt, lt, ne } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ProblemInterface } from "@/components/student/problems/problem-interface";
import { db } from "@/db";
import { problems } from "@/db/schema/problems";
import { auth } from "@/lib/auth";

interface PageProps {
  params: Promise<{
    problemId: string;
  }>;
}

export default async function ProblemPage(props: PageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    redirect("/auth");
  }

  const params = await props.params;
  const problemId = params.problemId;

  const problem = await db.query.problems.findFirst({
    where: eq(problems.id, problemId),
  });

  if (!problem) {
    notFound();
  }

  // Fetch neighbors for the list (20 before, 20 after)
  // Since we don't have a reliable sequential ID, we'll use createdAt
  // This is an approximation. For a real production app with "serial order", we'd need a sequence number column.
  // Fetch neighbors for the list using serialNumber
  // beforeProblems are problems with smaller serial numbers (previous in sequence)
  const beforeProblems = await db
    .select({
      id: problems.id,
      title: problems.title,
      difficulty: problems.difficulty,
      serialNumber: problems.serialNumber,
    })
    .from(problems)
    .where(
      and(
        lt(problems.serialNumber, problem.serialNumber),
        ne(problems.id, problem.id),
      ),
    )
    .orderBy(desc(problems.serialNumber)) // Order by descending serialNumber to get closest smaller first
    .limit(20);

  // afterProblems are problems with larger serial numbers (next in sequence)
  const afterProblems = await db
    .select({
      id: problems.id,
      title: problems.title,
      difficulty: problems.difficulty,
      serialNumber: problems.serialNumber,
    })
    .from(problems)
    .where(
      and(
        gt(problems.serialNumber, problem.serialNumber),
        ne(problems.id, problem.id),
      ),
    )
    .orderBy(asc(problems.serialNumber)) // Order by ascending serialNumber to get closest larger first
    .limit(20);

  // Combine and sort for the problem list sheet
  // beforeProblems are fetched desc (closest smaller first). Reversing them puts them in ascending order (smallest-smaller to largest-smaller).
  // afterProblems are fetched asc (closest larger first). They are already in correct order (smallest-larger to largest-larger).
  const neighborProblems = [
    ...[...beforeProblems].reverse(),
    {
      id: problem.id,
      title: problem.title,
      difficulty: problem.difficulty,
      serialNumber: problem.serialNumber,
      isSolved: false,
    },
    ...afterProblems,
  ].map((p) => ({
    ...p,
    isSolved: false, // Placeholder
  }));

  // Find prev/next IDs for navigation buttons
  // Prev = Problem with the largest serialNumber that is still smaller than the current problem's serialNumber.
  // This is the first element of `beforeProblems` (which was ordered desc, so it's the closest smaller).
  // Next = Problem with the smallest serialNumber that is still larger than the current problem's serialNumber.
  // This is the first element of `afterProblems` (which was ordered asc, so it's the closest larger).
  const prevProblemId = beforeProblems.length > 0 ? beforeProblems[0].id : null;
  const nextProblemId = afterProblems.length > 0 ? afterProblems[0].id : null;

  return (
    <ProblemInterface
      
    problem={problem}
      neighborProblems={neighborProblems}
      prevProblemId={prevProblemId}
      nextProblemId={nextProblemId}
    />
  );
}
