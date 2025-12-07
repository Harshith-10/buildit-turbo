"use client";

import { Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { duplicateCollection } from "@/actions/student/collections";
import { Button } from "@/components/ui/button";

interface DuplicateCollectionButtonProps {
  slug: string;
  secret?: string;
}

export function DuplicateCollectionButton({
  slug,
  secret,
}: DuplicateCollectionButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDuplicate = () => {
    startTransition(async () => {
      try {
        await duplicateCollection(slug, secret);
        toast.success("Collection duplicated successfully");
        router.push("/student/collections");
      } catch (error) {
        toast.error("Failed to duplicate collection");
        console.error(error);
      }
    });
  };

  return (
    <Button onClick={handleDuplicate} disabled={isPending} className="gap-2">
      <Copy className="h-4 w-4" />
      {isPending ? "Duplicating..." : "Duplicate to My Collections"}
    </Button>
  );
}
