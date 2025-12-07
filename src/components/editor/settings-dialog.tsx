"use client";

import { Settings } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/plate-ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/plate-ui/dialog";
import { cn } from "@/lib/utils";

export function SettingsDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            "group fixed right-4 bottom-4 z-50 size-10 overflow-hidden",
            "rounded-full shadow-md hover:shadow-lg",
          )}
          size="icon"
          variant="default"
        >
          <Settings className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Settings</DialogTitle>
          <DialogDescription>Configure your preferences.</DialogDescription>
        </DialogHeader>

        <div className="space-y-10">
          <p className="text-sm text-muted-foreground">
            No settings available.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
