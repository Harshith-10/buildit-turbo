"use client";

import { motion, type Transition, type Variants } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface StarProps {
  index: number;
  isSelected: boolean;
  isHovering: boolean;
  setRating: (rating: number) => void;
  setHover: (rating: number) => void;
  strokeColor: string;
  fillColor: string;
}

interface StarRatingProps {
  value?: number;
  onValueChange?: (value: number) => void;
  className?: string;
}

const StarRating = ({
  value,
  onValueChange,
  className,
}: StarRatingProps = {}) => {
  const [internalRating, setInternalRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);

  const rating = value !== undefined ? value : internalRating;

  // Exact colors from your reference
  const STROKE_COLOR = "#666";
  const FILL_COLOR = "#ffc73a";

  const handleRatingChange = (newRating: number) => {
    if (rating === newRating) {
      const nextRating = 0;
      if (onValueChange) {
        onValueChange(nextRating);
      } else {
        setInternalRating(nextRating);
      }
    } else {
      if (onValueChange) {
        onValueChange(newRating);
      } else {
        setInternalRating(newRating);
      }
    }
  };

  return (
    <div className={cn("flex gap-[0.3rem]", className)}>
      {[1, 2, 3, 4, 5].map((index) => {
        const isSelected = index <= (hover || rating);
        const isHovering = hover > 0 && index <= hover;

        return (
          <Star
            key={index}
            index={index}
            isSelected={isSelected}
            isHovering={isHovering}
            setRating={handleRatingChange}
            setHover={setHover}
            strokeColor={STROKE_COLOR}
            fillColor={FILL_COLOR}
          />
        );
      })}
    </div>
  );
};

const Star = ({
  index,
  isSelected,
  setRating,
  setHover,
  strokeColor,
  fillColor,
}: StarProps) => {
  // Animation Variants typed for clarity
  const pathVariants: Variants = {
    idle: {
      stroke: strokeColor,
      fill: "transparent",
      strokeWidth: 1,
      strokeDasharray: 12,
      strokeLinejoin: "bevel",
      strokeOpacity: 1,
      scale: 1,
      strokeDashoffset: [24, 0],
      transition: {
        strokeDashoffset: {
          duration: 4,
          ease: "linear",
          repeat: Infinity,
        },
        duration: 0.2,
        delay: (5 - index) * 0.04,
      },
    },
    animate: {
      scale: [1, 0.8, 1.2, 1],
      fill: [null, fillColor, fillColor, fillColor],
      stroke: [strokeColor, strokeColor, fillColor],
      strokeWidth: [1, 1, 8],
      strokeDasharray: [12, 10, 0],
      strokeOpacity: [1, 1, 0],
      strokeLinejoin: ["bevel", "bevel", "miter"],
      transition: {
        duration: 0.75,
        times: [0, 0.3, 0.6, 1],
        ease: "easeInOut",
        delay: index * 0.05,
      } as Transition,
    },
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Intentionally ignored
    <label
      className="cursor-pointer relative w-8 h-8"
      onMouseEnter={() => setHover(index)}
      onMouseLeave={() => setHover(0)}
      onClick={() => setRating(index)}
    >
      <input
        type="radio"
        name="star-radio"
        value={index}
        className="appearance-none absolute inset-0 opacity-0"
        aria-label={`Rate ${index} stars`}
      />
      <motion.svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-8 h-8 overflow-visible"
        initial="idle"
        animate={isSelected ? "animate" : "idle"}
        whileHover={!isSelected ? { stroke: fillColor } : undefined}
      >
        <motion.path
          d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
          pathLength={360}
          variants={pathVariants}
        />
      </motion.svg>
    </label>
  );
};

export default StarRating;
