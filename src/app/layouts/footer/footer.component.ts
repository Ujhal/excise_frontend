import { Component, EventEmitter, Output } from '@angular/core';
import { MaterialModule } from '../../shared/material.module';
import { Router } from '@angular/router';
import {MatMenuModule} from '@angular/material/menu';


@Component({
  selector: 'app-footer',
  imports: [MaterialModule, MatMenuModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  selectedLink: string = '';

  constructor(private router: Router) {}

  navigateTo(page: string) {
    this.router.navigate(['/info', page]);
  }
}
