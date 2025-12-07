"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ShareCollectionButtonProps {
  slug: string;
  shareSecret: string | null;
  isPrivate: boolean;
}

export function ShareCollectionButton({
  slug,
  shareSecret,
  isPrivate,
}: ShareCollectionButtonProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    const baseUrl = window.location.origin;
    let url = `${baseUrl}/student/collections/${slug}`;
    if (isPrivate && shareSecret) {
      url += `?secret=${shareSecret}`;
    }
    return url;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getShareUrl());
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Collection</DialogTitle>
          <DialogDescription>
            {isPrivate
              ? "This collection is private. Anyone with this link can view it."
              : "This collection is public. Anyone can view it."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" defaultValue={getShareUrl()} readOnly />
          </div>
          <Button type="submit" size="sm" className="px-3" onClick={handleCopy}>
            <span className="sr-only">Copy</span>
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
