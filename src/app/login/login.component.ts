import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { CaptchaComponent } from '../shared/components/captcha/captcha.component';
import { BaseComponent } from '../base/base.components';
import { BaseDependency } from '../base/dependency/base.dependendency';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  imports: [MaterialModule, CaptchaComponent],
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
      password: ['', Validators.required],
      otp: [''], // OTP input field
      response: ['', Validators.required], // Captcha response
      hashkey: ['', Validators.required], // Captcha hashkey
    });
  }

  toggleMode(isPassword: boolean): void {
    this.isPasswordMode = isPassword;
    this.otpSent = false;
    this.otpIndex = null;
    this.loginForm.reset(); // Reset form when switching modes
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
    formData.append('username', username); // ✅ Using FormData
  
    this.apiService.sendOtp(formData).subscribe({
      next: (response) => {
        console.log('✅ OTP API Response:', response);
        
        this.otpSent = true; // ✅ Track OTP request status
        alert('OTP sent successfully. Please check your phone.');
      },
      error: (err) => {
        console.error('❌ Error sending OTP:', err);
        alert('Failed to send OTP. Please try again.');
      }
    });
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

  private loginWithPassword(): void {
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
}
