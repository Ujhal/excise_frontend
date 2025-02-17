import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import the Router from Angular

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'] // Corrected styleUrls
})
export class MainComponent {
  constructor(private router: Router) {} // Inject Router into the constructor

  login(): void {
    this.router.navigate(['/login']); // Navigate to the login route
  }
}
