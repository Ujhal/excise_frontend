import { Component,OnInit} from '@angular/core';
import { Account } from '../../shared/models/accounts';
import { District } from '../../shared/models/district.model';
import { SubDivision } from '../../shared/models/subdivision.model';
import { BaseComponent } from '../../base/base.components';
import { BaseDependency } from '../../base/dependency/base.dependendency';
import { SiteAdminService } from '../site-admin-service';
import { MaterialModule } from '../../material.module';
@Component({
  selector: 'app-add-user',
  imports: [MaterialModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent extends BaseComponent implements OnInit {
  user: Account = new Account();
  districts: District[] = [];
  subdivisons:SubDivision[] =[];

  constructor(base: BaseDependency, private siteAdminService: SiteAdminService) {
    super(base);
  }

  ngOnInit(): void {
    this.user.is_active = true; 
    this.loadDistricts();
    
  }

  loadDistricts(): void {
    this.siteAdminService.getDistrict().subscribe((data: District[]) => {
      this.districts = data; // Populate the districts list
    }, error => {
      this.toastrService.error('Failed to load districts.');
    });
  }
  onDistrictChange(id: number): void {
    this.siteAdminService.getSubDivisionByDistrictCode(id).subscribe(
      (data: SubDivision[]) => {
        this.subdivisons = data; // Populate the districts list
      },
      (error) => {
        this.toastrService.error('Failed to load subdivisions.');
      }
    );
  }
 
 
  
  
  submit(): void {
    if (this.user.password !== this.user.confirm_password) {
      this.toastrService.error('Passwords do not match!');
      return;
    }

    this.myswal
      .fire({
        title: 'Are you sure?',
        text: 'You want to add this user?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
      })
      .then((submit: { isConfirmed: any }) => {
        if (submit.isConfirmed) {
          this.siteAdminService.saveUser(this.user).subscribe(res => {
            this.toastrService.success(res.message);
            this.router.navigate(['/site-admin/list-user']);
          });
        }
      });
  }

  cancel(): void {
    history.back(); 
  }
}

