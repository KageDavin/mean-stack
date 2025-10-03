// ─────────────────────────────────────────────
// File: src/app/quiz/quiz-editor.ts
// Purpose: Signal-based quiz editor with validation and unsaved guard
// ─────────────────────────────────────────────

import { Component, inject, signal, computed, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizStore } from '../shared/quiz.store';
import type { CreateQuizDto } from '../models/quiz-admin.model';

@Component({
  selector: 'quiz-editor',
  templateUrl: './quiz-editor.html',
})
export class QuizEditor {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly store = inject(QuizStore);

  title = signal('');
  description = signal('');
  duration = signal(10);
  questions = signal<CreateQuizDto['questions']>([]);
  published = signal(false);

  isValidTitle = computed(() => this.title().trim().length >= 3);
  isValidDuration = computed(() => this.duration() > 0);
  isValidQuestions = computed(() =>
    this.questions().every(q =>
      q.questionText.trim().length > 0 &&
      q.options.every(opt => opt.trim().length > 0)
    )
  );

  isValid = computed(() =>
    this.isValidTitle() && this.isValidDuration() && this.isValidQuestions()
  );

  initialState = signal('');
  currentState = computed(() =>
    JSON.stringify({
      title: this.title(),
      description: this.description(),
      duration: this.duration(),
      questions: this.questions(),
      published: this.published(),
    })
  );

  hasUnsavedChanges = () => this.initialState() !== this.currentState();
  confirmLeave = () => window.confirm('You have unsaved changes. Leave anyway?');

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.store.setId(id);
      this.store.loadAdmin(id);
      effect(() => {
        const q = this.store.quizAdmin();
        if (q) {
          this.title.set(q.title ?? '');
          this.description.set(q.description ?? '');
          this.duration.set(q.duration ?? 10);
          this.questions.set(q.questions ?? []);
          this.published.set(!!q.published);
          this.initialState.set(this.currentState());
        }
      });
    } else {
      this.initialState.set(this.currentState());
    }
  }

  addQuestion() {
    this.questions.update(qs => [
      ...qs,
      { questionText: '', options: ['', '', '', ''], correctOption: 0 },
    ]);
  }

  removeQuestion(index: number) {
    this.questions.update(qs => qs.filter((_, i) => i !== index));
  }

  updateQuestionText(index: number, text: string) {
    this.questions.update(qs => {
      const copy = [...qs];
      copy[index].questionText = text;
      return copy;
    });
  }

  updateOption(qIndex: number, optIndex: number, value: string) {
    this.questions.update(qs => {
      const copy = [...qs];
      copy[qIndex].options[optIndex] = value;
      return copy;
    });
  }

  updateCorrectOption(qIndex: number, value: number) {
    this.questions.update(qs => {
      const copy = [...qs];
      copy[qIndex].correctOption = value;
      return copy;
    });
  }

  save() {
    if (!this.isValid()) {
      alert('Please fix validation errors before saving.');
      return;
    }

    const dto: CreateQuizDto = {
      title: this.title(),
      description: this.description(),
      duration: this.duration(),
      questions: this.questions(),
      published: this.published(),
    };

    const id = this.store.id();
    if (id) {
      this.store.update(id, dto, () => {
        this.initialState.set(this.currentState());
        this.router.navigate(['/dashboard']);
      });
    } else {
      this.store.create(dto, newId => {
        this.initialState.set(this.currentState());
        this.router.navigate(['/quiz', newId, 'edit']);
      });
    }
  }

  cancel() {
    if (this.hasUnsavedChanges() && !this.confirmLeave()) return;
    this.router.navigate(['/dashboard']);
  }
}



// import { Component, inject, signal, computed, effect } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { QuizStore } from '../shared/quiz.store';
// import type { CreateQuizDto } from '../models/quiz-admin.model';

// @Component({
//   selector: 'quiz-editor',
//   templateUrl: './quiz-editor.html',
// })
// export class QuizEditor {
//   private route = inject(ActivatedRoute);
//   private router = inject(Router);
//   readonly store = inject(QuizStore);

//   title = signal('');
//   description = signal('');
//   duration = signal(10);
//   questions = signal<CreateQuizDto['questions']>([]);
//   published = signal(false);

//   // Validation signals
//   isValidTitle = computed(() => this.title().trim().length >= 3);
//   isValidDuration = computed(() => this.duration() > 0);
//   isValidQuestions = computed(() =>
//     this.questions().every(q =>
//       q.questionText.trim().length > 0 &&
//       q.options.every(opt => opt.trim().length > 0)
//     )
//   );

//   isValid = computed(() =>
//     this.isValidTitle() && this.isValidDuration() && this.isValidQuestions()
//   );

//   // Unsaved change tracking
//   initialState = signal('');
//   currentState = computed(() =>
//     JSON.stringify({
//       title: this.title(),
//       description: this.description(),
//       duration: this.duration(),
//       questions: this.questions(),
//       published: this.published(),
//     })
//   );

//   hasUnsavedChanges = () => this.initialState() !== this.currentState();

//   confirmLeave = () => {
//     return window.confirm('You have unsaved changes. Are you sure you want to leave?');
//   };

//   constructor() {
//     const id = this.route.snapshot.paramMap.get('id');
//     if (id && id !== 'new') {
//       this.store.setId(id);
//       effect(() => {
//         const q = this.store.quiz();
//         if (q) {
//           this.title.set(q.title ?? '');
//           this.description.set(q.description ?? '');
//           this.duration.set(q.duration ?? 10);
//           this.questions.set(q.questions ?? []);
//           this.published.set(!!q.published);
//           this.initialState.set(this.currentState());
//         }
//       });
//     } else {
//       this.initialState.set(this.currentState());
//     }
//   }

//   addQuestion() {
//     this.questions.update(qs => [
//       ...qs,
//       { questionText: '', options: ['', '', '', ''], correctOption: 0 },
//     ]);
//   }

//   removeQuestion(index: number) {
//     this.questions.update(qs => qs.filter((_, i) => i !== index));
//   }

//   updateQuestionText(index: number, text: string) {
//     this.questions.update(qs => {
//       const copy = [...qs];
//       copy[index].questionText = text;
//       return copy;
//     });
//   }

//   updateOption(qIndex: number, optIndex: number, value: string) {
//     this.questions.update(qs => {
//       const copy = [...qs];
//       copy[qIndex].options[optIndex] = value;
//       return copy;
//     });
//   }

//   updateCorrectOption(qIndex: number, value: number) {
//     this.questions.update(qs => {
//       const copy = [...qs];
//       copy[qIndex].correctOption = value;
//       return copy;
//     });
//   }

//   save() {
//     if (!this.isValid()) {
//       alert('Please fix validation errors before saving.');
//       return;
//     }

//     const dto: CreateQuizDto = {
//       title: this.title(),
//       description: this.description(),
//       duration: this.duration(),
//       questions: this.questions(),
//       published: this.published(),
//     };

//     const id = this.store.id();
//     if (id) {
//       this.store.update(id, dto, () => {
//         this.initialState.set(this.currentState());
//         this.router.navigate(['/dashboard']);
//       });
//     } else {
//       this.store.create(dto, newId => {
//         this.initialState.set(this.currentState());
//         this.router.navigate(['/quiz', newId, 'edit']);
//       });
//     }
//   }

//   cancel() {
//     if (this.hasUnsavedChanges()) {
//       if (!this.confirmLeave()) return;
//     }
//     this.router.navigate(['/dashboard']);
//   }
// }
