import { ChangeDetectionStrategy, Component, inject, signal, computed, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../shared/quiz.service';
import { ResponseService } from '../../shared/response.Service';
import type { QuizPublic } from '../../models/quiz';

@Component({
  selector: 'quiz-taker',
  templateUrl: './quiz-taker.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' }
})
export class QuizTaker {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private qs = inject(QuizService);
  private rs = inject(ResponseService);
  private destroyRef = inject(DestroyRef);

  quiz = signal<QuizPublic | null>(null);
  answers = signal<number[]>([]);
  secondsLeft = signal<number>(0);
  busy = signal(false);

  total = computed(() => this.quiz()?.questions.length ?? 0);
  progress = computed(() => {
    const a = this.answers();
    return a.length ? Math.round((a.filter(x => x !== -1).length / a.length) * 100) : 0;
  });

  private timerId: number | null = null;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.qs.getForAttempt(id).subscribe(q => {
      this.quiz.set(q);
      this.answers.set(new Array(q.questions.length).fill(-1));
      this.secondsLeft.set(q.duration * 60);
      this.startTimer();
    });
  }

  select(questionIndex: number, optionIndex: number) {
    const next = [...this.answers()];
    next[questionIndex] = optionIndex;
    this.answers.set(next);
  }

  private startTimer() {
    this.stopTimer();
    this.timerId = window.setInterval(() => {
      this.secondsLeft.update(s => s - 1);
      if (this.secondsLeft() <= 0) {
        this.stopTimer();
        this.submit();
      }
    }, 1000);

    // ensure timer cleared on destroy
    this.destroyRef.onDestroy(() => this.stopTimer());
  }

  private stopTimer() {
    if (this.timerId != null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  submit() {
    const q = this.quiz();
    if (!q) return;
    this.busy.set(true);

    const payload = {
      answers: this.answers().map((selectedOption, questionIndex) => ({ questionIndex, selectedOption }))
    };

    this.rs.attempt((q._id ?? q.id)!, payload).subscribe({
      next: (res) => {
        this.busy.set(false);
        this.router.navigate(['/results', res.id]);
      },
      error: () => this.busy.set(false)
    });
  }
}
