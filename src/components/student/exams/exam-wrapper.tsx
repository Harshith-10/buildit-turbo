"use client";

import { Maximize2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, cloneElement, type ReactElement } from "react";
import { toast } from "sonner";
import { logMalpractice } from "@/actions/student/exam";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ExamWrapperProps {
  children: ReactElement<{ malpracticeCount?: number }>;
  examId: string;
  sessionId: string;
  initialMalpracticeCount?: number;
}

export function ExamWrapper({
  children,
  examId,
  sessionId,
  initialMalpracticeCount = 0,
}: ExamWrapperProps) {
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [malpracticeCount, setMalpracticeCount] = useState(initialMalpracticeCount);

  const handleMalpractice = useCallback(
    async (type: string) => {
      try {
        const result = await logMalpractice(sessionId, type);
        
        if (result.success) {
          setMalpracticeCount(result.totalCount);
          
          if (result.shouldAutoSubmit) {
            toast.error("Maximum warnings exceeded. Exam auto-submitted.");
            // Redirect to finalize page
            setTimeout(() => {
              router.push(`/student/exams/${examId}/finalize`);
            }, 2000);
          } else {
            toast.error(`Malpractice warning recorded! (${result.totalCount}/3)`);
          }
        }
      } catch (error) {
        console.error("Failed to log malpractice", error);
        toast.error("Failed to log malpractice");
      }
    },
    [sessionId, examId, router],
  );

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      if (!isFull) {
        handleMalpractice("fullscreen_exit");
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleMalpractice("tab_switch");
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Initial check
    if (!document.fullscreenElement) {
      setIsFullscreen(false);
    }

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleMalpractice]);

  const handleReEnterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (_err) {
      toast.error("Failed to enter fullscreen mode");
    }
  };

  // Clone children and pass malpracticeCount as prop
  const childrenWithProps = cloneElement(children, { malpracticeCount });

  return (
    <>
      {childrenWithProps}

      <AlertDialog open={!isFullscreen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Fullscreen Required</AlertDialogTitle>
            <AlertDialogDescription>
              You have exited fullscreen mode. This has been recorded as a
              malpractice warning. Please return to fullscreen mode immediately
              to continue your exam.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={handleReEnterFullscreen} className="gap-2">
              <Maximize2 className="h-4 w-4" />
              Return to Fullscreen
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
