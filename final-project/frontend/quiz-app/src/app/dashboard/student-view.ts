// src/app/dashboard/student-view.ts
import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizService } from '../shared/quiz.service';
import { QuizStore } from '../shared/quiz.store';
import { QuizPublic } from '../models';
import { QuizBucket } from './quiz-bucket';

@Component({
  selector: 'student-view',
  imports: [CommonModule, QuizBucket],
  templateUrl: './student-view.html',
})
export class StudentView {
  private qs = inject(QuizService);
  private store = inject(QuizStore);

  private _quizzes = signal<QuizPublic[]>([]);
  private _filter = signal('');
  private _page = signal(1);
  private _pageSize = 5;

published = computed(() => this._quizzes().filter(q => q.published));

  get page() {
      return this._page();}

  filtered = computed<QuizPublic[]>(() => {
    const term = this._filter().toLowerCase();
    return this._quizzes().filter(q =>
      q.title.toLowerCase().includes(term)
    );
  });

  paged = computed<QuizPublic[]>(() => {
    const start = (this._page() - 1) * this._pageSize;
    return this.filtered().slice(start, start + this._pageSize);
  });

  totalPages = computed(() =>
    Math.ceil(this.filtered().length / this._pageSize)
  );

  constructor() {
    this.qs.list().subscribe(qs => this._quizzes.set(qs));
  }

  attempt(id: string) {
    this.store.load(id);
  }

  setFilter(term: string) {
    this._filter.set(term);
    this._page.set(1);
  }

  nextPage() {
    if (this._page() < this.totalPages()) this._page.update(p => p + 1);
  }

  prevPage() {
    if (this._page() > 1) this._page.update(p => p - 1);
  }
}
