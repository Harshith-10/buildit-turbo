export type Difficulty = "easy" | "medium" | "hard";

export interface MarksPerDifficulty {
  easy: number;
  medium: number;
  hard: number;
}

export interface Distribution {
  easy: number;
  medium: number;
  hard: number;
}

/**
 * Calculates all possible distributions of questions based on total marks, total questions,
 * and marks assigned to each difficulty level.
 *
 * @param totalQuestions Total number of questions required
 * @param totalMarks Total marks required
 * @param marksPerDifficulty Marks assigned to each difficulty level
 * @returns Array of valid distributions
 */
export function calculateDistributions(
  totalQuestions: number,
  totalMarks: number,
  marksPerDifficulty: MarksPerDifficulty,
): Distribution[] {
  const distributions: Distribution[] = [];

  // Safety check to avoid infinite loops or division by zero
  if (
    marksPerDifficulty.easy <= 0 ||
    marksPerDifficulty.medium <= 0 ||
    marksPerDifficulty.hard <= 0
  ) {
    return [];
  }

  // If totalQuestions is 0, find all combinations that match totalMarks regardless of count
  if (totalQuestions === 0) {
    const maxEasy = Math.floor(totalMarks / marksPerDifficulty.easy);

    for (let e = 0; e <= maxEasy; e++) {
      const remainingAfterEasy = totalMarks - e * marksPerDifficulty.easy;
      const maxMedium = Math.floor(
        remainingAfterEasy / marksPerDifficulty.medium,
      );

      for (let m = 0; m <= maxMedium; m++) {
        const remainingAfterMedium =
          remainingAfterEasy - m * marksPerDifficulty.medium;

        if (remainingAfterMedium % marksPerDifficulty.hard === 0) {
          const h = remainingAfterMedium / marksPerDifficulty.hard;
          distributions.push({ easy: e, medium: m, hard: h });
        }
      }
    }
    return distributions;
  }

  // Iterate through all possible numbers of easy questions (0 to totalQuestions)
  for (let e = 0; e <= totalQuestions; e++) {
    // Iterate through all possible numbers of medium questions (0 to remaining questions)
    for (let m = 0; m <= totalQuestions - e; m++) {
      const h = totalQuestions - e - m; // Remaining must be hard questions

      // Calculate total marks for this combination
      const currentMarks =
        e * marksPerDifficulty.easy +
        m * marksPerDifficulty.medium +
        h * marksPerDifficulty.hard;

      // Check if this combination matches the target total marks
      if (currentMarks === totalMarks) {
        distributions.push({ easy: e, medium: m, hard: h });
      }
    }
  }

  return distributions;
}
