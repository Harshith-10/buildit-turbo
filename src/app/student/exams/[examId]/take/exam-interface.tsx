"use client";

import { ChevronLeft, ChevronRight, Play, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { finishExam, submitExamProblem } from "@/actions/student/exam";
import { runExamSampleTests } from "@/actions/student/run-exam-tests";
import { ExamTimer } from "@/components/student/exams/exam-timer";
import { MalpracticeIndicator } from "@/components/student/exams/malpractice-indicator";
import { SubmissionResult } from "@/components/student/exams/submission-result";
import { useCodeExecution } from "@/hooks/use-code-execution";
import { CodeEditorWrapper } from "@/components/student/problems/code-editor-wrapper";
import { ProblemDescription } from "@/components/student/problems/problem-description";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface Exam {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  difficulty: "easy" | "medium" | "hard";
  duration: number;
  totalQuestions: number;
}

interface ExamSession {
  id: string;
  examId: string;
  userId: string;
  startTime: Date | null;
  finishTime: Date | null;
  terminationType: string | null;
  malpracticeAttempts: unknown; // Can be array or null from DB
}

interface ExamQuestion {
  problemId: string;
  order: number;
  points: number | null;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  starterCode: Record<string, string> | null;
  examples?: { input: string; output: string; explanation?: string }[];
  constraints?: string[];
  testCases?: { id: number; input: string; expected: string; hidden?: boolean }[];
}

interface ExamInterfaceProps {
  exam: Exam;
  session: ExamSession;
  questions: ExamQuestion[];
  finishTime: Date;
  malpracticeCount?: number;
}

export function ExamInterface({
  exam,
  session,
  questions,
  finishTime,
  malpracticeCount = 0,
}: ExamInterfaceProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [language, setLanguage] = useState("javascript");
  
  const currentQuestion = questions[currentQuestionIndex];
  
  // Initialize code with starter code for current question and language
  const [code, setCode] = useState(
    currentQuestion?.starterCode?.[language] || currentQuestion?.starterCode?.javascript || ""
  );
  
  // Update code when language or question changes
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    // Load starter code for the new language
    const newStarterCode = currentQuestion?.starterCode?.[newLanguage] || currentQuestion?.starterCode?.javascript || "";
    setCode(newStarterCode);
  };

  const handleQuestionChange = (newIndex: number) => {
    setCurrentQuestionIndex(newIndex);
    const newQuestion = questions[newIndex];
    // Load starter code for the new question
    const newStarterCode = newQuestion?.starterCode?.[language] || newQuestion?.starterCode?.javascript || "";
    setCode(newStarterCode);
  };
  
  // Use the reusable code execution hook
  const { isRunning, isSubmitting, testResult, runTests, submitCode } =
    useCodeExecution();

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  // Handle empty questions array
  if (questions.length === 0 || !currentQuestion) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">No Questions Available</h2>
          <p className="text-muted-foreground">
            This exam doesn't have any questions assigned yet.
          </p>
          <Button onClick={() => router.push("/student/exams/take-exam")}>
            Back to Exams
          </Button>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (!isLastQuestion) {
      handleQuestionChange(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstQuestion) {
      handleQuestionChange(currentQuestionIndex - 1);
    }
  };

  const handleRunTests = async () => {
    console.log("Running tests with:", { language, codeLength: code.length });
    await runTests(() =>
      runExamSampleTests(
        session.id,
        currentQuestion.problemId,
        code,
        language,
      ),
    );
  };

  const handleSubmit = async () => {
    console.log("Submitting with:", { language, codeLength: code.length });
    await submitCode(() =>
      submitExamProblem(
        session.id,
        currentQuestion.problemId,
        code,
        language,
      ),
    );
  };

  const handleFinishExam = async () => {
    try {
      await finishExam(session.id);
      router.push(`/student/exams/${exam.slug}/finalize`);
    } catch (_error) {
      toast.error("Failed to finish exam");
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="h-14 border-b flex items-center justify-between px-4 bg-background shrink-0 relative">
        <div className="flex items-center gap-4">
          <div className="font-semibold">{exam.title}</div>
          <div className="h-4 w-[1px] bg-border" />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrev}
              disabled={isFirstQuestion}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              disabled={isLastQuestion}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Center Timer */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-4">
          <ExamTimer finishTime={finishTime} onTimeUp={handleFinishExam} />
          <MalpracticeIndicator count={malpracticeCount} />
        </div>

        <div className="flex items-center gap-2">
          <div className="mr-4 text-sm font-medium text-muted-foreground">
            {currentQuestion.points} Points
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            className="gap-2"
            onClick={handleRunTests}
            disabled={isRunning || isSubmitting}
          >
            <Play className="h-4 w-4" />
            {isRunning ? "Running..." : "Run Tests"}
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
          <Button variant="destructive" size="sm" onClick={handleFinishExam}>
            Finish Exam
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={40} minSize={30}>
            <ProblemDescription
              problem={{
                ...currentQuestion,
                points: currentQuestion.points ?? undefined,
                examples: currentQuestion.examples || [],
                constraints: currentQuestion.constraints || [],
                testCases: currentQuestion.testCases || [],
              }}
            />
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={60}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={60} minSize={30}>
                <CodeEditorWrapper
                  starterCode={currentQuestion.starterCode?.[language] || currentQuestion.starterCode?.javascript || ""}
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
                          <p className="text-xs">Click "Run Tests" to test your code against sample test cases</p>
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
