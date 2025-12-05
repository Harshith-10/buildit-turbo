import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProblemDescriptionProps {
  problem: {
    title: string;
    difficulty: "easy" | "medium" | "hard";
    description: string;
    examples: { input: string; output: string; explanation?: string }[];
    constraints: string[];
  };
}

export function ProblemDescription({ problem }: ProblemDescriptionProps) {
  const difficultyColor = {
    easy: "bg-emerald-500/10 text-emerald-500",
    medium: "bg-amber-500/10 text-amber-500",
    hard: "bg-rose-500/10 text-rose-500",
  };

  return (
    <div className="flex flex-col gap-6 p-6 h-full overflow-y-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{problem.title}</h1>
          <Badge
            variant="secondary"
            className={cn("capitalize", difficultyColor[problem.difficulty])}
          >
            {problem.difficulty}
          </Badge>
        </div>
      </div>

      <div className="prose prose-invert max-w-none">
        <p>{problem.description}</p>
      </div>

      <div className="flex flex-col gap-4">
        {problem.examples.map((example, index) => (
          <div key={index} className="flex flex-col gap-2">
            <h3 className="font-semibold">Example {index + 1}:</h3>
            <div className="rounded-md bg-muted/50 p-4 font-mono text-sm">
              <div className="flex gap-2">
                <span className="font-semibold text-muted-foreground">
                  Input:
                </span>
                <span>{example.input}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-muted-foreground">
                  Output:
                </span>
                <span>{example.output}</span>
              </div>
              {example.explanation && (
                <div className="flex gap-2">
                  <span className="font-semibold text-muted-foreground">
                    Explanation:
                  </span>
                  <span>{example.explanation}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-semibold">Constraints:</h3>
        <ul className="list-disc pl-5 space-y-1">
          {problem.constraints.map((constraint, index) => (
            <li key={index} className="font-mono text-sm">
              {constraint}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
