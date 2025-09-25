import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, Quiz } from '../services/api.service';

@Component({
  standalone:true,
  selector:'app-admin',
  imports:[FormsModule],
  template:`
    <h2>Admin</h2>
    <section>
      <h3>Create Quiz</h3>
      <label>Title <input [(ngModel)]="title()" name="title"></label>
      <label>Description <input [(ngModel)]="description()" name="description"></label>
      <label>Duration <input type="number" [(ngModel)]="duration()" name="duration"></label>
      <div>
        <h4>Questions</h4>
        @for (q of questions(); let qi = $index; track qi) {
          <div style="border:1px solid #ddd; padding:0.5rem; margin:.5rem 0;">
            <input [(ngModel)]="q.questionText" placeholder="Question text" name="qt{{qi}}">
            <ol>
              @for (opt of q.options; let oi=$index; track oi) {
                <li><input [(ngModel)]="q.options[oi]" placeholder="Option {{oi+1}}" name="o{{qi}}-{{oi}}"></li>
              }
            </ol>
            <label>Correct index <input type="number" [(ngModel)]="q.correctOption" min="0" max="3"></label>
            <button (click)="removeQuestion(qi)">Remove</button>
          </div>
        } @empty {
          <p>No questions yet.</p>
        }
        <button (click)="addQuestion()">Add Question</button>
      </div>
      <button (click)="create()">Create Quiz</button>
    </section>
    <hr>
    <section>
      <h3>Manage Quizzes</h3>
      <button (click)="refresh()">Refresh</button>
      <ul>
        @for (q of api.quizzes(); track q._id) {
          <li>
            <strong>{{ q.title }}</strong>
            <button (click)="del(q._id)">Delete</button>
          </li>
        } @empty { <li>None</li> }
      </ul>
    </section>
  `
})
export class AdminPage {
  title = signal('');
  description = signal('');
  duration = signal(10);
  questions = signal<{questionText:string; options:string[]; correctOption:number}[]>([]);

  constructor(public api: ApiService){ this.refresh(); }

  addQuestion(){ this.questions.update(arr => [...arr, { questionText:'', options:['','','',''], correctOption:0 }]); }
  removeQuestion(i:number){ this.questions.update(arr => arr.toSpliced(i,1)); }

  create(){
    const payload = { title:this.title(), description:this.description(), duration:this.duration(), questions:this.questions() };
    this.api.createQuiz(payload).subscribe(()=>{
      this.title.set(''); this.description.set(''); this.duration.set(10); this.questions.set([]);
      this.refresh();
    });
  }
  refresh(){ this.api.listQuizzes(); }
  del(id:string){ this.api.deleteQuiz(id).subscribe(()=>this.refresh()); }
}
