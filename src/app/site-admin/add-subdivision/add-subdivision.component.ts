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
import { SubDivision } from '../../shared/models/subdivision.model';

@Component({
  selector: 'app-add-subdivision',
  imports: [MaterialModule,RouterModule],
  templateUrl: './add-subdivision.component.html',
  styleUrl: './add-subdivision.component.scss'
})
export class AddSubdivisionComponent  extends BaseComponent implements OnInit{
  patternConstants = PatternConstants;
  states: State[] = [];
  districts: District[] = [];
  state!: State;
  selectedDistrict!: District;
  subdivision!: SubDivision;

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
    this.subdivision = new SubDivision();
    
    this.siteAdminService.getDistrict().subscribe(res => {
      this.districts = res.filter((district: District) => district.IsActive === true);
    });
    this.subdivision.IsActive = true;
  }

  save(): void {
    this.myswal
      .fire({
        title: 'Are you sure?',
        text: 'You want to add subdivision with given details?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
      })
      .then((submit: { isConfirmed: any }) => {
        if (submit.isConfirmed) {
          this.siteAdminService.saveSubDivision(this.subdivision).subscribe(res => {
          this.toastrService.success(res.message);
          this.router.navigate(['/site-admin/list-subdivision']);
          });
        }
      });
  }
  cancel(): void {
    this.router.navigate(['/site-admin/list-subdivision']);  // Redirect to a specified route
  }
}

