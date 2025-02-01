import { Component,OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-navbar',
  imports: [MaterialModule,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor(private router: Router) {} // Fixed constructor syntax

  login(): void {
    this.router.navigate(['/login']);
  }
}
