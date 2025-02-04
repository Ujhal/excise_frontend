import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-licensee-home',
  imports: [ CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    RouterModule,
    RouterOutlet,
    FontAwesomeModule,],
  templateUrl: './licensee-home.component.html',
  styleUrl: './licensee-home.component.scss'
})
export class LicenseeHomeComponent {

  loaded = true; // Set this based on your logic (e.g., after data is loaded)
  userName = 'John Doe2';
  snavToggle(sidenav: any) {
    sidenav.toggle();
  }
}
