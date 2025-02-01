import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { SiteAdminService } from './site-admin-service';


@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule,],
  
  providers: [],
})
export class SiteAdminModule { }