import { Component, signal } from '@angular/core';
import { OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoApiService } from './services/demo-api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App  implements OnInit {
  protected readonly title = signal('class-demos-app');
  private demoApi = inject(DemoApiService);
  demos: any[] = [];

  ngOnInit(): void {
    this.demoApi.getDemos().subscribe(data => {
      this.demos = data;
    });
  }
}


