"use client";

import { Loader2, Search } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useState, useTransition } from "react";
import { getQuestions } from "@/actions/faculty/questions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Question {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
}

interface QuestionsSelectorProps {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export function QuestionsSelector({
  selectedIds,
  onSelectionChange,
}: QuestionsSelectorProps) {
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  const [page, setPage] = useQueryState("p", {
    defaultValue: "1",
    parse: (value) => value || "1",
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const { data, totalPages } = await getQuestions(
        Number(page),
        5, // Smaller limit for selector
        search,
      );
      setQuestions(data as Question[]);
      setTotalPages(totalPages);
    });
  }, [page, search]);

  const handleToggle = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage.toString());
  };

  return (
    <div className="space-y-4 border rounded-md p-4">
      <h3 className="text-lg font-medium">Select Questions</h3>

      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search questions..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage("1"); // Reset to page 1 on search
          }}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border min-h-[300px] relative">
        {isPending && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.length === 0 && !isPending ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No questions found.
                </TableCell>
              </TableRow>
            ) : (
              questions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(question.id)}
                      onCheckedChange={(checked) =>
                        handleToggle(question.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {question.title}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        question.difficulty === "easy"
                          ? "secondary"
                          : question.difficulty === "medium"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {question.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">
                    {question.category}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {selectedIds.length} questions selected
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Number(page) - 1)}
            disabled={Number(page) <= 1 || isPending}
          >
            Previous
          </Button>
          <span className="flex items-center text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Number(page) + 1)}
            disabled={Number(page) >= totalPages || isPending}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
