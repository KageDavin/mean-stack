// src/app/student/student-hisotry.ts
import { Component, inject, signal, effect } from '@angular/core';
import { ResponseStore } from '../shared/response.store';

@Component({
  selector: 'student-history',
  standalone: true,
  templateUrl: './student-history.html',
})
export class StudentHistory {
  private store = inject(ResponseStore);
  attempts = this.store.attempts; // signal<Attempt[]>
  loading = this.store.loading;

  constructor() {
    this.store.loadHistory(); // fetches past attempts
  }
}
