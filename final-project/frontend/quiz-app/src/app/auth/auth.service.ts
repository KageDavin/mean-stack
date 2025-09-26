import { Injectable, effect, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import type { LoginResponse, User, Role } from '../models/auth';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })

export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private _user = signal<User | null>(this.restoreUser());
  user = computed(() => this._user());
  isAuthenticated = computed(() => !!this._user());
  role = computed<Role | null>(() => this._user()?.role ?? null);

  private restoreUser(): User | null {
    const raw = localStorage.getItem('authUser');
    return raw ? JSON.parse(raw) as User : null;
    // token is stored separately in localStorage['accessToken'] / ['refreshToken']
  }

  login(username: string, password: string) {
    return this.http.post<LoginResponse>(`${environment.api}/auth/login`, { username, password });
  }

  register(username: string, password: string) {
    return this.http.post<LoginResponse>(`${environment.api}/auth/register`, { username, password });
  }

  setSession(res: LoginResponse) {
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    localStorage.setItem('authUser', JSON.stringify(res.user));
    this._user.set(res.user);
  }

  async logout() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await this.http.post(`${environment.api}/auth/logout`, { refreshToken }).toPromise();
      } catch { /* ignore */ }
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authUser');
    this._user.set(null);
    this.router.navigate(['/login']);
  }
}
// import { Observable, of } from 'rxjs';

// import { tap } from 'rxjs/operators';

// interface User {
//   id: string;
//   username: string;
//   email: string;
//   role: 'student' | 'teacher';
// }
