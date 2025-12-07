"use client";

import { format } from "date-fns";
import { Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getExamSessions } from "@/actions/faculty/exams";
import { revokeExamSession } from "@/actions/faculty/revoke-session";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ExamSessionsListProps {
  examId: string;
}

export function ExamSessionsList({ examId }: ExamSessionsListProps) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const data = await getExamSessions(examId);
        setSessions(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load sessions");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [examId]);

  const refreshSessions = async () => {
    setLoading(true);
    try {
      const data = await getExamSessions(examId);
      setSessions(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (sessionId: string) => {
    try {
      await revokeExamSession(sessionId);
      toast.success("Session revoked successfully");
      refreshSessions(); // Refresh list
    } catch (error) {
      console.error(error);
      toast.error("Failed to revoke session");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Student Attempts</h3>
        <Button variant="outline" size="sm" onClick={refreshSessions}>
          Refresh
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Started At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No attempts found.
                </TableCell>
              </TableRow>
            ) : (
              sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <div className="font-medium">{session.user.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {session.user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        session.status === "completed" ? "default" : "secondary"
                      }
                    >
                      {session.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {session.score !== null
                      ? `${session.score} / ${session.maxScore}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {session.startTime
                      ? format(new Date(session.startTime), "PP p")
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Revoke
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Revoke Exam Session?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will delete the student's attempt and allow
                            them to start over. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRevoke(session.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Revoke
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
