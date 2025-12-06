"use client";

import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { submitExamRating } from "@/app/actions/exam-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StarRating from "@/components/ui/star-rating";

interface FinalizeViewProps {
  exam: {
    id: string;
    title: string;
    description: string;
  };
  rated: boolean;
}

export function FinalizeView({ exam, rated }: FinalizeViewProps) {
  const [rating, setRating] = useState(0);
  const [isRated, setIsRated] = useState(rated);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingSubmit = async () => {
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      await submitExamRating(exam.id, rating);
      setIsRated(true);
      toast.success("Thank you for your feedback!");
    } catch (_error) {
      toast.error("Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl py-10 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Exam Submitted</h1>
        <p className="text-muted-foreground">
          You have successfully completed {exam.title}
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="h-2 w-full bg-green-500" />
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Submission Received</CardTitle>
          <CardDescription>
            Your answers have been recorded. Results will be available once the
            evaluation is complete.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center text-muted-foreground">
          <p>
            Thank you for taking the exam. You can now return to the dashboard
            or view your other exams.
          </p>

          {!isRated ? (
            <div className="mt-8 p-6 bg-muted/30 rounded-lg border border-dashed space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">
                  Rate your experience!
                </h3>
                <p className="text-sm text-muted-foreground">
                  How would you rate your experience with this exam or our
                  platform?
                </p>
              </div>
              <div className="flex justify-center">
                <StarRating value={rating} onValueChange={setRating} />
              </div>
              <Button
                onClick={handleRatingSubmit}
                disabled={rating === 0 || isSubmitting}
                size="sm"
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          ) : (
            <div className="mt-8 p-4 bg-green-50/50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-900 text-green-700 dark:text-green-400 text-sm">
              Thank you for rating this exam!
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center pb-8">
          <Button asChild variant="outline">
            <Link href="/student/exams/past">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Exams
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
