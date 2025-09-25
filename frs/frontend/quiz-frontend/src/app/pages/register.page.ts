import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  standalone:true,
  selector:'app-register',
  imports:[FormsModule],
  template:`
    <h2>Register</h2>
    <form (ngSubmit)="submit()">
      <label>Username <input [(ngModel)]="username()" name="username"></label><br>
      <label>Password <input type="password" [(ngModel)]="password()" name="password"></label><br>
      <label>Role
        <select [(ngModel)]="role()" name="role">
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
      </label><br>
      <button type="submit">Create account</button>
    </form>
  `
})
export class RegisterPage {
  username = model('');
  password = model('');
  role = model<'admin'|'student'>('student');
  constructor(private auth: AuthService, private router: Router){}
  submit(){
    this.auth.register(this.username(), this.password(), this.role()).subscribe(()=>{
      this.auth.login(this.username(), this.password());
      this.router.navigateByUrl('/');
    });
  }
}
