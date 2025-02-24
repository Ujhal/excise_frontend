import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { CardModule } from '@coreui/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [MaterialModule, CardModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'] // Corrected styleUrls
})
export class MainComponent {
  navigateToExternal(url: string) {
    window.location.href = url;
  }  constructor(private router: Router) {} // Inject Router into the constructor

  login(): void {
    this.router.navigate(['/login']); // Navigate to the login route
  }
}
