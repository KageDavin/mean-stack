import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
   providedIn: 'root'
   })

export class Auth  {
  user = signal<User | null>(null);
  private endpoint = '/api/auth';

  constructor(private http: HttpClient, private router: Router) {
    const raw = localStorage.getItem('authUser');
    if (raw) this.user.set(JSON.parse(raw));
  }

  login(creds: {username: string, password: string}) {
    return this.http.post<{ token:string, user:User }>(`${this.endpoint}/login`, creds).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('authUser', JSON.stringify(res.user));
        this.user.set(res.user);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('authUser');
    this.user.set(null);
    this.router.navigate(['/login']);
  }
}

// import { tap } from 'rxjs/operators';

// interface User {
//   id: string;
//   username: string;
//   email: string;
//   role: 'student' | 'teacher';
// }
