// ─────────────────────────────────────────────
// File: src/app/shared/quiz.store.ts
// Purpose: Signal-based store for quiz data (Admin + Student)
// ─────────────────────────────────────────────

// File: src/app/shared/quiz.store.ts

import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { QuizService } from './quiz.service';
import { normalizeQuiz, normalizeQuizAdmin, normalizeQuizList } from '../utils/quiz-normalizer';
import type { QuizPublic } from '../models/quiz-public.model';
import type { QuizAdmin } from '../models/quiz-admin.model';
import type { CreateQuizDto } from '../models/quiz-admin.model';

@Injectable({ providedIn: 'root' })
export class QuizStore {
  private service = inject(QuizService);

  private _id = signal<string | null>(null);
  private _quizPublic = signal<QuizPublic | null>(null);
  private _quizAdmin = signal<QuizAdmin | null>(null);
  private _quizzes = signal<QuizPublic[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  readonly id = computed(() => this._id());
  readonly quizPublic = this._quizPublic.asReadonly();
  readonly quizAdmin = this._quizAdmin.asReadonly();
  readonly quizzes = this._quizzes.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  constructor() {}


quiz = signal<QuizPublic | null>(null);

load(id: string) {
  // fetch quiz by id and set to quiz signal
}

  setId(id: string) {
    this._id.set(id);
  }

  loadPublic(id: string) {
    this._loading.set(true);
    this._error.set(null);
    this.service.getForAttempt(id).subscribe({
      next: raw => {
        this._quizPublic.set(normalizeQuiz(raw));
        this._loading.set(false);
      },
      error: () => {
        this._error.set('Failed to load quiz');
        this._loading.set(false);
      },
    });
  }

  loadAdmin(id: string) {
    this._loading.set(true);
    this._error.set(null);
    this.service.getForEdit(id).subscribe({
      next: raw => {
        this._quizAdmin.set(normalizeQuizAdmin(raw));
        this._loading.set(false);
      },
      error: () => {
        this._error.set('Failed to load admin quiz');
        this._loading.set(false);
      },
    });
  }

  listPublished() {
    this.service.list().subscribe({
      next: quizzes => {
        const published = quizzes.filter(q => q.published);
        this._quizzes.set(published);
      },
      error: () => this._error.set('Failed to load published quizzes'),
    });
  }

  listAll() {
    this.service.list().subscribe({
      next: quizzes => this._quizzes.set(quizzes),
      error: () => this._error.set('Failed to load all quizzes'),
    });
  }

  create(dto: CreateQuizDto, callback: (id: string) => void) {
    this._loading.set(true);
    this._error.set(null);
    this.service.createQuiz(dto).subscribe({
      next: quiz => {
        this._quizPublic.set(quiz);
        this._quizzes.update(qs => [...qs, quiz]);
        this._loading.set(false);
        callback(quiz.id);
      },
      error: () => {
        this._error.set('Failed to create quiz');
        this._loading.set(false);
      },
    });
  }

  update(id: string, dto: CreateQuizDto, callback: () => void) {
    this._loading.set(true);
    this._error.set(null);
    this.service.updateQuiz(id, dto).subscribe({
      next: quiz => {
        this._quizPublic.set(quiz);
        this._quizzes.update(qs => qs.map(q => (q.id === id ? quiz : q)));
        this._loading.set(false);
        callback();
      },
      error: () => {
        this._error.set('Failed to update quiz');
        this._loading.set(false);
      },
    });
  }

  delete(id: string) {
    this.service.deleteQuiz(id).subscribe(() => {
      this._quizzes.update(qs => qs.filter(q => q.id !== id));
      if (this.id() === id) {
        this._quizPublic.set(null);
        this._quizAdmin.set(null);
      }
    });
  }

  togglePublish(id: string, publish: boolean) {
    this._quizzes.update(qs =>
      qs.map(q => (q.id === id ? { ...q, published: publish } : q))
    );
    if (this.id() === id) {
      this._quizPublic.update(q => (q ? { ...q, published: publish } : q));
    }
  }
}




// import { Injectable, signal, computed, effect, inject } from '@angular/core';
// import { QuizService } from './quiz.service';
// import type { QuizPublic } from '../models/quiz-public.model';
// import type { CreateQuizDto } from '../models/quiz-admin.model';

// @Injectable({ providedIn: 'root' })
// export class QuizStore {
//   private service = inject(QuizService);

//   // Signals
//   private _id = signal<string | null>(null);
//   private _quiz = signal<QuizPublic | null>(null);
//   private _quizzes = signal<QuizPublic[]>([]);
//   private _loading = signal(false);
//   private _error = signal<string | null>(null);

//   // Public readonly access
//   readonly id = computed(() => this._id());
//   readonly quiz = this._quiz.asReadonly();
//   readonly quizzes = this._quizzes.asReadonly();
//   readonly loading = this._loading.asReadonly();
//   readonly error = this._error.asReadonly();

//   constructor() {
//     // Reactive fetch for student attempt or editor view
//     effect(() => {
//       const id = this._id();
//       if (!id) return;

//       this._loading.set(true);
//       this._error.set(null);

//       this.service.getForAttempt(id).subscribe({
//         next: quiz => {
//           this._quiz.set(quiz);
//           this._loading.set(false);
//         },
//         error: () => {
//           this._error.set('Failed to load quiz');
//           this._loading.set(false);
//         },
//       });
//     });
//   }

//   // ─── Student Flow ───────────────────────────

//   setId(id: string) {
//     this._id.set(id);
//   }

//   listPublished() {
//     this.service.list().subscribe({
//       next: quizzes => {
//         const published = quizzes.filter(q => q.published);
//         this._quizzes.set(published);
//       },
//       error: () => this._error.set('Failed to load published quizzes'),
//     });
//   }

//   // ─── Admin Flow ─────────────────────────────

//   listAll() {
//     this.service.list().subscribe({
//       next: quizzes => this._quizzes.set(quizzes),
//       error: () => this._error.set('Failed to load all quizzes'),
//     });
//   }

//   create(dto: CreateQuizDto, callback: (id: string) => void) {
//     this._loading.set(true);
//     this._error.set(null);

//     this.service.createQuiz(dto).subscribe({
//       next: quiz => {
//         this._quiz.set(quiz);
//         this._quizzes.update(qs => [...qs, quiz]);
//         this._loading.set(false);
//         callback(quiz.id);
//       },
//       error: () => {
//         this._error.set('Failed to create quiz');
//         this._loading.set(false);
//       },
//     });
//   }

//   update(id: string, dto: CreateQuizDto, callback: () => void) {
//     this._loading.set(true);
//     this._error.set(null);

//     this.service.updateQuiz(id, dto).subscribe({
//       next: quiz => {
//         this._quiz.set(quiz);
//         this._quizzes.update(qs =>
//           qs.map(q => (q.id === id ? quiz : q))
//         );
//         this._loading.set(false);
//         callback();
//       },
//       error: () => {
//         this._error.set('Failed to update quiz');
//         this._loading.set(false);
//       },
//     });
//   }

//   delete(id: string) {
//     this.service.deleteQuiz(id).subscribe(() => {
//       this._quizzes.update(qs => qs.filter(q => q.id !== id));
//       if (this.id() === id) this._quiz.set(null);
//     });
//   }

//   togglePublish(id: string, publish: boolean) {
//     this._quizzes.update(qs =>
//       qs.map(q => (q.id === id ? { ...q, published: publish } : q))
//     );
//     if (this.id() === id) {
//       this._quiz.update(q => q ? { ...q, published: publish } : q);
//     }
//   }
// }
