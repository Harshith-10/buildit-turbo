"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getSecurityStatus } from "@/actions/auth";
import { useSession } from "@/lib/auth-client";
import { SecurityQuestionsDialog } from "./security-questions-dialog";
import { SessionConflictDialog } from "./session-conflict-dialog";

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
        const data = await getSecurityStatus();
        if (!data) return;

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
