// src/app/models/quiz-raw.ts

export interface QuizQuestionRaw {
  questionText: string;
  options: string[];
}

export interface QuizPublicRaw {
  _id: string;
  title: string;
  description?: string;
  duration: number;
  questions: QuizQuestionRaw[];
  published?: boolean;
  createdBy?: { username: string } | string;
  tags?: string[];
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}
