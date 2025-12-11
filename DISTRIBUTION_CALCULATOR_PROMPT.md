# Distribution Calculator Feature - Implementation Prompt

## Overview
Create a question distribution calculator for exam creation that computes all valid combinations of easy, medium, and hard questions that satisfy both a total question count and total marks constraint.

## Core Algorithm Requirements

### Function: `calculateDistributions`

**Input Parameters:**
- `totalQuestions` (number): Total number of questions required in the exam
- `totalMarks` (number): Total marks the exam should be worth
- `marksPerDifficulty` (object): 
  - `easy` (number): Marks assigned to each easy question
  - `medium` (number): Marks assigned to each medium question
  - `hard` (number): Marks assigned to each hard question

**Output:**
- Array of `Distribution` objects, where each distribution contains:
  - `easy` (number): Count of easy questions
  - `medium` (number): Count of medium questions
  - `hard` (number): Count of hard questions

**Constraints:**
1. For each valid distribution: `easy + medium + hard = totalQuestions`
2. For each valid distribution: `(easy × marksPerDifficulty.easy) + (medium × marksPerDifficulty.medium) + (hard × marksPerDifficulty.hard) = totalMarks`
3. All question counts must be non-negative integers

**Special Cases:**
- If `totalQuestions = 0`: Find all combinations that match `totalMarks` regardless of total count
- If any `marksPerDifficulty` value is ≤ 0: Return empty array (safety check)

**Algorithm Approach:**
Use nested loops to iterate through all possible combinations:
1. Loop `easy` from 0 to `totalQuestions`
2. Loop `medium` from 0 to `totalQuestions - easy`
3. Calculate `hard = totalQuestions - easy - medium`
4. Calculate total marks for this combination
5. If marks match exactly, add to results

## UI Component Requirements

### Component: `DistributionCalculator`

**Props:**
- `totalQuestions`: Current total questions value
- `totalMarks`: Current total marks value
- `marksPerDifficulty`: Object with easy, medium, hard marks
- `allowedDistributions`: Array of selected distributions
- `onAllowedDistributionsChange`: Callback to update selected distributions
- `onConfigurationChange`: Callback to update configuration parameters

**Layout:**
Two-column card layout (responsive: stack on mobile)

#### Card 1: Configuration Panel
- **Title**: "Configuration"
- **Description**: "Set the parameters for distribution calculation"
- **Inputs:**
  - Total Questions (number input)
  - Total Marks (number input)
  - Marks per Difficulty:
    - Easy (number input, label "Easy")
    - Medium (number input, label "Medium")
    - Hard (number input, label "Hard")
  - Calculate Button (full-width, triggers calculation)

#### Card 2: Results Panel
- **Title**: "Possible Distributions"
- **Description**: "Select the combinations you want to allow"
- **Empty State**: "Click calculate to see possible combinations based on your settings."
- **Results Display:**
  - Scrollable container (max-height: 300px)
  - Each distribution shown as a clickable card with:
    - Three columns showing: Easy count, Medium count, Hard count
    - Visual labels beneath each count
    - Checkmark icon when selected
    - Toggle selection on click
    - Visual highlight when selected (primary color border/background)

**Interaction Logic:**
- User modifies configuration values → Updates parent state
- User clicks "Calculate Distributions" → Calls `calculateDistributions()` → Displays results
- User clicks a distribution → Toggles selection:
  - If not selected: Add to `allowedDistributions`
  - If selected: Remove from `allowedDistributions`
- Selection comparison based on exact match of all three difficulty counts

## TypeScript Types

```typescript
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
```

## Example Test Cases

### Test Case 1: Standard Distribution
```typescript
calculateDistributions(10, 100, { easy: 5, medium: 10, hard: 15 })
// Possible outputs include:
// { easy: 10, medium: 0, hard: 0 } → 50 marks ❌
// { easy: 0, medium: 10, hard: 0 } → 100 marks ✓
// { easy: 0, medium: 5, hard: 5 } → 125 marks ❌
// { easy: 4, medium: 6, hard: 0 } → 80 marks ❌
// etc.
```

### Test Case 2: Zero Questions Mode
```typescript
calculateDistributions(0, 60, { easy: 5, medium: 10, hard: 15 })
// Should return ALL combinations that sum to 60 marks:
// { easy: 12, medium: 0, hard: 0 } → 60 marks ✓
// { easy: 2, medium: 5, hard: 0 } → 60 marks ✓
// { easy: 0, medium: 0, hard: 4 } → 60 marks ✓
// etc.
```

### Test Case 3: Invalid Input
```typescript
calculateDistributions(10, 100, { easy: 0, medium: 10, hard: 15 })
// Should return []
```

## UI Framework Details
- **Component Library**: React with TypeScript
- **UI Components**: Use shadcn/ui components (Card, Input, Button, Label)
- **Styling**: Tailwind CSS utility classes
- **Icons**: lucide-react (Check icon for selection indicator)
- **State Management**: React useState for local state

## File Structure
```
src/
  lib/
    exam-utils.ts          # Core calculation logic
  components/
    faculty/
      exams/
        distribution-calculator.tsx  # UI component
```

## Key Implementation Notes
1. The algorithm must find ALL valid combinations, not just one solution
2. The calculation is computationally intensive for large values (O(n²) complexity)
3. Selection state is managed by comparing all three difficulty values
4. The configuration panel allows real-time editing of all parameters
5. Results are only shown after clicking "Calculate" button
6. The component is controlled - all state lives in parent component
