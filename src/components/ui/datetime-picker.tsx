"use client";

import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DateTimePicker({
  date,
  setDate,
  placeholder = "Pick a date and time",
  disabled = false,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDateTime, setSelectedDateTime] = React.useState<Date | undefined>(date);

  // Sync with external date changes
  React.useEffect(() => {
    setSelectedDateTime(date);
  }, [date]);

  const hours = selectedDateTime ? selectedDateTime.getHours() : 0;
  const minutes = selectedDateTime ? selectedDateTime.getMinutes() : 0;

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setSelectedDateTime(undefined);
      setDate(undefined);
      return;
    }

    const newDateTime = new Date(selectedDate);
    // Preserve existing time if we already have a selected date
    if (selectedDateTime) {
      newDateTime.setHours(selectedDateTime.getHours());
      newDateTime.setMinutes(selectedDateTime.getMinutes());
    }
    setSelectedDateTime(newDateTime);
    setDate(newDateTime);
  };

  const handleTimeChange = (type: "hours" | "minutes", value: string) => {
    if (!selectedDateTime) {
      // If no date selected yet, use today
      const newDateTime = new Date();
      newDateTime.setHours(type === "hours" ? parseInt(value) || 0 : 0);
      newDateTime.setMinutes(type === "minutes" ? parseInt(value) || 0 : 0);
      newDateTime.setSeconds(0);
      setSelectedDateTime(newDateTime);
      setDate(newDateTime);
      return;
    }

    const newDateTime = new Date(selectedDateTime);
    if (type === "hours") {
      const hour = parseInt(value) || 0;
      newDateTime.setHours(Math.min(23, Math.max(0, hour)));
    } else {
      const minute = parseInt(value) || 0;
      newDateTime.setMinutes(Math.min(59, Math.max(0, minute)));
    }
    newDateTime.setSeconds(0);
    setSelectedDateTime(newDateTime);
    setDate(newDateTime);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDateTime && "text-muted-foreground",
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDateTime ? (
            format(selectedDateTime, "PPP 'at' HH:mm")
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col">
          <Calendar
            mode="single"
            selected={selectedDateTime}
            onSelect={handleDateSelect}
            initialFocus
          />
          <div className="border-t p-3">
            <Label className="text-sm font-medium mb-2 block">Time</Label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  min="0"
                  max="23"
                  value={hours.toString().padStart(2, "0")}
                  onChange={(e) => handleTimeChange("hours", e.target.value)}
                  className="w-16 text-center"
                  placeholder="HH"
                />
                <span className="text-muted-foreground">:</span>
                <Input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes.toString().padStart(2, "0")}
                  onChange={(e) => handleTimeChange("minutes", e.target.value)}
                  className="w-16 text-center"
                  placeholder="MM"
                />
              </div>
            </div>
            <div className="mt-2 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const now = new Date();
                  setSelectedDateTime(now);
                  setDate(now);
                }}
                className="flex-1"
              >
                Now
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
