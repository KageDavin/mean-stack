// src/app/dashboard.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { AdminView } from './admin-view';
import { StudentView } from './student-view';

@Component({
  selector: 'dashboard',
  standalone: true,
  imports: [CommonModule, AdminView, StudentView],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  role = inject(AuthService).role(); // 'admin' or 'student'
}


// OLD Code - Updating to Signal-baed, Role-awareness
// src/app/admin/dashboard/dashboard.ts
// import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
// import { RouterLink } from '@angular/router';
// import { AuthService } from '../auth/auth.service';

// @Component({
//   selector: 'admin-dashboard',
//   templateUrl: './dashboard.html',
//   styleUrls: ['./dashboard.css'],
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   imports: [RouterLink],
//   host: { class: 'page admin-dashboard' }
// })
// export class AdminDashboard {
//   private auth = inject(AuthService);
//   user = this.auth.user;
//   isAdmin = () => this.auth.role() === 'admin';
// }
