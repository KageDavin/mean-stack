import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'result',
  templateUrl: './result.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  host: { class: 'page' }
})
export class Result {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  result = signal<{ score: number; total: number; correct: number } | null>(null);

  constructor() {
    // In a real app, you'd have a GET /responses/:id endpoint.
    // For simplicity, assume the backend redirects here with an id and we can fetch if needed,
    // or the previous page passes navigation extras (omitted here).
    // As a basic UX, show a placeholder and suggest going back to list:
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    // Optional: fetch details if you create an endpoint; here, just show a static hint.
    // this.http.get(`${environment.api}/responses/${id}`).subscribe(...)
  }
}
