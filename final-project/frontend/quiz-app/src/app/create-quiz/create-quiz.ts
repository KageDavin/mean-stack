import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { QuizService } from '../services/quiz.service';
import { inject, Signal } from '@angular/core';

@Component({
  selector: 'app-create-quiz',
  imports: [FormBuilder, QuizService],
  templateUrl: './create-quiz.html',
  styleUrl: './create-quiz.css'
})
export class CreateQuiz {

  // constructor(private quizService: QuizService) {}
  quizForm = inject(FormBuilder).group({
    title: '',
    description: '',
    duration: 10,
    questions: inject(Signal)([])
  });

  addQuestion() {
    this.quizForm.controls.questions.update(q => [
      ...q,
      { questionText: '', options: ['', '', '', ''], correctOption: 0 }
    ]);
  }

  submitQuiz() {
    this.quizService.createQuiz(this.quizForm.value).subscribe();
  }
}

