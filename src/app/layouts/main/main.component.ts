import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [MaterialModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'] // Corrected styleUrls
})
export class MainComponent {
  selectedLink: string = '';

  navigateToExternal(url: string) {
    window.location.href = url;
  }  constructor(private router: Router) {} // Inject Router into the constructor

  navigateTo(page: string) {
    this.router.navigate(['/main', page]);
  }

  login(): void {
    this.router.navigate(['/login']); // Navigate to the login route
  }
}
