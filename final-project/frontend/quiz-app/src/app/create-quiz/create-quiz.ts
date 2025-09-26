// src/app/create-quiz/create-quiz.ts
// create-quiz.ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormArray, FormBuilder, FormControl, Validators, NonNullableFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { QuizService } from '../shared/quiz.service';
import type { FormGroup } from '@angular/forms';



type QuestionFG = {
  questionText: FormControl<string>;
  options: FormArray<FormControl<string>>; // length must be 4
  correctOption: FormControl<number>;
};

type CreateQuizForm = {
  title: FormControl<string>;
  description: FormControl<string>;
  duration: FormControl<number>;
  questions: FormArray<FormGroup<QuestionFG>>;
};

@Component({
  selector: 'create-quiz',
  templateUrl: './create-quiz.html',
  styleUrls: ['./create-quiz.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  host: { class: 'page' }
})
export class CreateQuiz {
  private fb = inject(NonNullableFormBuilder);
  private quizService = inject(QuizService);
  private router = inject(Router);

  busy = signal(false);
  error = signal<string | null>(null);

  quizForm = this.fb.group<CreateQuizForm>({
    title: this.fb.control('', { validators:[Validators.required, Validators.minLength(3)] }),
    description: this.fb.control(''),
    duration: this.fb.control(10, { validators:[Validators.required, Validators.min(1)] }),
    questions: this.fb.array<FormGroup<QuestionFG>>([])
  });

  get questions(): FormArray<FormGroup<QuestionFG>> {
    return this.quizForm.controls.questions;
  }

  private makeQuestionGroup(): FormGroup<QuestionFG> {
    return this.fb.group<QuestionFG>({
      questionText: this.fb.control('', { validators:[Validators.required, Validators.minLength(3)] }),
      options: this.fb.array<FormControl<string>>([
        this.fb.control('', { validators:[Validators.required] }),
        this.fb.control('', { validators:[Validators.required] }),
        this.fb.control('', { validators:[Validators.required] }),
        this.fb.control('', { validators:[Validators.required] }),
      ]),
      correctOption: this.fb.control(0, { validators:[Validators.required, Validators.min(0), Validators.max(3)] })
    });
  }

  addQuestion() {
    this.questions.push(this.makeQuestionGroup());
  }

  removeQuestion(i: number) {
    this.questions.removeAt(i);
  }

  private toTuple4(arr: string[]): [string,string,string,string] {
    // runtime guard to avoid bad payloads
    if (arr.length !== 4) throw new Error('Each question must have exactly 4 options.');
    return [arr[0], arr[1], arr[2], arr[3]];
  }

 submitQuiz() {
  if (this.quizForm.invalid) return;

  this.busy.set(true);
  this.error.set(null);

  const raw = this.quizForm.getRawValue(); // raw.options is string[]
  const toTuple4 = (arr: string[]): [string, string, string, string] => {
    if (arr.length !== 4) throw new Error('Each question must have exactly 4 options.');
    return [arr[0], arr[1], arr[2], arr[3]];
  };

  const dto = {
    title: raw.title,
    description: raw.description,
    duration: raw.duration,
    questions: raw.questions.map(q => ({
      questionText: q.questionText,
      // <-- q.options is string[] already; no .getRawValue() here
      options: toTuple4(q.options),
      correctOption: q.correctOption
    }))
  };

  this.quizService.createQuiz(dto).subscribe({
    next: () => { this.busy.set(false); this.router.navigate(['/quizzes']); },
    error: (err) => { this.busy.set(false); this.error.set(err?.error?.message ?? 'Failed to create quiz.'); }
  });
}
}













// import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
// import { ReactiveFormsModule, FormArray, FormBuilder, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { QuizService } from '../shared/quiz.service';

// type CreateQuizDto = {
//   title: string;
//   description?: string;
//   duration: number;
//   questions: { questionText: string; options: [string, string, string, string]; correctOption: number }[];
//   published?: boolean;
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
//   private fb = inject(FormBuilder);
//   private quizService = inject(QuizService);
//   private router = inject(Router);

//   busy = signal(false);
//   error = signal<string | null>(null);

//   // nonNullable = better typing; supply initial values for all controls
//   quizForm = this.fb.nonNullable.group({
//     title: ['', [Validators.required, Validators.minLength(3)]],
//     description: [''],
//     duration: [10, [Validators.required, Validators.min(1)]],
//     questions: this.fb.nonNullable.array<FormArray>([])
//   });

//   get questions(): FormArray {
//     return this.quizForm.get('questions') as FormArray;
//   }

//   addQuestion() {
//     const q = this.fb.nonNullable.group({
//       questionText: ['', [Validators.required, Validators.minLength(3)]],
//       // tuple of 4 options
//       options: this.fb.nonNullable.control<[string, string, string, string]>(['', '', '', '']),
//       correctOption: [0, [Validators.required, Validators.min(0), Validators.max(3)]]
//     });
//     this.questions.push(q);
//   }

//   removeQuestion(index: number) {
//     this.questions.removeAt(index);
//   }

//   submitQuiz() {
//     if (this.quizForm.invalid) return;

//     this.busy.set(true);
//     this.error.set(null);

//     const payload = this.quizForm.getRawValue() as CreateQuizDto;

//     this.quizService.createQuiz(payload).subscribe({
//       next: () => {
//         this.busy.set(false);
//         this.router.navigate(['/quizzes']);
//       },
//       error: (err) => {
//         this.busy.set(false);
//         this.error.set(err?.error?.message ?? 'Failed to create quiz.');
//       }
//     });
//   }
// }
// import { Component, inject } from '@angular/core';
// import { ReactiveFormsModule, FormBuilder, FormArray } from '@angular/forms';
// import { QuizService } from '../shared/quiz.service';

// @Component({
//   selector: 'app-create-quiz',
//   standalone: true,
//   imports: [ReactiveFormsModule],
//   templateUrl: './create-quiz.html',
//   styleUrls: ['./create-quiz.css']
// })
// export class CreateQuiz {
//   private fb = inject(FormBuilder);
//   private quizService = inject(QuizService);

//   quizForm = this.fb.group({
//     title: '',
//     description: '',
//     duration: 10,
//     questions: this.fb.array([])
//   });

//   addQuestion() {
//     (this.quizForm.get('questions') as FormArray).push(
//       this.fb.group({
//         questionText: '',
//         options: ['', '', '', ''],
//         correctOption: 0
//       })
//     );
//   }

//   submitQuiz() {
//     this.quizService.createQuiz(this.quizForm.value).subscribe();
//   }
// }
