// File: src/app/utils/quiz-normalizer.ts

import type { QuizPublicRaw } from './quiz-raw';
import type { QuizPublic } from '../models/quiz-public.model';
import type { QuizAdmin } from '../models/quiz-admin.model';

/** Type guard to ensure createdBy is an object with a username */
function isCreatedByObject(value: unknown): value is { username: string } {
  return typeof value === 'object' && value !== null && 'username' in value;
}

/** Normalize public-facing quiz (strips internal fields) */
export function normalizeQuiz(raw: QuizPublicRaw): QuizPublic {
  return {
    id: raw._id,
    title: raw.title,
    description: raw.description ?? '',
    duration: raw.duration,
    questions: raw.questions.map(q => ({
      questionText: q.questionText,
      options: q.options,
    })),
    published: raw.published ?? false,
    createdBy: isCreatedByObject(raw.createdBy)
      ? raw.createdBy
      : { username: String(raw.createdBy ?? 'unknown') },
    tags: raw.tags ?? [],
    category: raw.category ?? 'uncategorized',
    createdAt: raw.createdAt ?? '',
    updatedAt: raw.updatedAt ?? '',
  };
}

/** Normalize admin-facing quiz (preserves all fields) */
export function normalizeQuizAdmin(raw: QuizPublicRaw): QuizAdmin {
  return {
    id: raw._id,
    title: raw.title,
    description: raw.description ?? '',
    duration: raw.duration,
    published: raw.published ?? false,
    createdBy: isCreatedByObject(raw.createdBy)
      ? raw.createdBy
      : { username: String(raw.createdBy ?? 'unknown') },
    tags: raw.tags ?? [],
    category: raw.category ?? 'uncategorized',
    createdAt: raw.createdAt ?? '',
    updatedAt: raw.updatedAt ?? '',
    questions: raw.questions.map(q => ({
      questionText: q.questionText,
      options: q.options,
      correctOption: (q as any).correctOption ?? -1,
      _internalId: (q as any)._internalId ?? '',
    })),
  };
}

export function normalizeQuizList(rawList: QuizPublicRaw[]): QuizPublic[] {
  return rawList.map(normalizeQuiz);
}




// src/app/utils/quiz-normalizer.ts
// import type { QuizPublicRaw, QuizQuestionRaw } from './quiz-raw';
// import type { QuizPublic } from '../models/quiz-public.model';
// import type { QuizAdmin } from '../models/quiz-admin.model';

// /** Type guard to ensure createdBy is an object with a username */
// function isCreatedByObject(value: unknown): value is { username: string } {
//   return typeof value === 'object' && value !== null && 'username' in value;
// }

// /** Normalize public-facing quiz (strips internal fields) */
// export function normalizeQuiz(raw: QuizPublicRaw): QuizPublic {
//   return {
//     id: raw._id,
//     title: raw.title,
//     description: raw.description ?? '',
//     duration: raw.duration,
//     questions: raw.questions.map(q => ({
//       questionText: q.questionText,
//       options: q.options,
//     })),
//     published: raw.published ?? false,
//     createdBy: isCreatedByObject(raw.createdBy)
//       ? raw.createdBy
//       : { username: String(raw.createdBy ?? 'unknown') },
//     tags: raw.tags ?? [],
//     category: raw.category ?? 'uncategorized',
//     createdAt: raw.createdAt ?? '',
//     updatedAt: raw.updatedAt ?? '',
//   };
// }

// /** Normalize admin-facing quiz (preserves all fields) */
// export function normalizeQuizAdmin(raw: QuizPublicRaw): QuizAdmin {
//   return {
//     id: raw._id,
//     title: raw.title,
//     description: raw.description ?? '',
//     duration: raw.duration,
//     published: raw.published ?? false,
//     createdBy: isCreatedByObject(raw.createdBy)
//       ? raw.createdBy
//       : { username: String(raw.createdBy ?? 'unknown') },
//     tags: raw.tags ?? [],
//     category: raw.category ?? 'uncategorized',
//     createdAt: raw.createdAt ?? '',
//     updatedAt: raw.updatedAt ?? '',
//     questions: raw.questions.map(q => ({
//       questionText: q.questionText,
//       options: q.options,
//       correctOption: (q as any).correctOption ?? -1, // ✅ preserve correct answer
//       _internalId: (q as any)._internalId ?? '',     // ✅ preserve internal ID
//     })),
//   };
// }




// import type { QuizPublicRaw } from './quiz-raw';
// import type { QuizPublic } from '../models/quiz-public.model';

// export function normalizeQuiz(raw: QuizPublicRaw): QuizPublic {
//   return {
//     id: raw._id,
//     title: raw.title,
//     description: raw.description ?? '',
//     duration: raw.duration,
//     questions: raw.questions,
//     published: raw.published ?? false,
//     createdBy: typeof raw.createdBy === 'string'
//       ? { username: raw.createdBy }
//       : raw.createdBy ?? { username: 'unknown' },
//     tags: raw.tags ?? [],
//     category: raw.category ?? 'uncategorized',
//     createdAt: raw.createdAt ?? '',
//     updatedAt: raw.updatedAt ?? '',
//   };
// }

// export function normalizeQuizList(rawList: QuizPublicRaw[]): QuizPublic[] {
//   return rawList.map(normalizeQuiz);
// }
