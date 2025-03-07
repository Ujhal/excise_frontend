import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MaterialModule } from '../../../../../material.module';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-license',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  templateUrl: './license.component.html',
  styleUrl: './license.component.scss'
})
export class LicenseComponent {
  licenseForm: FormGroup;

  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private router: Router) {
    this.licenseForm = this.fb.group({
    });
  }

  get sessionStorageEntries() {
    let data: { key: string; value: string }[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        data.push({ key, value: sessionStorage.getItem(key) || '' });
      }
    }
    return data;
  }

  goBack() {
    this.back.emit();
  }

  home(): void {
    this.router.navigate(['/']);
  }

}
