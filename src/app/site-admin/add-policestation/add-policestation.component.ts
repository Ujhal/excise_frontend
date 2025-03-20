import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../base/base.components';
import { BaseDependency } from '../../base/dependency/base.dependendency';
import { SubDivision } from '../../shared/models/subdivision.model';
import { SiteAdminService } from '../site-admin-service';
import { PatternConstants } from '../../config/app.constants';
import { PoliceStation } from '../../shared/models/policestation.model';

@Component({
  selector: 'app-add-policestation',
  imports: [MaterialModule, RouterModule],
  templateUrl: './add-policestation.component.html',
  styleUrl: './add-policestation.component.scss'
})
export class AddPolicestationComponent extends BaseComponent implements OnInit {
  patternConstants = PatternConstants;
  subdivisions: SubDivision[] = [];
  policeStation: PoliceStation = {
    id: 0,  // ✅ Ensure required fields exist
    PoliceStationName: '',
    PoliceStationCode: 0,
    SubDivisionCode: 0,
    isActive: true
  };
  policeStationId: number | null = null;
  isEditing: boolean = false;

  constructor(
    base: BaseDependency,
    private siteAdminService: SiteAdminService,
    protected override route: ActivatedRoute  // ✅ Change private to protected
  ) {
    super(base);
  }

  ngOnInit(): void {
    this.policeStationId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditing = !isNaN(this.policeStationId) && this.policeStationId > 0;

    if (this.isEditing) {
      this.loadPoliceStation();
    }

    this.siteAdminService.getSubDivision().subscribe(res => {
      this.subdivisions = res;
    });
  }

  loadPoliceStation(): void {
    this.siteAdminService.getPoliceStationBySubDivision(this.policeStationId!).subscribe(res => {
      this.policeStation = res[ 0 ];
    });
  }

  save(): void {
    const confirmText = this.isEditing
      ? 'You want to update this police station?'
      : 'You want to add a police station with given details?';

    this.myswal
      .fire({
        title: 'Are you sure?',
        text: confirmText,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: this.isEditing ? 'Update' : 'Save',
        cancelButtonText: 'Cancel',
      })
      .then((submit: { isConfirmed: boolean }) => {
        if (submit.isConfirmed) {
          if (this.isEditing) {
            this.siteAdminService.updatePolicestation(this.policeStationId!, this.policeStation)
              .subscribe((res: any) => {
                this.toastrService.success(res.message);
                this.router.navigate(['/site-admin/list-policestation']);
              });
          } else {
            this.siteAdminService.addPoliceStation(this.policeStation)
              .subscribe((res: any) => {
                this.toastrService.success(res.message);
                this.router.navigate(['/site-admin/list-policestation']);
              });
          }
        }
      });
  }

  cancel(): void {
    history.back();
  }
}
