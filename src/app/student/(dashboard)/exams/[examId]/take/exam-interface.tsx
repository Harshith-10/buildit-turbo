"use client";

import { useState } from "react";
import { ExamTimer } from "@/components/student/exams/exam-timer";
import { MalpracticeIndicator } from "@/components/student/exams/malpractice-indicator";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { CodeEditorWrapper } from "@/components/student/problems/code-editor-wrapper";
import { ProblemDescription } from "@/components/student/problems/problem-description";
import { ChevronLeft, ChevronRight, Play, Send } from "lucide-react";
import { toast } from "sonner";
import { submitExamProblem, finishExam } from "../actions";
import { useRouter } from "next/navigation";

interface ExamInterfaceProps {
  exam: any;
  session: any;
  questions: any[];
  finishTime: Date;
}

export function ExamInterface({
  exam,
  session,
  questions,
  finishTime,
}: ExamInterfaceProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Implement submission logic
      await submitExamProblem(
        session.id,
        currentQuestion.problemId,
        code,
        "javascript",
      );
      toast.success("Solution submitted successfully");
    } catch (error) {
      toast.error("Failed to submit solution");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishExam = async () => {
    try {
      await finishExam(session.id);
      router.push(`/student/exams/${exam.id}/finalize`);
    } catch (error) {
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
          <MalpracticeIndicator
            count={session.malpracticeAttempts?.length || 0}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="mr-4 text-sm font-medium text-muted-foreground">
            {currentQuestion.points} Points
          </div>
          <Button variant="secondary" size="sm" className="gap-2">
            <Play className="h-4 w-4" />
            Run
          </Button>
          <Button
            size="sm"
            className="gap-2 bg-green-600 hover:bg-green-700 text-white"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <Send className="h-4 w-4" />
            Submit
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
            <ProblemDescription problem={currentQuestion} />
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={60}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={60} minSize={30}>
                <CodeEditorWrapper
                  starterCode={currentQuestion.starterCode?.javascript || ""}
                  value={code}
                  onChange={setCode}
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
