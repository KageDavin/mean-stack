// src/app/dashboard/flaoting-create-button.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'floating-create-button',
  standalone: true,
  templateUrl: './floating-create-button.html',
  styleUrls: ['../../styles.css'],
})
export class FloatingCreateButton {
  constructor(private router: Router) {}

  goToCreate() {
    this.router.navigate(['/quiz/new']);
  }
}
