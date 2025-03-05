import { Component, inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { MainComponent } from './layouts/main/main.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fontAwesomeIcons } from './config/font-awesome-icons';
import { CarouselComponent } from "./layouts/carousel/carousel.component";
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    FontAwesomeModule,
    CarouselComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'excise_frontend';
  showHeaderFooter = true; // Default to showing header/footer
  showCarousel = false;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private iconLibrary = inject(FaIconLibrary);

  constructor() {
    this.iconLibrary.addIcons(...fontAwesomeIcons);

    // Listen for route changes to toggle header/footer visibility
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.updateLayoutVisibility();
    });

  }

  private updateLayoutVisibility() {
    let currentRoute = this.route.firstChild;
    while (currentRoute?.firstChild) {
      currentRoute = currentRoute.firstChild; // Drill down to the deepest active route
    }

    // Fallback to default values if data is not defined
    this.showHeaderFooter = currentRoute?.snapshot.data?.['showHeaderFooter'] ?? true;
    this.showCarousel = currentRoute?.snapshot.data?.['showCarousel'] ?? false;
  }
}
