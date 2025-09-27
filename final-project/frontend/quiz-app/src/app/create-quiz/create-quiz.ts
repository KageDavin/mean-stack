// src/app/create-quiz/create-quiz.ts
// create-quiz.ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
  NonNullableFormBuilder,
  FormGroup
} from '@angular/forms';
import { Router } from '@angular/router';
import { QuizService } from '../shared/quiz.service';

type QuestionAdmin = {
  questionText: string;
  options: [string, string, string, string];
  correctOption: number;
};

type CreateQuizDto = {
  title: string;
  description?: string;
  duration: number;
  questions: QuestionAdmin[];
  published?: boolean;
};

type QuestionFG = {
  questionText: FormControl<string>;
  options: FormArray<FormControl<string>>;
  correctOption: FormControl<number>;
};

@Component({
  selector: 'create-quiz',
  templateUrl: './create-quiz.html',
  styleUrls: ['./create-quiz.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  host: { class: 'page create-quiz-page' }
})
export class CreateQuiz {
  private fb = inject(NonNullableFormBuilder);
  private quizService = inject(QuizService);
  private router = inject(Router);

  busy = signal(false);
  error = signal<string | null>(null);

  quizForm = this.fb.group({
    title: this.fb.control('', { validators: [Validators.required, Validators.minLength(3)] }),
    description: this.fb.control(''),
    duration: this.fb.control(10, { validators: [Validators.required, Validators.min(1)] }),
    questions: this.fb.array<FormGroup<QuestionFG>>([])
  });

  get questions(): FormArray<FormGroup<QuestionFG>> {
    return this.quizForm.controls.questions;
  }

  private makeQuestion() {
    return this.fb.group<QuestionFG>({
      questionText: this.fb.control('', { validators: [Validators.required, Validators.minLength(3)] }),
      options: this.fb.array<FormControl<string>>([
        this.fb.control('', { validators: [Validators.required] }),
        this.fb.control('', { validators: [Validators.required] }),
        this.fb.control('', { validators: [Validators.required] }),
        this.fb.control('', { validators: [Validators.required] }),
      ]),
      correctOption: this.fb.control(0, { validators: [Validators.required, Validators.min(0), Validators.max(3)] })
    });
  }

  Number = Number; // To fix mismatch in template
  addQuestion() { this.questions.push(this.makeQuestion()); }
  removeQuestion(index: number) { this.questions.removeAt(index); }

  private toTuple4(arr: string[]): [string, string, string, string] {
    if (!Array.isArray(arr) || arr.length !== 4) throw new Error('Each question must have exactly 4 options.');
    return [arr[0] ?? '', arr[1] ?? '', arr[2] ?? '', arr[3] ?? ''];
  }

  submitQuiz() {
    if (this.quizForm.invalid) {
      this.quizForm.markAllAsTouched();
      return;
    }

    this.busy.set(true);
    this.error.set(null);

    // Build DTO from form controls (no 'as' cast traps)
    const dto: CreateQuizDto = {
      title: this.quizForm.controls.title.value,
      description: this.quizForm.controls.description.value || '',
      duration: this.quizForm.controls.duration.value,
      questions: this.questions.controls.map(qg => {
        const opts = qg.controls.options.controls.map(c => c.value);
        return {
          questionText: qg.controls.questionText.value,
          options: this.toTuple4(opts),
          correctOption: qg.controls.correctOption.value
        };
      })
    };

    this.quizService.createQuiz(dto).subscribe({
      next: () => {
        this.busy.set(false);
        // navigate back to quiz list so the new quiz is visible
        this.router.navigate(['/quizzes']);
      },
      error: (err) => {
        this.busy.set(false);
        this.error.set(err?.error?.message ?? 'Failed to create quiz.');
      }
    });
  }
}










// import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
// import { ReactiveFormsModule, FormArray, FormBuilder, FormControl, Validators, NonNullableFormBuilder } from '@angular/forms';
// import { Router } from '@angular/router';
// import { QuizService } from '../shared/quiz.service';
// import type { FormGroup } from '@angular/forms';



// type QuestionFG = {
//   questionText: FormControl<string>;
//   options: FormArray<FormControl<string>>; // length must be 4
//   correctOption: FormControl<number>;
// };

// type CreateQuizForm = {
//   title: FormControl<string>;
//   description: FormControl<string>;
//   duration: FormControl<number>;
//   questions: FormArray<FormGroup<QuestionFG>>;
// };

// @Component({
//   selector: 'create-quiz',
//   templateUrl: './create-quiz.html',
//   styleUrls: ['./create-quiz.css'],
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   imports: [ReactiveFormsModule],
//   host: { class: 'page' }
// })
// export class CreateQuiz {
//   private fb = inject(NonNullableFormBuilder);
//   private quizService = inject(QuizService);
//   private router = inject(Router);

//   busy = signal(false);
//   error = signal<string | null>(null);

//   quizForm = this.fb.group<CreateQuizForm>({
//     title: this.fb.control('', { validators:[Validators.required, Validators.minLength(3)] }),
//     description: this.fb.control(''),
//     duration: this.fb.control(10, { validators:[Validators.required, Validators.min(1)] }),
//     questions: this.fb.array<FormGroup<QuestionFG>>([])
//   });

//   get questions(): FormArray<FormGroup<QuestionFG>> {
//     return this.quizForm.controls.questions;
//   }

//   private makeQuestionGroup(): FormGroup<QuestionFG> {
//     return this.fb.group<QuestionFG>({
//       questionText: this.fb.control('', { validators:[Validators.required, Validators.minLength(3)] }),
//       options: this.fb.array<FormControl<string>>([
//         this.fb.control('', { validators:[Validators.required] }),
//         this.fb.control('', { validators:[Validators.required] }),
//         this.fb.control('', { validators:[Validators.required] }),
//         this.fb.control('', { validators:[Validators.required] }),
//       ]),
//       correctOption: this.fb.control(0, { validators:[Validators.required, Validators.min(0), Validators.max(3)] })
//     });
//   }

//   addQuestion() {
//     this.questions.push(this.makeQuestionGroup());
//   }

//   removeQuestion(i: number) {
//     this.questions.removeAt(i);
//   }

//   private toTuple4(arr: string[]): [string,string,string,string] {
//     // runtime guard to avoid bad payloads
//     if (arr.length !== 4) throw new Error('Each question must have exactly 4 options.');
//     return [arr[0], arr[1], arr[2], arr[3]];
//   }

//  submitQuiz() {
//   if (this.quizForm.invalid) return;

//   this.busy.set(true);
//   this.error.set(null);

//   const raw = this.quizForm.getRawValue(); // raw.options is string[]
//   const toTuple4 = (arr: string[]): [string, string, string, string] => {
//     if (arr.length !== 4) throw new Error('Each question must have exactly 4 options.');
//     return [arr[0], arr[1], arr[2], arr[3]];
//   };

//   const dto = {
//     title: raw.title,
//     description: raw.description,
//     duration: raw.duration,
//     questions: raw.questions.map(q => ({
//       questionText: q.questionText,
//       // <-- q.options is string[] already; no .getRawValue() here
//       options: toTuple4(q.options),
//       correctOption: q.correctOption
//     }))
//   };

//   this.quizService.createQuiz(dto).subscribe({
//     next: () => { this.busy.set(false); this.router.navigate(['/quizzes']); },
//     error: (err) => { this.busy.set(false); this.error.set(err?.error?.message ?? 'Failed to create quiz.'); }
//   });
// }
