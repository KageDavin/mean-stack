// ─────────────────────────────────────────────
// File: src/app/quiz/quiz-results.ts
// Purpose: Displays score and feedback after quiz attempt
// ─────────────────────────────────────────────

// File: src/app/quiz/quiz-results.ts v2

import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { QuizStore } from '../shared/quiz.store';

@Component({
  selector: 'quiz-results',
  templateUrl: './quiz-results.html',
})
export class QuizResults {
  private router = inject(Router);
  private store = inject(QuizStore);

  quiz = this.store.quizPublic(); // or quizAdmin() if showing correct answers

  state = this.router.getCurrentNavigation()?.extras?.state as {
    score: number;
    total: number;
    answers: number[];
  };

  get percentage() {
    return Math.round((this.state.score / this.state.total) * 100);
  }

  retry() {
    if (this.quiz?.id) {
      this.router.navigate(['/quiz', this.quiz.id, 'attempt']);
    }
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }
}



// import { Component, inject } from '@angular/core';
// import { Router } from '@angular/router';
// import { QuizStore } from '../../shared/quiz.store';

// @Component({
//   selector: 'quiz-results',
//   standalone: true,
//   templateUrl: './quiz-results.html',
// })
// export class QuizResults {
//   private router = inject(Router);
//   private store = inject(QuizStore);

//   quiz = this.store.quiz();

//   // Access passed state from quiz-taker
//   state = this.router.getCurrentNavigation()?.extras?.state as {
//     score: number;
//     total: number;
//     answers: number[];
//   };

//   get percentage() {
//     return Math.round((this.state.score / this.state.total) * 100);
//   }

//   retry() {
//     if (this.quiz?.id) {
//       this.router.navigate(['/quiz', this.quiz.id, 'attempt']);
//     }
//   }

//   goHome() {
//     this.router.navigate(['/dashboard']);
//   }
// }




// ─────────────────────────────────────────────
// File: src/app/shared/response.store.ts
// Purpose: Signal-based store for quiz attempts
// ─────────────────────────────────────────────

// import { Injectable, signal } from '@angular/core';
// import { Router } from '@angular/router';
// import type { QuizPublic } from '../models/quiz-public.model';
// import { CreateQuizDto } from './../models/quiz-admin.model';

// @Injectable({ providedIn: 'root' })
// export class ResponseStore {
//   constructor(private router: Router) {}

//   score = signal<number | null>(null);
//   total = signal<number | null>(null);
//   answers = signal<number[]>([]);
//   quiz = signal<QuizPublic | null>(null);

//   submitAttempt(quiz: QuizPublic, selected: number[]) {
//     this.quiz.set(quiz);
//     this.answers.set(selected);

//     let correct = 0;
//     quiz.questions.forEach((q, i) => {
//       if (selected[i] === q.correctOption) correct++;
//     });

//     this.score.set(correct);
//     this.total.set(quiz.questions.length);

//     this.router.navigate(['/quiz', quiz.id, 'results']);
//   }

//   reset() {
//     this.score.set(null);
//     this.total.set(null);
//     this.answers.set([]);
//     this.quiz.set(null);
//   }

// }
