"use client";

import { Loader2, Maximize2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { startExamSession } from "../../../../../../actions/student/exam";

interface StartExamButtonProps {
  examId: string;
}

export function StartExamButton({ examId }: StartExamButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleEnterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (_err) {
      toast.error("Failed to enter fullscreen mode");
    }
  };

  const handleStartExam = async () => {
    if (!isFullscreen) {
      toast.error("You must be in fullscreen mode to start the exam");
      return;
    }

    setIsLoading(true);
    try {
      const result = await startExamSession(examId);
      if (result.success) {
        router.push(`/student/exams/${examId}/take`);
      }
    } catch (_error) {
      toast.error("Failed to start exam session");
      setIsLoading(false);
    }
  };

  if (!isFullscreen) {
    return (
      <Button onClick={handleEnterFullscreen} className="gap-2">
        <Maximize2 className="h-4 w-4" />
        Enter Fullscreen to Start
      </Button>
    );
  }

  return (
    <Button onClick={handleStartExam} disabled={isLoading} className="gap-2">
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      Start Exam
    </Button>
  );
}
