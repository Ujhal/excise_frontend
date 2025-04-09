import { Component } from '@angular/core';
import { MaterialModule } from '../../../shared/material.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [MaterialModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'] // Corrected styleUrls
})
export class HomeComponent {
  selectedLink: string = '';

  navigateToExternal(url: string) {
    window.location.href = url;
  }  constructor(private router: Router) {} // Inject Router into the constructor

  navigateTo(page: string) {
    this.router.navigate(['/home', page]);
  }

  login(): void {
    this.router.navigate(['/login']); // Navigate to the login route
  }
}
