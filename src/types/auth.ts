export interface User {
  username: string;
  displayUsername: string;
  email: string;
  name: string;
  role: string;
  image: string;
  rank: number;
  problemsSolved: number;
  totalProblems: number;
  examsPassed: number;
  totalExams: number;
  streak: number;
}

export interface UserFast {
  username: string;
  displayUsername: string;
  email: string;
  name: string;
  image: string;
}
