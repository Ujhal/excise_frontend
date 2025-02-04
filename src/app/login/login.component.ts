import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,FormBuilder } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { CaptchaComponent } from '../shared/components/captcha/captcha.component';
import { BaseComponent } from '../base/base.components';
import { BaseDependency } from '../base/dependency/base.dependendency';
@Component({
  selector: 'app-login',
  imports: [MaterialModule,ReactiveFormsModule,FormsModule,CaptchaComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends BaseComponent {
  loginForm: FormGroup;

  constructor(protected baseDependancy: BaseDependency, private fb: FormBuilder) {
    super(baseDependancy);
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      response: ['', Validators.required], // Captcha response
      hashkey: ['', Validators.required], // Captcha hashkey
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      alert("Please fill in all fields correctly.");
      return;
    }
    this.apiService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        const authenticatedUser = res.authenticated_user;
        
        if (authenticatedUser && authenticatedUser.access && authenticatedUser.refresh) {

          console.log(authenticatedUser,'user')
          const access = authenticatedUser.access;
          const refresh = authenticatedUser.refresh;
  
          localStorage.setItem('access', access);
          localStorage.setItem('refresh', refresh);
  
          // Fetch user identity after login
          this.accountService.identity(true).subscribe({
            next: (user) => {
              if (user) {
                console.log(user,'user2')
                this.toastrService.success('Login Successful');
                this.redirectBasedOnRole(user.role); // Redirect to role-based dashboard
              } else {
                console.error('User identity is null');
                alert('Failed to fetch user details. Please log in again.');
              }
            },
            error: (error) => {
              console.error('Error fetching identity:', error);
              alert("An error occurred while fetching user details. Please try again.");
            },
          });
        } else {
          alert("Check Username or Password");
        }
      },
      error: (error) => {
        console.error('Error:', error);
        alert("An error occurred. Please try again.");
      },
    });
  }
  
  private redirectBasedOnRole(role: string): void {
    switch (role) {
      case 'site_admin':
        this.router.navigate(['site-admin/dashboard']);
        break;
      case '2':
          this.router.navigate(['licensee/dashboard']);
          break;
  }
}
}
