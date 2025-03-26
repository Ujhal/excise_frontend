import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SiteAdminService } from '../../site-admin-service';
import { SubDivision } from '../../../shared/models/subdivision.model';
import Swal from 'sweetalert2';
import { MaterialModule } from '../../../material.module';
import { Account } from '../../../shared/models/accounts';
import { District } from '../../../shared/models/district.model';

@Component({
  selector: 'app-edit-user',
  imports: [MaterialModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent {

}
