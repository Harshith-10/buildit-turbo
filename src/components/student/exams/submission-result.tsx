"use client";

import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TestCaseResult {
  id: number;
  passed: boolean;
  actual_output: string;
  error: string;
  time: string;
  memory: string;
}

interface SubmissionResultProps {
  passed: boolean;
  totalTests: number;
  passedTests: number;
  compilationError?: string;
  systemError?: string;
  results?: TestCaseResult[];
}

export function SubmissionResult({
  passed,
  totalTests,
  passedTests,
  compilationError,
  systemError,
  results = [],
}: SubmissionResultProps) {
  // Handle system errors
  if (systemError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>System Error</AlertTitle>
        <AlertDescription className="font-mono text-xs whitespace-pre-wrap">
          {systemError}
        </AlertDescription>
      </Alert>
    );
  }

  // Handle compilation errors
  if (compilationError) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Compilation Error</AlertTitle>
        <AlertDescription className="font-mono text-xs whitespace-pre-wrap max-h-40 overflow-y-auto">
          {compilationError}
        </AlertDescription>
      </Alert>
    );
  }

  // Overall status
  const statusVariant = passed ? "default" : "destructive";
  const statusIcon = passed ? (
    <CheckCircle2 className="h-5 w-5 text-green-500" />
  ) : (
    <XCircle className="h-5 w-5 text-red-500" />
  );

  return (
    <div className="space-y-4">
      {/* Overall Result */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {statusIcon}
              <CardTitle className="text-lg">
                {passed ? "All Tests Passed! ✅" : "Some Tests Failed"}
              </CardTitle>
            </div>
            <Badge variant={statusVariant}>
              {passedTests} / {totalTests} Passed
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Test Case Results */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Test Case Results</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {results.map((result) => (
                <Collapsible key={result.id}>
                  <CollapsibleTrigger className="w-full">
                    <div
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors hover:bg-muted/50 ${
                        result.passed
                          ? "border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20"
                          : "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {result.passed ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        )}
                        <span className="font-medium text-sm">
                          Test Case {result.id + 1}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {result.time && result.time !== "0ms" && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {result.time}
                          </div>
                        )}
                        <Badge
                          variant={result.passed ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {result.passed ? "Passed" : "Failed"}
                        </Badge>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 p-3 bg-muted/30 rounded-lg space-y-2 text-xs">
                      {result.error ? (
                        <div>
                          <div className="font-semibold text-red-600 dark:text-red-400 mb-1">
                            Error:
                          </div>
                          <pre className="font-mono whitespace-pre-wrap text-xs bg-background p-2 rounded border">
                            {result.error}
                          </pre>
                        </div>
                      ) : (
                        <div>
                          <div className="font-semibold mb-1">Output:</div>
                          <pre className="font-mono whitespace-pre-wrap text-xs bg-background p-2 rounded border">
                            {result.actual_output || "(empty)"}
                          </pre>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
