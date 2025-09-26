import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  host: { class: 'auth-page' }
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  busy = signal(false);
  error = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  async submit() {
    if (this.form.invalid) return;
    this.busy.set(true);
    this.error.set(null);
    const { username, password } = this.form.getRawValue();

    try {
      const res = await this.auth.login(username, password).toPromise();
      if (res) {
        this.auth.setSession(res);
        this.router.navigate(['/quizzes']);
      }
    } catch (e) {
      this.error.set('Invalid username or password.');
    } finally {
      this.busy.set(false);
    }
  }
}
