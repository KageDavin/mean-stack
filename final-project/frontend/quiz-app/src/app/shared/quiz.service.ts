// src/app/shared/quiz.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import type { QuizPublic } from '../models/quiz';

type CreateQuizDto = {
  title: string;
  description?: string;
  duration: number;
  questions: { questionText: string; options: [string, string, string, string]; correctOption: number }[];
  published?: boolean;
};


@Injectable({ providedIn: 'root' })
export class QuizService {
  private http = inject(HttpClient);

  list() {
    return this.http.get<QuizPublic[]>(`${environment.api}/quizzes`);
  }

  getForAttempt(id: string) {
    return this.http.get<QuizPublic>(`${environment.api}/quizzes/${id}`);
  }

  createQuiz(dto: CreateQuizDto) {
    return this.http.post<QuizPublic>(`${environment.api}/quizzes`, dto);
  }

  updateQuiz(id: string, dto: CreateQuizDto) {
    return this.http.put<QuizPublic>(`${environment.api}/quizzes/${id}`, dto);
  }

  deleteQuiz(id: string) {
    return this.http.delete(`${environment.api}/quizzes/${id}`);
  }
}









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
