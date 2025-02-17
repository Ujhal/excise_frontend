import { Component, inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { MainComponent } from './layouts/main/main.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fontAwesomeIcons } from './config/font-awesome-icons';
import { CarouselComponent } from "./layouts/carousel/carousel.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    MainComponent,
    FontAwesomeModule,
    CarouselComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'excise_frontend';
  showHeaderFooter = true; // Default to showing header/footer

  private router = inject(Router);
  private iconLibrary = inject(FaIconLibrary);

  constructor() {
    this.iconLibrary.addIcons(...fontAwesomeIcons);

    // Listen for route changes to toggle header/footer visibility
    this.router.events.subscribe(event => {
  if (event instanceof NavigationEnd) {
    this.showHeaderFooter = !['/login', '/licensee-dashboard'].some(route => event.url.startsWith(route));
  }
});

  }
}