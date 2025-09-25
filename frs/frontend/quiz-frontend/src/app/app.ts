import { Component, computed, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.component.html',
  styles: [`
  header { display:flex; gap:1rem; align-items:center; padding:1rem; border-bottom:1px solid #eee; }
  main { padding: 1rem; max-width: 900px; margin: 0 auto; }
  nav a { text-decoration:none; margin-right: 0.5rem; }
  .spacer { flex:1; }
  `]
})
export class AppComponent {
  title = 'Online Quiz';
  constructor(public auth: AuthService) {}
  userRole = computed(()=> this.auth.userSig()?.role ?? null);
  logout(){ this.auth.logout(); }
}
