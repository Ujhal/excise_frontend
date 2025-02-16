import { Component, inject } from '@angular/core';import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { MainComponent } from './layouts/main/main.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fontAwesomeIcons } from './config/font-awesome-icons';
import { CarouselComponent } from "./layouts/carousel/carousel.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, MainComponent, FontAwesomeModule, CarouselComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'excise_frontend';

  private iconLibrary = inject(FaIconLibrary);

  constructor() {
    this.iconLibrary.addIcons(...fontAwesomeIcons);
  }
}
