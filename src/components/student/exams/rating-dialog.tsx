"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/components/radix/dialog";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/ui/star-rating";

interface RatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (rating: number) => void;
}

export function RatingDialog({
  open,
  onOpenChange,
  onSubmit,
}: RatingDialogProps) {
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    onSubmit(rating);
    onOpenChange(false);
    setRating(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rate this Exam</DialogTitle>
          <DialogDescription>
            How was your experience with this exam? Your feedback helps us
            improve.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-6">
          <StarRating value={rating} onValueChange={setRating} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={rating === 0}>
            Submit Rating
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
