import { Component, computed, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})

export class AppComponent {
  title = 'Online Quiz';
  constructor(public auth: AuthService) {}
  userRole = computed(()=> this.auth.userSig()?.role ?? null);
  logout(){ this.auth.logout(); }
}
