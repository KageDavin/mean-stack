import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  standalone: true,
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <h1>Welcome to Online Quiz</h1>
    <p>Practice and assess your knowledge with instant results.</p>
    <a routerLink="/quizzes">Browse Quizzes</a>
  `
})
export class HomePage {}
