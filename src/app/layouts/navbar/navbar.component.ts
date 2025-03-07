import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { Router, RouterModule } from '@angular/router';
import { NavbarModule, NavModule } from '@coreui/angular';

@Component({
  selector: 'app-navbar',
  imports: [
    MaterialModule,
    RouterModule,
    NavbarModule,
    NavModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent{

  constructor(private router: Router) {}

  login(): void {
    this.router.navigate(['/login']);
  }

  home(): void {
    this.router.navigate(['/']);
  }
}
