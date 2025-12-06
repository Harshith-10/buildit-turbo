"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SecurityQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function SecurityQuestionsDialog({
  open,
  onOpenChange,
  onSuccess,
}: SecurityQuestionsDialogProps) {
  const [questions, setQuestions] = useState([
    { question: "", answer: "" },
    { question: "", answer: "" },
    { question: "", answer: "" },
  ]);
  const [loading, setLoading] = useState(false);

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].answer = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    // Validate
    for (const q of questions) {
      if (!q.question.trim() || !q.answer.trim()) {
        toast.error("Please fill in all questions and answers.");
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionsAndAnswers: questions }),
      });

      if (!res.ok) {
        throw new Error("Failed to save security questions");
      }

      toast.success("Security questions saved successfully!");
      onSuccess();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[500px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Setup Security Questions</DialogTitle>
          <DialogDescription>
            To secure your account, please set up 3 security questions. These
            will be used to verify your identity if we detect unusual activity.
            <br />
            <span className="text-xs text-muted-foreground mt-2 block">
              Note: Answers are case-insensitive and hashed securely.
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {questions.map((q, i) => (
            <div
              key={`q-${
                // biome-ignore lint/suspicious/noArrayIndexKey: I don't see a better option
                i
              }`}
              className="grid gap-2"
            >
              <Label htmlFor={`question-${i}`}>Question {i + 1}</Label>
              <Input
                id={`question-${i}`}
                placeholder={`e.g. What is your childhood nickname?`}
                value={q.question}
                autoComplete="new-password"
                onChange={(e) => handleQuestionChange(i, e.target.value)}
              />
              <Input
                id={`answer-${i}`}
                placeholder="Answer"
                type="password"
                value={q.answer}
                autoComplete="new-password"
                onChange={(e) => handleAnswerChange(i, e.target.value)}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Security Questions"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
