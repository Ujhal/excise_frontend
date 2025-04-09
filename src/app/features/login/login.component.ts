import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';
import { CaptchaComponent } from '../../shared/captcha/captcha.component';
import { BaseComponent } from '../../base/base.components';
import { BaseDependency } from '../../base/dependency/base.dependendency';
import { ApiService } from '../../core/services/api.service';
import { NgOtpInputModule } from 'ng-otp-input';

@Component({
  selector: 'app-login',
  imports: [MaterialModule, CaptchaComponent, NgOtpInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends BaseComponent {
  loginForm: FormGroup;
  isPasswordMode: boolean = true;
  hidePassword = true;
  otpSent: boolean = false; // Tracks OTP request status
  otpIndex: string | null = null; // Stores index received from OTP request

  constructor(protected override baseDependency: BaseDependency, protected override apiService: ApiService, private fb: FormBuilder) {
    super(baseDependency);
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: [''],
      otp: [''],
      response: ['', Validators.required], // Captcha response
      hashkey: ['', Validators.required], // Captcha hashkey
    });

    this.setValidators(); // Set initial validation rules
  }

  /** Toggles between Password & OTP Login */
  toggleMode(isPassword: boolean): void {
    this.isPasswordMode = isPassword;
    this.otpSent = false;
    this.otpIndex = null;
    this.loginForm.reset(); // Reset form when switching modes
    this.setValidators(); // Update validation rules dynamically
  }

  /** Updates Form Validation Based on Login Mode */
  private setValidators(): void {
    if (this.isPasswordMode) {
      this.loginForm.controls['password'].setValidators(Validators.required);
      this.loginForm.controls['otp'].clearValidators();
    } else {
      this.loginForm.controls['password'].clearValidators();
      this.loginForm.controls['otp'].setValidators(Validators.required);
    }
    this.loginForm.controls['password'].updateValueAndValidity();
    this.loginForm.controls['otp'].updateValueAndValidity();
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  sendOtp(): void {
    if (this.loginForm.controls['username'].invalid) {
      alert('Please enter a valid phone number.');
      return;
    }

    const username = this.loginForm.value.username;
    console.log('🔹 Sending OTP request for:', username);

    const formData = new FormData();
    formData.append('username', username);

    this.apiService.sendOtp(formData).subscribe({
      next: (response) => {
        console.log('✅ OTP API Response:', response);
        this.otpSent = true;
      },
      error: (err) => {
        console.error('❌ Error sending OTP:', err);
        alert('Failed to send OTP. Please try again.');
      }
    });
  }

  get otpControl(): FormControl {
    return this.loginForm.get('otp') as FormControl;
  }  

  onLogin(): void {
    if (this.isPasswordMode) {
      this.loginWithPassword();
    } else {
      if (!this.otpSent) {
        this.sendOtp();
      } else {
        this.verifyOtp();
      }
    }
  }

  goToApplyLicense() {
    this.router.navigate(['/licensee/apply-license']);
  }

  private loginWithPassword(): void {
    if (this.loginForm.invalid) {
      alert("Please fill in all fields correctly.");
      return;
    }

    this.apiService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        this.handleAuthResponse(res);
      },
      error: (err) => {
        console.error('Login error:', err);
        alert('Incorrect username or password.');
      }
    });
  }

  onOtpChange(otp: string): void {
    this.loginForm.controls['otp'].setValue(otp);
  }  

  private verifyOtp(): void {
    if (!this.loginForm.value.otp) {
      alert('Please enter the OTP.');
      return;
    }

    if (this.otpIndex === undefined) {
      alert('OTP index missing. Please request OTP again.');
      return;
    }

    const requestData = {
      username: this.loginForm.value.username,
      otp: this.loginForm.value.otp,
      index: Number(this.otpIndex)
    };

    this.apiService.verifyOtp(requestData.username, requestData.otp, requestData.index).subscribe({
      next: (res: any) => {
        this.handleAuthResponse(res);
      },
      error: (err) => {
        console.error('OTP verification error:', err);
        alert('Invalid OTP. Please try again.');
      }
    });
  }

  private handleAuthResponse(res: any): void {
    if (res.authenticated_user?.access && res.authenticated_user?.refresh) {
      localStorage.setItem('access', res.authenticated_user.access);
      localStorage.setItem('refresh', res.authenticated_user.refresh);
      this.router.navigate(['/site-admin/dashboard']);
    } else {
      alert('Authentication failed.');
    }
  }

  resetPhoneNumber(): void {
    this.otpSent = false;
    this.loginForm.reset();
    this.setValidators(); // Reset validation rules
  }
}
