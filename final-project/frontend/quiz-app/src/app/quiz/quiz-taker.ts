// src/app/quiz/quiz-taker.ts

// File: src/app/quiz/quiz-taker.ts

import { Component, inject, signal, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizStore } from '../shared/quiz.store';
import { ResponseService } from '../shared/response.service';

@Component({
  selector: 'quiz-taker',
  templateUrl: './quiz-taker.html',
})
export class QuizTaker {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(QuizStore);
  private response = inject(ResponseService);

  answers = signal<number[]>([]);
  quiz = this.store.quizPublic;
  // src/app/quiz/quiz-taker.ts
completedCount = computed(() => answers().filter(a => a !== null).length);
position = signal({ x: 0, y: 0 });
startDrag(event: MouseEvent) { /* logic */ }
isDragging = signal(false);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.setId(id);
      this.store.loadPublic(id);
    }

    effect(() => {
      const q = this.quiz();
      if (q) {
        this.answers.set(new Array(q.questions.length).fill(-1));
      }
    });
  }

  updateAnswer(index: number, value: number) {
    this.answers.update(ans => {
      const copy = [...ans];
      copy[index] = value;
      return copy;
    });
  }

  submit() {
    const quizId = this.store.id();
    const payload = { answers: this.answers() };

    if (!quizId) return;

    this.response.attempt(quizId, payload).subscribe(result => {
      this.router.navigate(['/quiz', quizId, 'results'], {
        state: {
          score: result.score,
          total: result.total,
          answers: this.answers(),
        },
      });
    });
  }
}



// import { Component, inject, signal, computed, effect } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
// import { QuizStore } from '../shared/quiz.store';
// import { ResponseStore } from '../shared/response.store';

// @Component({
//   selector: 'quiz-taker',
//   standalone: true,
//   templateUrl: './quiz-taker.html',
// })
// export class QuizTaker {
//   private route = inject(ActivatedRoute);
//   private router = inject(Router);
//   private store = inject(QuizStore);
//   private responseStore = inject(ResponseStore);
//   private fb = inject(FormBuilder);

//   quiz = this.store.quiz;
//   loading = this.store.loading;
//   error = this.store.error;

//   form = signal<FormGroup>(this.fb.group({ answers: this.fb.array([]) }));
//   score = signal<number | null>(null);
//   submitted = signal(false);

//   timer = signal(this.quiz()?.duration ? this.quiz()!.duration * 60 : 600);
//   expired = signal(false);

//   position = signal({ x: 20, y: 20 });
//   dragging = signal(false);

//   constructor() {
//     const id = this.route.snapshot.paramMap.get('id');
//     if (id) this.store.setId(id);

//     effect(() => {
//       const q = this.quiz();
//       if (q && this.answers().length === 0) {
//         const controls = q.questions.map(() => this.fb.control(-1, Validators.required));
//         this.form().setControl('answers', this.fb.array(controls));
//       }
//     });

//     this.startTimer();
//   }

//   get answers(): () => FormArray {
//     return () => this.form().get('answers') as FormArray;
//   }

//   selectAnswer(qIndex: number, optIndex: number) {
//     this.answers().controls[qIndex].setValue(optIndex);
//   }

//   isAnswered(index: number): boolean {
//     return this.answers().controls[index].value !== -1;
//   }

//   isDragging(): boolean {
//     return this.dragging();
//   }

//   completedCount = computed(() =>
//     this.answers().controls.filter(c => c.value !== -1).length
//   );

//   isComplete = computed(() =>
//     this.answers().controls.every(c => c.valid && c.value !== -1)
//   );

//   startTimer() {
//     const interval = setInterval(() => {
//       this.timer.update(t => t - 1);
//       if (this.timer() <= 0) {
//         clearInterval(interval);
//         this.expired.set(true);
//         this.submit();
//       }
//     }, 1000);
//   }

//   startDrag(event: MouseEvent) {
//     event.preventDefault();
//     this.dragging.set(true);

//     const onMove = (moveEvent: MouseEvent) => {
//       if (!this.dragging()) return;
//       this.position.set({
//         x: moveEvent.clientX - 100,
//         y: moveEvent.clientY - 20,
//       });
//     };

//     const onUp = () => {
//       this.dragging.set(false);
//       window.removeEventListener('mousemove', onMove);
//       window.removeEventListener('mouseup', onUp);
//     };

