import { Component  } from '@angular/core';
import { AccountService } from '../../../../core/services/account.service';
import { MaterialModule } from '../../../../shared/material.module';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-profile',
  imports: [MaterialModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  user: any;
  loaded = false;

  constructor(public dialogRef: MatDialogRef<UserProfileComponent>, private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.getAuthenticationState().subscribe(acc => {
      if (acc !== null) {
        this.user = acc; // Store full user details
      }
      this.loaded = true;
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
