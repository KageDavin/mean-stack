// src/app/models/quiz-admin.model.ts

export interface QuizQuestionAdmin {
  questionText: string;
  options: [string, string, string, string];
  correctOption: number;
}

export interface CreateQuizDto {
  title: string;
  description?: string;
  duration: number;
  questions: QuizQuestionAdmin[];
  published?: boolean;
}
