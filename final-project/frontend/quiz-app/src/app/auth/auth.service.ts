// src/app/auth/auth.service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

export type User = { id: string; username: string; role?: string };

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private accessKey = 'accessToken';
  private refreshKey = 'refreshToken';
  private userKey = 'authUser';

  private _user = signal<User | null>(this.restoreUser());
  user = computed(() => this._user());
  isAuthenticated = computed(() => !!this._user());
  role = computed(() => this._user()?.role ?? null);

  private restoreUser(): User | null {
    try {
      const raw = localStorage.getItem(this.userKey);
      return raw ? JSON.parse(raw) as User : null;
    } catch {
      return null;
    }
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    const res = await firstValueFrom(this.http.post<LoginResponse>(`${environment.api}/auth/login`, { username, password }));
    this.setSession(res);
    return res;
  }

  async register(username: string, password: string, role?: string): Promise<LoginResponse> {
    const payload: any = { username, password };
    if (role) payload.role = role;
    const res = await firstValueFrom(this.http.post<LoginResponse>(`${environment.api}/auth/register`, payload));
    this.setSession(res);
    return res;
  }

  async generateAdminCode(): Promise<string> {
  try {
    const res = await firstValueFrom(
      this.http.post<{ code: string }>(`${environment.api}/auth/generate-admin-code`, {}, {
        headers: { Authorization: `Bearer ${this.getAccessToken()}` }
      })
    );
    return res.code;
  } catch {
    throw new Error('Failed to generate admin code');
  }
}


  async verifyAdminCode(code: string): Promise<boolean> {
  try {
    const res = await firstValueFrom(
      this.http.post<{ valid: boolean }>(`${environment.api}/auth/verify-admin-code`, { code })
    );
    return res.valid;
  } catch {
    return false;
  }
}

  setSession(res: LoginResponse) {
    localStorage.setItem(this.accessKey, res.accessToken);
    localStorage.setItem(this.refreshKey, res.refreshToken);
    localStorage.setItem(this.userKey, JSON.stringify(res.user));
    this._user.set(res.user);
  }

  clearSession() {
    localStorage.removeItem(this.accessKey);
    localStorage.removeItem(this.refreshKey);
    localStorage.removeItem(this.userKey);
    this._user.set(null);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshKey);
  }

  async refreshAccessToken(): Promise<string | null> {
    const refresh = this.getRefreshToken();
    if (!refresh) return null;
    try {
      const res = await firstValueFrom(this.http.post<{ accessToken: string }>(`${environment.api}/auth/refresh`, { refreshToken: refresh }));
      localStorage.setItem(this.accessKey, res.accessToken);
      return res.accessToken;
    } catch {
      this.clearSession();
      return null;
    }
  }

  logout() {
    const refresh = this.getRefreshToken();
    if (refresh) {
      this.http.post(`${environment.api}/auth/logout`, { refreshToken: refresh }).subscribe({ next: () => {}, error: () => {} });
    }
    this.clearSession();
    this.router.navigate(['/login']);
  }
}



// ########### FORMAL CODE ###########
// import { Injectable, effect, signal, computed, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import type { LoginResponse, User, Role } from '../models/auth';
// import { environment } from '../../environments/environment.id';

// @Injectable({ providedIn: 'root' })

// export class AuthService {
//   private http = inject(HttpClient);
//   private router = inject(Router);

//   private _user = signal<User | null>(this.restoreUser());
//   user = computed(() => this._user());
//   isAuthenticated = computed(() => !!this._user());
//   role = computed<Role | null>(() => this._user()?.role ?? null);

//   private restoreUser(): User | null {
//     const raw = localStorage.getItem('authUser');
//     return raw ? JSON.parse(raw) as User : null;

//   login(username: string, password: string) {
//     return this.http.post<LoginResponse>(`${environment.api}/auth/login`, { username, password });
//   }

//   register(username: string, password: string) {
//     return this.http.post<LoginResponse>(`${environment.api}/auth/register`, { username, password });
//   }

//   setSession(res: LoginResponse) {
//     localStorage.setItem('accessToken', res.accessToken);
//     localStorage.setItem('refreshToken', res.refreshToken);
//     localStorage.setItem('authUser', JSON.stringify(res.user));
//     this._user.set(res.user);
//   }

//   async logout() {
//     const refreshToken = localStorage.getItem('refreshToken');
//     if (refreshToken) {
//       try {
//         await this.http.post(`${environment.api}/auth/logout`, { refreshToken }).toPromise();
//       } catch { /* ignore */ }
//     }
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('authUser');
//     this._user.set(null);
//     this.router.navigate(['/login']);
//   }
// }
// import { Observable, of } from 'rxjs';

// import { tap } from 'rxjs/operators';

// interface User {
//   id: string;
//   username: string;
//   email: string;
//   role: 'student' | 'teacher';
// }
