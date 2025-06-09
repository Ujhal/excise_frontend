import { Component, inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CarouselComponent } from "./layouts/landing/carousel/carousel.component";
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [

    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    FontAwesomeModule,
    CarouselComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  title = 'excise_frontend';
  //showHeaderFooter = true; // Default to showing header/footer
  showCarousel = false;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private iconLibrary = inject(FaIconLibrary);

  constructor() {
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
    //this.showHeaderFooter = currentRoute?.snapshot.data?.['showHeaderFooter'] ?? true;
    this.showCarousel = currentRoute?.snapshot.data?.['showCarousel'] ?? false;



  
  }
}
