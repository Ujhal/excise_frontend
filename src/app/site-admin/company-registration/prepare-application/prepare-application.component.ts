import { Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { CompanyDetailsComponent } from "./company-details/company-details.component";
import { MemberDetailsComponent } from './member-details/member-details.component';
import { UploadDocumentsComponent } from "./upload-documents/upload-documents.component";

@Component({
  selector: 'app-prepare-application',
  imports: [MaterialModule, CompanyDetailsComponent, MemberDetailsComponent, UploadDocumentsComponent],
  templateUrl: './prepare-application.component.html',
  styleUrl: './prepare-application.component.scss'
})
export class PrepareApplicationComponent {

}
