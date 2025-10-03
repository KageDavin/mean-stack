// src/app/admin/admin-code-generator.ts
import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'admin-code-generator',
  standalone: true,
  templateUrl: './admin-code-generator.html',
})
export class AdminCodeGenerator {
  private auth = inject(AuthService);

  code = signal('');
  error = signal('');
  copied = signal(false);

  async generate() {
    try {
      const newCode = await this.auth.generateAdminCode();
      this.code.set(newCode);
      this.error.set('');
      this.copied.set(false);
    } catch (err) {
      this.error.set('Failed to generate admin code.');
    }
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.code()).then(() => {
      this.copied.set(true);
    });
  }
}
