// src/app/models/response.model.ts
export interface AttemptAnswer {
  questionIndex: number;
  selectedOption: number;
}

export interface AttemptPayload {
  answers: AttemptAnswer[];
}

export interface AttemptResult {
  id: string;
  score: number;  // 0..100
  total: number;  // total questions
  correct: number;
}
// export interface AttemptResponse {
//   attemptId: string;
//   quizId: string;
//   userId: string;
//   startedAt: string; // ISO date string
//   completedAt: string; // ISO date string
//   score: number; // 0..100
//   total: number; // total questions
//   correct: number;
//   answers: { questionIndex: number; selectedOptionIndex: number; correctOptionIndex: number; isCorrect: boolean }[];
// }
