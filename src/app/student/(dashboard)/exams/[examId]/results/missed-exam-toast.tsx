"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function MissedExamToast() {
  useEffect(() => {
    toast.error("You have missed the exam", {
      description: "The exam period has ended and you did not attempt it.",
      duration: 5000,
    });
  }, []);

  return null;
}
