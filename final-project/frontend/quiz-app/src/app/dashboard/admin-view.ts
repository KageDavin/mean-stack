// ─────────────────────────────────────────────
// File: src/app/admin/admin-view.ts
// Purpose: Admin dashboard with page progression, filtering, and floating action
// ─────────────────────────────────────────────

import { Component, inject, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { QuizStore } from '../shared/quiz.store';
import { QuizService } from '../shared/quiz.service';
import type { QuizPublic } from '../models/quiz-public.model';

@Component({
  selector: 'admin-view',
  templateUrl: './admin-view.html',
})
export class AdminView {
  private store = inject(QuizStore);
  private service = inject(QuizService);
  private router = inject(Router);

  quizzes = this.store.quizzes;
  loading = this.store.loading;
  error = this.store.error;

  filter = signal<'all' | 'published' | 'draft'>('all');
  page = signal(0);
  pageSize = 5;

  filtered = computed(() => {
    const all = this.quizzes();
    const mode = this.filter();
    if (mode === 'published') return all.filter(q => q.published);
    if (mode === 'draft') return all.filter(q => !q.published);
    return all;
  });

  paginated = computed(() => {
    const start = this.page() * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });

  constructor() {
    this.store.listAll();
  }

  edit(id: string) {
    this.store.setId(id);
    this.router.navigate(['/quiz', id, 'edit']);
  }

  delete(id: string) {
    this.store.delete(id);
  }

  togglePublish(id: string, publish: boolean) {
    this.store.togglePublish(id, publish);
  }

  createNew() {
    this.router.navigate(['/quiz', 'new', 'edit']);
  }

  nextPage() {
    const max = Math.ceil(this.filtered().length / this.pageSize);
    if (this.page() < max - 1) this.page.update(p => p + 1);
  }

  prevPage() {
    if (this.page() > 0) this.page.update(p => p - 1);
  }

  setFilter(mode: 'all' | 'published' | 'draft') {
    this.filter.set(mode);
    this.page.set(0);
  }
}