//     window.addEventListener('mousemove', onMove);
//     window.addEventListener('mouseup', onUp);
//   }

//   submit() {
//     const q = this.quiz();
//     const answers = this.answers().value;
//     if (!q || !this.isComplete()) {
//       alert('Please answer all questions before submitting.');
//       return;
//     }

//     if (!window.confirm('Are you sure you want to submit your answers?')) return;

//     const correct = q.questions.reduce((acc, question, index) => {
//       return acc + (question.correctOption === answers[index] ? 1 : 0);
//     }, 0);

//     this.score.set(correct);
//     this.submitted.set(true);
//     this.responseStore.submitAttempt(q, answers);
//   }

//   cancel() {
//     if (!this.submitted() && this.isComplete()) {
//       if (!window.confirm('You haven’t submitted your quiz yet. Leave anyway?')) return;
//     }
//     this.router.navigate(['/dashboard']);
//   }
// }




//  Updated Code to v20 best proactives and standards
// import { Component, inject, signal, computed, effect } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { QuizStore } from '../shared/quiz.store';
// import { ResponseStore } from '../shared/response.store';
// import type { QuizPublic } from '../models/quiz-public.model';

// @Component({
//   selector: 'quiz-taker',
//   standalone: true,
//   templateUrl: './quiz-taker.html',
// })
// export class QuizTaker {
//   private route = inject(ActivatedRoute);
//   private router = inject(Router);
//   private store = inject(QuizStore);
//   private responseStore = inject(ResponseStore);

//   quiz = this.store.quiz;
//   loading = this.store.loading;
//   error = this.store.error;

//   selectedAnswers = signal<number[]>([]);
//   score = signal<number | null>(null);
//   submitted = signal(false);

//   constructor() {
//     const id = this.route.snapshot.paramMap.get('id');
//     if (id) this.store.setId(id);

//     effect(() => {
//       const q = this.quiz();
//       if (q && this.selectedAnswers().length === 0) {
//         this.selectedAnswers.set(new Array(q.questions.length).fill(-1));
//       }
//     });
//   }

//   timer = signal(quiz()?.duration * 60); // seconds
// expired = signal(false);

// startTimer() {
//   const interval = setInterval(() => {
//     this.timer.update(t => t - 1);
//     if (this.timer() <= 0) {
//       clearInterval(interval);
//       this.expired.set(true);
//       this.submit();
//     }
//   }, 1000);
// }

// position = signal({ x: 20, y: 20 });
// dragging = signal(false);

// startDrag(event: MouseEvent) {
//   event.preventDefault();
//   this.dragging.set(true);

//   const onMove = (moveEvent: MouseEvent) => {
//     if (!this.dragging()) return;
//     this.position.set({
//       x: moveEvent.clientX - 100,
//       y: moveEvent.clientY - 20,
//     });
//   };

//   const onUp = () => {
//     this.dragging.set(false);
//     window.removeEventListener('mousemove', onMove);
//     window.removeEventListener('mouseup', onUp);
//   };

//   window.addEventListener('mousemove', onMove);
//   window.addEventListener('mouseup', onUp);
// }

//   selectAnswer(qIndex: number, optIndex: number) {
//     this.selectedAnswers.update(ans => {
//       const copy = [...ans];
//       copy[qIndex] = optIndex;
//       return copy;
//     });
//   }

//   isComplete = computed(() =>
//     this.selectedAnswers().every(index => index !== -1)
//   );

//   hasUnsavedChanges = () => !this.submitted() && this.isComplete();

//   confirmLeave = () => {
//     return window.confirm('You haven’t submitted your quiz yet. Leave anyway?');
//   };

//   submit() {
//     const q = this.quiz();
//     const answers = this.selectedAnswers();
//     if (!q || !this.isComplete()) {
//       alert('Please answer all questions before submitting.');
//       return;
//     }

//     if (!window.confirm('Are you sure you want to submit your answers?')) return;

//     const correct = q.questions.reduce((acc, question, i) => {
//       return acc + (question.correctOption === answers[i] ? 1 : 0);
//     }, 0);

//     this.score.set(correct);
//     this.submitted.set(true);
//     this.responseStore.submitAttempt(q, answers);
//   }

//   cancel() {
//     if (!this.submitted() && this.isComplete()) {
//       if (!this.confirmLeave()) return;
//     }
//     this.router.navigate(['/dashboard']);
//   }
// }
