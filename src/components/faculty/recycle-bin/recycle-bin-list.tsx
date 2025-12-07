"use client";

import { format } from "date-fns";
import { RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  permanentlyDeleteCollection,
  restoreCollection,
} from "@/actions/faculty/collections";
import { permanentlyDeleteExam, restoreExam } from "@/actions/faculty/exams";
import {
  permanentlyDeleteQuestion,
  restoreQuestion,
} from "@/actions/faculty/questions";
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type ItemType = "question" | "collection" | "exam";

interface DeletedItem {
  id: string;
  title: string;
  description?: string;
  deletedAt: Date | null;
  // biome-ignore lint/suspicious/noExplicitAny: Dynamic item type
  [key: string]: any;
}

interface RecycleBinListProps {
  items: DeletedItem[];
  type: ItemType;
}

export function RecycleBinList({ items, type }: RecycleBinListProps) {
  const [isRestoring, setIsRestoring] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleRestore = async (id: string) => {
    setIsRestoring(id);
    try {
      if (type === "question") {
        await restoreQuestion(id);
      } else if (type === "collection") {
        await restoreCollection(id);
      } else if (type === "exam") {
        await restoreExam(id);
      }
      toast.success("Item restored successfully");
    } catch (_error) {
      toast.error("Failed to restore item");
    } finally {
      setIsRestoring(null);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      if (type === "question") {
        await permanentlyDeleteQuestion(id);
      } else if (type === "collection") {
        await permanentlyDeleteCollection(id);
      } else if (type === "exam") {
        await permanentlyDeleteExam(id);
      }
      toast.success("Item permanently deleted");
    } catch (_error) {
      toast.error("Failed to delete item");
    } finally {
      setIsDeleting(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
        <Trash2 className="h-12 w-12 mb-4 opacity-20" />
        <p>No deleted items found</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="grid gap-4 p-1">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription className="line-clamp-1 mt-1">
                    {item.description || "No description"}
                  </CardDescription>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                  Deleted{" "}
                  {item.deletedAt && format(new Date(item.deletedAt), "PPp")}
                </div>
              </div>
            </CardHeader>
            <CardFooter className="bg-muted/50 p-2 px-4 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRestore(item.id)}
                disabled={isRestoring === item.id || isDeleting === item.id}
              >
                {isRestoring === item.id ? (
                  <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-3 w-3" />
                )}
                Restore
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isRestoring === item.id || isDeleting === item.id}
                  >
                    {isDeleting === item.id ? (
                      <Trash2 className="mr-2 h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-3 w-3" />
                    )}
                    Delete Forever
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the
                      {type} "{item.title}" and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(item.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete Forever
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
