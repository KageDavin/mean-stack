// src/app/shared/response.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import type { AttemptPayload, AttemptResult } from '../models/response';

@Injectable({ providedIn: 'root' })
export class ResponseService {
  private http = inject(HttpClient);

  attempt(quizId: string, payload: AttemptPayload) {
    return this.http.post<AttemptResult>(`${environment.api}/quizzes/${quizId}/attempt`, payload);
  }

  history(studentId?: string) {
    const qs = studentId ? `?studentId=${encodeURIComponent(studentId)}` : '';
    return this.http.get(`${environment.api}/responses${qs}`);
  }
}












// import { Injectable, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../environments/environment';
// import type { AttemptPayload, AttemptResult } from '../models/response';

// @Injectable({
//   providedIn: 'root'
// })

// export class ResponseService {
//   private http = inject(HttpClient);

//   attempt(quizId: string, payload: AttemptPayload) {
//     return this.http.post<AttemptResult>(`${environment.api}/quizzes/${quizId}/attempt`, payload);
//   }

//   // optional: history
//   history(studentId?: string) {
//     const qs = studentId ? `?studentId=${encodeURIComponent(studentId)}` : '';
//     return this.http.get(`${environment.api}/responses${qs}`);
//   }
// }
