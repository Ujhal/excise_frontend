import { Component,OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { BaseComponent } from '../../base/base.components';
import { BaseDependency } from '../../base/dependency/base.dependendency';
import { MatTableDataSource } from '@angular/material/table';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { District } from '../../shared/models/district.model';
import { SiteAdminService } from '../site-admin-service';
import { State } from '../../shared/models/state.model';
import { PatternConstants } from '../../config/app.constants';

@Component({
  selector: 'app-add-district',
  imports: [MaterialModule,RouterModule],
  templateUrl: './add-district.component.html',
  styleUrl: './add-district.component.scss'
})
export class AddDistrictComponent extends BaseComponent implements OnInit {
  patternConstants = PatternConstants;
  states: State[] = [];
  state!: State;
  district!: District;

  constructor(base: BaseDependency,
    private siteAdminService: SiteAdminService,
    ) {
    super(base);
  }

  ngOnInit(): void {
    this.state= new State();
    this.state.stateCode=11;
    this.state.stateName='Sikkim';
    this.states[0]=this.state;
    this.district = new District();

    this.district.IsActive = true;
  }

  save(): void {
    this.myswal
      .fire({
        title: 'Are you sure?',
        text: 'You want to add district with given details?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
      })
      .then((submit: { isConfirmed: any }) => {
        if (submit.isConfirmed) {
          this.siteAdminService.saveDistrict(this.district).subscribe(res => {
          this.toastrService.success(res.message);
          this.router.navigate(['/']);
          });
        }
      });
  }
  cancel(): void {
    this.router.navigate(['/previous-route']);  // Redirect to a specified route
  }
}
