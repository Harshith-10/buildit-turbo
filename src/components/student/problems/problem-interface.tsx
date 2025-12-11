"use client";

import { ChevronLeft, ChevronRight, Play, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { runPracticeSampleTests, submitPracticeProblem } from "@/actions/student/practice-problems";
import { CodeEditorWrapper } from "@/components/student/problems/code-editor-wrapper";
import { ProblemDescription } from "@/components/student/problems/problem-description";
import { ProblemListSheet } from "@/components/student/problems/problem-list-sheet";
import { SubmissionResult } from "@/components/student/exams/submission-result";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useCodeExecution } from "@/hooks/use-code-execution";

interface Problem {
  id: string;
  serialNumber: number;
  title: string;
  slug: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  description: string;
  creatorId: string | null;
  isPublic: boolean;
  acceptance: number | null;
  submissions: number | null;
  likes: number | null;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starterCode: Record<string, string>;
  driverCode: Record<string, string>;
  testCases: { id: number; input: string; expected: string; hidden?: boolean }[];
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

interface NeighborProblem {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  serialNumber: number;
  isSolved: boolean;
}

interface ProblemInterfaceProps {
  problem: Problem;
  neighborProblems: NeighborProblem[];
  prevProblemId: string | null;
  nextProblemId: string | null;
}

export function ProblemInterface({
  problem,
  neighborProblems,
  prevProblemId,
  nextProblemId,
}: ProblemInterfaceProps) {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(
    problem.starterCode[language] || problem.starterCode.javascript || ""
  );

  // Update code when language changes
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    // Load starter code for the new language
    const newStarterCode = problem.starterCode[newLanguage] || problem.starterCode.javascript || "";
    setCode(newStarterCode);
  };

  // Use the reusable code execution hook
  const { isRunning, isSubmitting, testResult, runTests, submitCode } =
    useCodeExecution();

  const handleRunTests = async () => {
    console.log("Running practice tests with:", { language, codeLength: code.length });
    await runTests(() =>
      runPracticeSampleTests(problem.id, code, language),
    );
  };

  const handleSubmit = async () => {
    console.log("Submitting practice solution with:", { language, codeLength: code.length });
    await submitCode(() =>
      submitPracticeProblem(problem.id, code, language),
    );
  };

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
          <Button 
            variant="secondary" 
            size="sm" 
            className="gap-2"
            onClick={handleRunTests}
            disabled={isRunning || isSubmitting}
          >
            <Play className="h-4 w-4" />
            {isRunning ? "Running..." : "Run"}
          </Button>
          <Button
            size="sm"
            className="gap-2 bg-green-600 hover:bg-green-700 text-white"
            onClick={handleSubmit}
            disabled={isSubmitting || isRunning}
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "Submitting..." : "Submit"}
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
                  starterCode={problem.starterCode[language] || problem.starterCode.javascript || ""}
                  value={code}
                  onChange={setCode}
                  language={language}
                  onLanguageChange={handleLanguageChange}
                />
              </ResizablePanel>

              <ResizableHandle />

              <ResizablePanel defaultSize={40} minSize={20}>
                <div className="h-full flex flex-col bg-muted/10 overflow-hidden">
                  <div className="flex items-center gap-4 px-4 py-2 border-b bg-muted/20">
                    <span className="text-sm font-medium text-muted-foreground">
                      Test Results
                    </span>
                  </div>
                  <div className="flex-1 overflow-auto p-4">
                    {testResult ? (
                      <SubmissionResult
                        passed={testResult.passed}
                        totalTests={testResult.totalTests}
                        passedTests={testResult.passedTests}
                        compilationError={testResult.compilationError}
                        systemError={testResult.systemError}
                        results={testResult.results}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-center text-muted-foreground">
                        <div>
                          <p className="text-sm mb-2">No test results yet</p>
                          <p className="text-xs">Click "Run" to test your code against sample test cases</p>
                        </div>
                      </div>
                    )}
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
