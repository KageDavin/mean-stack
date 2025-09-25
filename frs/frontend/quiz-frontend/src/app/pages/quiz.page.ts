import { Component, effect, model, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Quiz } from '../services/api.service';

@Component({
  standalone:true,
  selector:'app-quiz',
  template: `
    @if (quiz()) {
      <h2>{{ quiz()!.title }}</h2>
      <p>{{ quiz()!.description }}</p>
      <div>
        <p><strong>Question {{ currentIndex()+1 }} of {{ quiz()!.questions!.length }}</strong></p>
        <p>{{ currentQ()?.questionText }}</p>
        <ol>
          @for (opt of currentQ()?.options ?? []; let i = $index; track i) {
            <li>
              <label>
                <input type="radio" name="opt" [checked]="answers()[currentIndex()] === i" (change)="choose(i)">
                {{ opt }}
              </label>
            </li>
          }
        </ol>
        <button (click)="prev()" [disabled]="currentIndex()===0">Prev</button>
        <button (click)="next()" [disabled]="currentIndex()===(quiz()!.questions!.length-1)">Next</button>
        <button (click)="submit()">Submit</button>
      </div>
    } @else {
      <p>Loading...</p>
    }
  `
})
export class QuizPage {
  quiz = signal<Quiz|undefined>(undefined);
  answers = signal<number[]>([]);
  currentIndex = signal(0);

  constructor(private api: ApiService, route: ActivatedRoute, private router: Router){
    const id = route.snapshot.paramMap.get('id')!;
    this.api.getQuiz(id).subscribe(q => {
      this.quiz.set(q);
      this.answers.set(new Array(q.questions?.length ?? 0).fill(-1));
    });
  }

  currentQ(){ 
    const q = this.quiz();
    return q?.questions?.[this.currentIndex()] ?? null;
  }

  choose(i:number){
    const arr = this.answers().slice();
    arr[this.currentIndex()] = i;
    this.answers.set(arr);
  }

  next(){ this.currentIndex.update(v => v+1); }
  prev(){ this.currentIndex.update(v => v-1); }

  submit(){
    const id = this.quiz()?._id!;
    const payload = this.answers().map((sel, idx)=>({ questionIndex: idx, selectedOption: sel }));
    this.api.submitQuiz(id, payload).subscribe(res=>{
      this.router.navigate(['/result', res.responseId], { state: res });
    });
  }
}
