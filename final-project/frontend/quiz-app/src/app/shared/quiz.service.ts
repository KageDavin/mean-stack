// src/app/shared/quiz.service.ts

// File: src/app/shared/quiz.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import type { QuizPublicRaw } from '../utils/quiz-raw';
import type { QuizPublic } from '../models/quiz-public.model';
import type { QuizAdmin } from '../models/quiz-admin.model';
import type { CreateQuizDto } from '../models/quiz-admin.model';
import { normalizeQuizList, normalizeQuiz, normalizeQuizAdmin } from '../utils/quiz-normalizer';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private http = inject(HttpClient);
  private base = environment.api;

  list() {
    return this.http.get<QuizPublicRaw[]>(`${this.base}/quizzes`).pipe(
      map(normalizeQuizList)
    );
  }

  getForAttempt(id: string) {
    return this.http.get<QuizPublicRaw>(`${this.base}/quizzes/${id}`).pipe(
      map(normalizeQuiz)
    );
  }

  getForEdit(id: string) {
    return this.http.get<QuizPublicRaw>(`${this.base}/quizzes/${id}/edit`).pipe(
      map(normalizeQuizAdmin)
    );
  }

getAnalytics(): Promise<{ quizId: string; attempts: number; avgScore: number }[]> {
  return firstValueFrom(this.http.get(`${environment.api}/analytics`));
}

  createQuiz(dto: CreateQuizDto) {
    return this.http.post<QuizPublic>(`${this.base}/quizzes`, dto);
  }

  updateQuiz(id: string, dto: CreateQuizDto) {
    return this.http.put<QuizPublic>(`${this.base}/quizzes/${id}`, dto);
  }

  deleteQuiz(id: string) {
    return this.http.delete(`${this.base}/quizzes/${id}`);
  }
}




// import { Injectable, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../environments/environment';
// import type { QuizPublic } from '../models/quiz-public.model';
// import type { CreateQuizDto } from '../models/quiz-admin.model';
// import { map } from 'rxjs/operators';
// import type { QuizPublicRaw } from '../utils/quiz-raw';
// import { normalizeQuizList, normalizeQuiz } from '../utils/quiz-normalizer';


// @Injectable({ providedIn: 'root' })
// export class QuizService {
//   private http = inject(HttpClient);
//   private base = environment.api;

//   list() {
//   return this.http.get<QuizPublicRaw[]>(`${this.base}/quizzes`).pipe(
//     map(normalizeQuizList)
//   );
// }

// getForAttempt(id: string) {
//   return this.http.get<QuizPublicRaw>(`${this.base}/quizzes/${id}`).pipe(
//     map(normalizeQuiz)
//   );
// }

//   getForEdit(id: string) {
//     return this.http.get<CreateQuizDto>(`${this.base}/quizzes/${id}/edit`);
//   }

//   createQuiz(dto: CreateQuizDto) {
//     return this.http.post<QuizPublic>(`${this.base}/quizzes`, dto);
//   }

//   updateQuiz(id: string, dto: CreateQuizDto) {
//     return this.http.put<QuizPublic>(`${this.base}/quizzes/${id}`, dto);
//   }

//   deleteQuiz(id: string) {
//     return this.http.delete(`${this.base}/quizzes/${id}`);
//   }
// }


// ###### Formal Code missing v20 best pracice fuctional-style guards environment ########
// import { Injectable, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../environments/environment.id';
// import type { QuizPublic } from '../models/quiz';

// type CreateQuizDto = {
//   title: string;
//   description?: string;
//   duration: number;
//   questions: { questionText: string; options: [string, string, string, string]; correctOption: number }[];
//   published?: boolean;
// };


// @Injectable({ providedIn: 'root' })
// export class QuizService {
//   private http = inject(HttpClient);

//   list() {
//     return this.http.get<QuizPublic[]>(`${environment.api}/quizzes`);
//   }

//   getForAttempt(id: string) {
//     return this.http.get<QuizPublic>(`${environment.api}/quizzes/${id}`);
//   }

//   createQuiz(dto: CreateQuizDto) {
//     return this.http.post<QuizPublic>(`${environment.api}/quizzes`, dto);
//   }

//   updateQuiz(id: string, dto: CreateQuizDto) {
//     return this.http.put<QuizPublic>(`${environment.api}/quizzes/${id}`, dto);
//   }

//   deleteQuiz(id: string) {
//     return this.http.delete(`${environment.api}/quizzes/${id}`);
//   }
// }

// import { Injectable, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../environments/environment';
// import type { QuizPublic } from '../models/quiz';

// @Injectable({
//   providedIn: 'root'
//  })

// export class QuizService {
//   private http = inject(HttpClient);

//   list() {
//     return this.http.get<QuizPublic[]>(`${environment.api}/quizzes`);
//   }

//   getForAttempt(id: string) {
//     return this.http.get<QuizPublic>(`${environment.api}/quizzes/${id}`);
//   }
// }
