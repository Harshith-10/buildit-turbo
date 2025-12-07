"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  calculateDistributions,
  type Distribution,
  type MarksPerDifficulty,
} from "@/lib/exam-utils";
import { cn } from "@/lib/utils";

interface DistributionCalculatorProps {
  totalQuestions: number;
  totalMarks: number;
  marksPerDifficulty: MarksPerDifficulty;
  allowedDistributions: Distribution[];
  onAllowedDistributionsChange: (distributions: Distribution[]) => void;
  onConfigurationChange: (
    config: Partial<{
      totalQuestions: number;
      totalMarks: number;
      marksPerDifficulty: MarksPerDifficulty;
    }>,
  ) => void;
}

export function DistributionCalculator({
  totalQuestions,
  totalMarks,
  marksPerDifficulty,
  allowedDistributions,
  onAllowedDistributionsChange,
  onConfigurationChange,
}: DistributionCalculatorProps) {
  const [calculatedDistributions, setCalculatedDistributions] = useState<
    Distribution[]
  >([]);

  const handleCalculate = () => {
    const distributions = calculateDistributions(
      totalQuestions,
      totalMarks,
      marksPerDifficulty,
    );
    setCalculatedDistributions(distributions);
  };

  const toggleDistribution = (dist: Distribution) => {
    const exists = allowedDistributions.some(
      (d) =>
        d.easy === dist.easy &&
        d.medium === dist.medium &&
        d.hard === dist.hard,
    );

    if (exists) {
      onAllowedDistributionsChange(
        allowedDistributions.filter(
          (d) =>
            !(
              d.easy === dist.easy &&
              d.medium === dist.medium &&
              d.hard === dist.hard
            ),
        ),
      );
    } else {
      onAllowedDistributionsChange([...allowedDistributions, dist]);
    }
  };

  const isSelected = (dist: Distribution) => {
    return allowedDistributions.some(
      (d) =>
        d.easy === dist.easy &&
        d.medium === dist.medium &&
        d.hard === dist.hard,
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>
              Set the parameters for distribution calculation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Total Questions</Label>
                <Input
                  type="number"
                  value={totalQuestions}
                  onChange={(e) =>
                    onConfigurationChange({
                      totalQuestions: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Total Marks</Label>
                <Input
                  type="number"
                  value={totalMarks}
                  onChange={(e) =>
                    onConfigurationChange({
                      totalMarks: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Marks per Difficulty</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Easy</Label>
                  <Input
                    type="number"
                    value={marksPerDifficulty.easy}
                    onChange={(e) =>
                      onConfigurationChange({
                        marksPerDifficulty: {
                          ...marksPerDifficulty,
                          easy: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Medium
                  </Label>
                  <Input
                    type="number"
                    value={marksPerDifficulty.medium}
                    onChange={(e) =>
                      onConfigurationChange({
                        marksPerDifficulty: {
                          ...marksPerDifficulty,
                          medium: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Hard</Label>
                  <Input
                    type="number"
                    value={marksPerDifficulty.hard}
                    onChange={(e) =>
                      onConfigurationChange({
                        marksPerDifficulty: {
                          ...marksPerDifficulty,
                          hard: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <Button type="button" onClick={handleCalculate} className="w-full">
              Calculate Distributions
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Possible Distributions</CardTitle>
            <CardDescription>
              Select the combinations you want to allow
            </CardDescription>
          </CardHeader>
          <CardContent>
            {calculatedDistributions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Click calculate to see possible combinations based on your
                settings.
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {calculatedDistributions.map((dist, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={cn(
                      "flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors w-full",
                      isSelected(dist)
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-muted/50",
                    )}
                    onClick={() => toggleDistribution(dist)}
                  >
                    <div className="flex gap-4 text-sm">
                      <div className="flex flex-col items-center w-12">
                        <span className="font-bold">{dist.easy}</span>
                        <span className="text-[10px] text-muted-foreground uppercase">
                          Easy
                        </span>
                      </div>
                      <div className="flex flex-col items-center w-12">
                        <span className="font-bold">{dist.medium}</span>
                        <span className="text-[10px] text-muted-foreground uppercase">
                          Med
                        </span>
                      </div>
                      <div className="flex flex-col items-center w-12">
                        <span className="font-bold">{dist.hard}</span>
                        <span className="text-[10px] text-muted-foreground uppercase">
                          Hard
                        </span>
                      </div>
                    </div>
                    {isSelected(dist) && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
