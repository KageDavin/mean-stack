import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  standalone:true,
  selector:'app-quiz-list',
  imports:[RouterLink],
  template:`
    <h2>Available Quizzes</h2>
    <button (click)="refresh()">Refresh</button>
    <ul>
      @for (q of api.quizzes(); track q._id) {
        <li>
          <strong>{{q.title}}</strong> — {{q.description}} ({{q.duration}} min)
          <a [routerLink]="['/quiz', q._id]">Start</a>
        </li>
      } @empty {
        <li>No quizzes yet.</li>
      }
    </ul>
  `
})
export class QuizListPage implements OnInit {
  constructor(public api: ApiService){}
  ngOnInit(){ this.refresh(); }
  refresh(){ this.api.listQuizzes(); }
}
