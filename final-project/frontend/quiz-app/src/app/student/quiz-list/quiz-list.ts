import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { QuizService } from '../../shared/quiz.service';
import type { QuizPublic } from '../../models/quiz';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'quiz-list',
  templateUrl: './quiz-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AsyncPipe, DatePipe],
  host: { class: 'page' }
})
export class QuizList {
  private qs = inject(QuizService);

  loading = signal(true);
  quizzes = signal<QuizPublic[]>([]);
  count = computed(() => this.quizzes().length);

  constructor() {
    this.qs.list().subscribe({
      next: (data) => { this.quizzes.set(data); this.loading.set(false); },
      error: () => { this.quizzes.set([]); this.loading.set(false); }
    });
  }
}
// import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
// import { RouterLink } from '@angular/router';
// import { QuizService } from '../../shared/quiz.service';
// import type { QuizPublic } from '../../models/quiz';
// import { AsyncPipe, DatePipe } from '@angular/common';
