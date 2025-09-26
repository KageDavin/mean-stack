// src/app/models/quiz.ts
export interface QuizQuestionPublic {
  questionText: string;
  options: string[]; // public view: no correctOption
}

export interface QuizPublic {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  duration: number;
  questions: QuizQuestionPublic[];
  published?: boolean;
  createdBy?: { username: string } | string;
}

// Admin create/update DTO
export type QuizQuestionAdmin = {
  questionText: string;
  options: [string, string, string, string];
  correctOption: number;
};

export type CreateQuizDto = {
  title: string;
  description?: string;
  duration: number;
  questions: QuizQuestionAdmin[];
  published?: boolean;
};








// export interface QuizQuestionPublic {
//   questionText: string;
//   options: string[]; // no correctOption on public endpoint
// }

// export interface QuizPublic {
//   _id?: string;
//   id?: string;
//   title: string;
//   description?: string;
//   duration: number; // minutes
//   questions: QuizQuestionPublic[];
//   published?: boolean;
//   createdBy?: { username: string } | string;
// }
// export interface QuizAttempt {
//   quizId: string;
//   userId: string;
//   startedAt: Date;
//   completedAt?: Date;
//   answers: { questionIndex: number; selectedOptionIndex: number }[];
//   score?: number; // percentage
// }
