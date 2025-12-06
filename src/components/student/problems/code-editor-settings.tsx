"use client";

import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/animate-ui/components/radix/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export interface CodeEditorSettingsState {
  fontSize: number;
}

interface CodeEditorSettingsProps {
  settings: CodeEditorSettingsState;
  onSettingsChange: (settings: CodeEditorSettingsState) => void;
}

export function CodeEditorSettings({
  settings,
  onSettingsChange,
}: CodeEditorSettingsProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Editor Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editor Settings</DialogTitle>
          <DialogDescription>
            Customize your coding experience.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="font-size">Font Size</Label>
              <span className="text-sm text-muted-foreground">
                {settings.fontSize}px
              </span>
            </div>
            <Slider
              id="font-size"
              min={12}
              max={24}
              step={1}
              value={[settings.fontSize]}
              onValueChange={(value) =>
                onSettingsChange({ ...settings, fontSize: value[0] })
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
