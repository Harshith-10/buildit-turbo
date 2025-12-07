"use client";

import { Info } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { saveSecurityQuestions } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SECURITY_QUESTIONS = [
  "What is your mother's maiden name?",
  "What was the name of your first pet?",
  "What was the name of your first school?",
  "What is your favorite food?",
  "What is the name of the city where you were born?",
  "What is your favorite movie?",
  "What is the name of your favorite teacher?",
  "What is your father's middle name?",
  "What is the name of the street you grew up on?",
  "What is your favorite book?",
];

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

  const getAvailableQuestions = (currentIndex: number) => {
    const selectedQuestions = questions
      .map((q, i) => (i === currentIndex ? null : q.question))
      .filter(Boolean);
    return SECURITY_QUESTIONS.filter((q) => !selectedQuestions.includes(q));
  };

  const handleSubmit = async () => {
    // Validate
    for (const q of questions) {
      if (!q.question.trim() || !q.answer.trim()) {
        toast.error("Please select all questions and fill in all answers.");
        return;
      }
    }

    setLoading(true);
    try {
      const result = await saveSecurityQuestions(questions);

      if (!result.success) {
        throw new Error(result.error || "Failed to save security questions");
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
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            <h1 className="flex items-center text-3xl text-destructive font-bold pb-2">
              <Info className="mr-2" />
              Important
            </h1>
            <span>Setup Security Questions</span>
          </DialogTitle>
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
              <Select
                value={q.question}
                onValueChange={(value) => handleQuestionChange(i, value)}
              >
                <SelectTrigger id={`question-${i}`} className="w-full">
                  <SelectValue placeholder="Select a question" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableQuestions(i).map((question) => (
                    <SelectItem key={question} value={question}>
                      {question}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
