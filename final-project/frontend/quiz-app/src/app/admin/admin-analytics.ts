//  src/app/admin/admin-analytics.ts
import { Component, inject, signal, effect } from '@angular/core';
import { QuizService } from '../shared/quiz.service';

@Component({
  selector: 'admin-analytics',
  standalone: true,
  templateUrl: './admin-analytics.html',
})
export class AdminAnalytics {
  private service = inject(QuizService);
  stats = signal<{ quizId: string; attempts: number; avgScore: number }[]>([]);
  loading = signal(true);

  constructor() {
    this.service.getAnalytics().then(data => {
      this.stats.set(data);
      this.loading.set(false);
    });
  }
}
