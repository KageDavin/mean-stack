import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'register',
  templateUrl: './register.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  host: { class: 'auth-page' }
})
export class Register {
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
      const res = await this.auth.register(username, password).toPromise();
      if (res) {
        this.auth.setSession(res);
        this.router.navigate(['/quizzes']);
      }
    } catch (e) {
      this.error.set('Unable to register. Try a different username.');
    } finally {
      this.busy.set(false);
    }
  }
}
// import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
// import { Router, RouterLink } from '@angular/router';
// import { AuthService } from '../auth.service';
// import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
