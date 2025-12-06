"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { SecurityQuestionsDialog } from "./security-questions-dialog";
import { SessionConflictDialog } from "./session-conflict-dialog";
import { usePathname } from "next/navigation";

export function SessionManager() {
  const { data: session, isPending } = useSession();
  const [showSecurityDialog, setShowSecurityDialog] = useState(false);
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  const [securityQuestions, setSecurityQuestions] = useState<string[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    if (isPending || !session) return;

    // Don't check on auth pages to avoid loops or bad UX during login/signup
    if (pathname.startsWith("/auth") || pathname.startsWith("/api")) return;

    const checkSecurityStatus = async () => {
      try {
        const res = await fetch("/api/auth/security");
        if (!res.ok) return;

        const data = await res.json();

        if (!data.hasSecurityQuestions) {
          setShowSecurityDialog(true);
        } else if (data.hasMultipleSessions) {
          setSecurityQuestions(data.questions);
          setShowConflictDialog(true);
        } else {
          setShowConflictDialog(false);
        }
      } catch (error) {
        console.error("Failed to check security status", error);
      }
    };

    checkSecurityStatus();

    // Optional: Poll every minute or on window focus
    const interval = setInterval(checkSecurityStatus, 60000);
    return () => clearInterval(interval);
  }, [session, isPending, pathname]);

  if (isPending || !session) return null;

  return (
    <>
      <SecurityQuestionsDialog
        open={showSecurityDialog}
        onOpenChange={setShowSecurityDialog}
        onSuccess={() => setShowSecurityDialog(false)}
      />
      <SessionConflictDialog
        open={showConflictDialog}
        questions={securityQuestions}
        onSuccess={() => setShowConflictDialog(false)}
      />
    </>
  );
}
