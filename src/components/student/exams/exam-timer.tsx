"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface ExamTimerProps {
  finishTime: Date;
  onTimeUp?: () => void;
}

export function ExamTimer({ finishTime, onTimeUp }: ExamTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = finishTime.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft("00:00:00");
        onTimeUp?.();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );

      if (diff < 5 * 60 * 1000) {
        setIsCritical(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [finishTime, onTimeUp]);

  return (
    <div
      className={`flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-sm font-medium ${
        isCritical
          ? "border-red-500 bg-red-500/10 text-red-500"
          : "bg-background"
      }`}
    >
      <Clock className="h-4 w-4" />
      {timeLeft}
    </div>
  );
}
