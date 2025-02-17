import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { environment } from '../../environments/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MaterialModule } from '../material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  captchaImageUrl: SafeUrl = '';
  captchaKey: string = '';
  isPasswordMode: boolean = true; // Toggle between Password & OTP login
  isLoading: boolean = false; // Shows loading state when submitting
  errorMessage: string = ''; // Stores API error messages

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private router: Router // Added Router for navigation
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', Validators.required], // Ensure password is required in password mode
      captcha: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCaptcha();
  }

  loadCaptcha(): void {
    this.apiService.getCaptcha().subscribe(
      (response) => {
        this.captchaKey = response.key;
        const newUrl = `${environment.baseUrl}${response.image_url}?t=${new Date().getTime()}`;
        this.captchaImageUrl = this.sanitizer.bypassSecurityTrustUrl(newUrl);
      },
      (error) => {
        console.error('Error loading CAPTCHA:', error);
      }
    );
  }

  reloadCaptcha(): void {
    this.loadCaptcha();
  }

  toggleMode(mode: string): void {
    this.isPasswordMode = mode === 'password';
    this.loginForm.reset(); // Reset form values when switching modes

    // Remove password validation for OTP mode
    if (!this.isPasswordMode) {
      this.loginForm.get('password')?.clearValidators();
      this.loginForm.get('password')?.updateValueAndValidity();
    } else {
      this.loginForm.get('password')?.setValidators(Validators.required);
      this.loginForm.get('password')?.updateValueAndValidity();
    }
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = "Please fill out all required fields correctly.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const loginData = {
      username: this.loginForm.value.username,
      password: this.isPasswordMode ? this.loginForm.value.password : null,
      captcha: this.loginForm.value.captcha,
      captcha_key: this.captchaKey
    };

    this.apiService.login(loginData).subscribe(
      (response) => {
        console.log("Login successful:", response);
        this.isLoading = false;
        this.router.navigate(['/site-admin']); // Navigate to dashboard after successful login
      },
      (error) => {
        console.error("Login failed:", error);
        this.errorMessage = "Invalid credentials or CAPTCHA. Please try again.";
        this.isLoading = false;
        this.reloadCaptcha();
      }
    );
  }

  // ✅ Added method for Home Button navigation
  goToHome(): void {
    this.router.navigate(['/']);
  }

  // ✅ Disable login button while loading
  isFormDisabled(): boolean {
    return this.isLoading || this.loginForm.invalid;
  }
}
