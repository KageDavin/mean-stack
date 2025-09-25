import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type User = { id:string; username:string; role:'admin'|'student' };
@Injectable({ providedIn:'root' })
export class AuthService {
  private base = '/api';
  private tokenKey = 'quiz_token';
  userSig = signal<User|null>(null);

  constructor(private http: HttpClient){
    const cached = localStorage.getItem(this.tokenKey);
    const user = localStorage.getItem('quiz_user');
    if (cached && user) {
      this.userSig.set(JSON.parse(user));
    }
  }

  isLoggedIn(){ return !!this.userSig(); }

  register(username:string, password:string, role:'admin'|'student'='student'){
    return this.http.post(`${this.base}/auth/register`, { username, password, role });
  }

  login(username:string, password:string){
    return this.http.post<{token:string, user:User}>(`${this.base}/auth/login`, { username, password }).subscribe(res=>{
      localStorage.setItem(this.tokenKey, res.token);
      localStorage.setItem('quiz_user', JSON.stringify(res.user));
      this.userSig.set(res.user);
    });
  }

  token(): string | null { return localStorage.getItem(this.tokenKey); }

  logout(){
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('quiz_user');
    this.userSig.set(null);
  }
}
