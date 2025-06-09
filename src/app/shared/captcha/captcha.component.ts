import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../material.module';
import { ApiService } from '../../core/services/api.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,FormBuilder } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-captcha',
  imports: [MaterialModule],
  templateUrl: './captcha.component.html',
  styleUrl: './captcha.component.scss'
})
export class CaptchaComponent implements OnInit {
  @Input() formGroup!: FormGroup; // Input for the parent form group

  captchaImageUrl: string = '';
  captchaKey: string = '';
  private baseUrl = `${environment.apiBaseUrl}`; // Base URL for the API

  constructor(private captchaService: ApiService) {}

  ngOnInit(): void {
    this.initializeFormControls(); // Ensure controls exist
    this.loadCaptcha();
  }

  // Ensure response and hashkey controls exist
  private initializeFormControls(): void {
    if (!this.formGroup.get('response')) {
      this.formGroup.addControl('response', new FormControl('', Validators.required));
    }
    if (!this.formGroup.get('hashkey')) {
      this.formGroup.addControl('hashkey', new FormControl('', Validators.required));
    }
  }

  loadCaptcha(): void {
    this.captchaService.getCaptcha().subscribe({
      next: (data: { key: string; image_url: string }) => {
        this.captchaImageUrl = `${this.baseUrl}${data.image_url}`;
        this.captchaKey = data.key;
        this.formGroup.patchValue({ hashkey: this.captchaKey });
      },
      error: (error) => {
        console.error('Error loading captcha:', error);
        alert('Failed to load captcha. Please try again.');
      },
    });
  }

  refreshCaptcha(event: Event): void {
    event.preventDefault();
    this.loadCaptcha();
  }

  onResponseChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.formGroup.patchValue({ response: input.value });
  }
}
