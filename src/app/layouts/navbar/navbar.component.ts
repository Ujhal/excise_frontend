import { Component, OnInit, inject } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { Router, RouterModule } from '@angular/router';
import { NavbarModule, NavModule } from '@coreui/angular';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  imports: [
    MaterialModule,
    RouterModule,
    NavbarModule,
    NavModule,
    MatSnackBarModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  private snackBar = inject(MatSnackBar);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.showSnackbar(); // ✅ Show Snackbar when component loads
  }

  showSnackbar() {
    this.snackBar.open('Welcome to the official website of Excise Department, Govt. of Sikkim', 'Close', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  home(): void {
    this.router.navigate(['/']);
  }
}
