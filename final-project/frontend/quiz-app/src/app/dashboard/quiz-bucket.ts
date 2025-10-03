// src/app/dashboard/quiz-bucket.ts
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import type { QuizPublic } from '../models/quiz-public.model';
import { QuizStore } from '../shared/quiz.store';

@Component({
  selector: 'quiz-bucket',
  templateUrl: './quiz-bucket.html',
})
export class QuizBucket {
 @Input({ required: true }) quizzes!: QuizPublic[];
@Input() type: 'published' | 'draft' = 'published';

  constructor(private store: QuizStore, private router: Router) {}

  get title() {
    return this.type === 'draft' ? 'Draft Quizzes' : 'Published Quizzes';
  }

  edit(id: string) {
    this.router.navigate(['/quiz', id, 'edit']);
  }

  delete(id: string) {
    this.store.delete(id);
  }

  publish(id: string) {
    this.store.togglePublish(id, true);
  }

  unpublish(id: string) {
    this.store.togglePublish(id, false);
  }

  preview(id: string) {
    this.router.navigate(['/quiz', id, 'preview']);
  }
}
