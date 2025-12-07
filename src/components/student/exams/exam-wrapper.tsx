"use client";

import { Maximize2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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
  children: React.ReactNode;
  examId: string;
  sessionId: string;
}

export function ExamWrapper({
  children,
  examId: _examId,
  sessionId,
}: ExamWrapperProps) {
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [_malpracticeCount, setMalpracticeCount] = useState(0);

  const handleMalpractice = useCallback(
    async (type: string) => {
      setMalpracticeCount((prev) => prev + 1);
      toast.error("Malpractice warning recorded!");

      try {
        await logMalpractice(sessionId, type);
      } catch (error) {
        console.error("Failed to log malpractice", error);
      }
    },
    [sessionId],
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

  return (
    <>
      {children}

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
