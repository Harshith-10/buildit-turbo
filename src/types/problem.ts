export interface Problem {
  id: string;
  serialNumber: number;
  title: string;
  slug: string;
  difficulty: string;
  category: string;
  description: string;
  acceptance: number;
  submissions: number;
  examples: string[];
  constraints: string[];
  starterCode: {
    code: string;
    language: string;
  }[];
  driverCode: {
    code: string;
    language: string;
  }[];
  testCases: TestCase[];
  creatorId: string;
}

export interface ProblemTag {
  id: string;
  problemId: string;
  tag: string;
}

export interface TestCase {
  id: string;
  input: string;
  output: string;
}
