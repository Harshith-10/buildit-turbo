"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createCollection } from "@/actions/student/collections";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export function CreateCollectionDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPrivate: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await createCollection({
          title: formData.title,
          description: formData.description,
          isPrivate: formData.isPrivate,
          type: "personal",
        });
        toast.success("Collection created successfully");
        setOpen(false);
        setFormData({ title: "", description: "", isPrivate: true });
        router.refresh();
      } catch (error) {
        toast.error("Failed to create collection");
        console.error(error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Collection
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Collection</DialogTitle>
          <DialogDescription>
            Create a new collection to organize your problems.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="My Awesome Collection"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="What is this collection about?"
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="isPrivate" className="flex flex-col space-y-1">
              <span>Private Collection</span>
              <span className="font-normal text-xs text-muted-foreground">
                Only you can see this collection unless you share it.
              </span>
            </Label>
            <Switch
              id="isPrivate"
              checked={formData.isPrivate}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isPrivate: checked })
              }
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Collection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
