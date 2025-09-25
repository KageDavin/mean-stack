import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule],
  template: `
    <h2>Login</h2>
    <form (ngSubmit)="submit()">
      <label>Username <input [(ngModel)]="username()" name="username"></label><br>
      <label>Password <input type="password" [(ngModel)]="password()" name="password"></label><br>
      <button type="submit">Login</button>
    </form>
  `
})
export class LoginPage {
  username = model('');
  password = model('');
  constructor(private auth: AuthService, private router: Router){}
  submit(){
    this.auth.login(this.username(), this.password());
    this.router.navigateByUrl('/');
  }
}
