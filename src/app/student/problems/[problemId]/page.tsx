import { auth } from "@/lib/auth";
import { db } from "@/db";
import { problems, userProblemStatus } from "@/db/schema/problems";
import { eq, and, asc, gt, lt, desc, ne } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { ProblemDescription } from "@/components/student/problems/problem-description";
import { ProblemListSheet } from "@/components/student/problems/problem-list-sheet";
import { CodeEditorWrapper } from "@/components/student/problems/code-editor-wrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Send } from "lucide-react";
import Link from "next/link";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

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
    redirect("/auth/sign-in");
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
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="h-14 border-b flex items-center justify-between px-4 bg-background shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Link
              href="/student/problems"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
          </div>
          <ProblemListSheet
            problems={neighborProblems}
            currentProblemId={problem.id}
          />
          <div className="h-4 w-[1px] bg-border" />
          <div className="flex items-center gap-2">
            {prevProblemId ? (
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/student/problems/${prevProblemId}`}>
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="ghost" size="icon" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            {nextProblemId ? (
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/student/problems/${nextProblemId}`}>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="ghost" size="icon" disabled>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="h-4 w-[1px] bg-border" />
          <div className="flex items-center gap-2">
            <span className="font-medium">{problem.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="gap-2">
            <Play className="h-4 w-4" />
            Run
          </Button>
          <Button
            size="sm"
            className="gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <Send className="h-4 w-4" />
            Submit
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={40} minSize={30}>
            <ProblemDescription problem={problem} />
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={60}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={60} minSize={30}>
                <CodeEditorWrapper
                  starterCode={problem.starterCode["javascript"] || ""}
                />
              </ResizablePanel>

              <ResizableHandle />

              <ResizablePanel defaultSize={40} minSize={20}>
                <div className="h-full flex flex-col bg-muted/10">
                  <div className="flex items-center gap-4 px-4 py-2 border-b bg-muted/20">
                    <span className="text-sm font-medium text-muted-foreground">
                      Test Cases
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                      Result
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-muted-foreground">
                      Run code to see results
                    </div>
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
