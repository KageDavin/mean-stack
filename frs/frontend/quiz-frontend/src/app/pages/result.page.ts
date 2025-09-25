import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone:true,
  selector:'app-result',
  template:`
    <h2>Result</h2>
    <p>Your score: <strong>{{ score }}</strong> / {{ total }}</p>
    <p><a href="/">Go Home</a></p>
  `
})
export class ResultPage {
  score = 0;
  total = 0;
  constructor(router: Router){
    const nav = router.getCurrentNavigation();
    const st = nav?.extras.state as any;
    this.score = st?.score ?? 0;
    this.total = st?.total ?? 0;
  }
}
