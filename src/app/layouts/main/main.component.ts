import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { CardModule } from '@coreui/angular';

@Component({
  selector: 'app-main',
  imports: [MaterialModule, CardModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  navigateToExternal(url: string) {
    window.location.href = url;
  }
}
