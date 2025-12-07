"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { verifyAndTerminateSessions } from "@/actions/auth";
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
import { signOut } from "@/lib/auth-client";

interface SessionConflictDialogProps {
  open: boolean;
  questions: string[];
  onSuccess: () => void;
}

export function SessionConflictDialog({
  open,
  questions,
  onSuccess,
}: SessionConflictDialogProps) {
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Randomly select one question to ask, or ask all?
  // The prompt said "ask for three personal questions... on login... if secret is empty".
  // But for terminating sessions, it said "entering a secret".
  // I'll ask for one random question to be less annoying, or all 3 for max security.
  // Let's ask for all 3 to be safe and consistent with "entering a secret" which implies the full set or a specific password.
  // Actually, the prompt says "entering a secret... This secret should be collected... On login, if their secret is empty, we'll show a dialog box, asking for three personal questions".
  // So the "secret" IS the answers to the questions.
  // I'll ask for all 3.

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formattedAnswers = answers.map((ans, i) => ({
        questionIndex: i,
        answer: ans,
      }));

      const result = await verifyAndTerminateSessions(formattedAnswers);

      if (!result.success) {
        throw new Error(result.error || "Incorrect answers");
      }

      toast.success("Other sessions terminated successfully!");
      onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to verify answers.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/auth");
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-[500px]"
        onInteractOutside={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>Multiple Sessions Detected</DialogTitle>
          <DialogDescription>
            You are currently logged in on another device. To continue here, you
            must terminate the other session(s).
            <br />
            Please answer your security questions to proceed.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {questions.map((q, i) => (
            <div key={q} className="grid gap-2">
              <Label htmlFor={`answer-${i}`}>{q}</Label>
              <Input
                id={`answer-${i}`}
                placeholder="Answer"
                type="password"
                value={answers[i]}
                onChange={(e) => handleAnswerChange(i, e.target.value)}
              />
            </div>
          ))}
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Verifying..." : "Terminate Other Sessions"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
