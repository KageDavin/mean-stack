// src/app/auth/register.ts
import { Component, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'register-page',
  standalone: true,
  templateUrl: './register.html',
})
export class RegisterPage {
  private auth = inject(AuthService);
  private router = inject(Router);

  name = signal('');
  email = signal('');
  password = signal('');
  role = signal<'student' | 'admin'>('student');
  adminCode = signal('');
  error = signal('');

  async register() {
    try {
      const result = await this.auth.register(
        this.name(),
        this.password(),
        this.role()
      );

      this.router.navigate(['/dashboard']);
    } catch (err) {
      this.error.set('Registration failed');
    }
  }
}
