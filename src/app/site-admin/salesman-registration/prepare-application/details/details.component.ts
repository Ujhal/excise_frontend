import { Component, EventEmitter, Output, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SiteAdminService } from '../../../site-admin-service';
import { PatternConstants, FormUtils } from '../../../../config/app.constants';
import { MaterialModule } from '../../../../material.module';

@Component({
  selector: 'app-details',
  imports: [MaterialModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit, OnDestroy{
  detailsForm: FormGroup;
  nationalities: string[] = ['Indian', 'Foreign'];
  
  @Output() readonly next = new EventEmitter<void>();
  @Output() readonly back = new EventEmitter<void>();

  private destroy$ = new Subject<void>();

  errorMessages = {
    firstName: signal(''),
    middleName: signal(''),
    lastName: signal(''),
    fatherName: signal(''),
    gender: signal(''),
    dob: signal(''),
    nationality: signal(''),
    address: signal(''),
    pan: signal(''),
    aadhaar: signal(''),
    mobileNumber: signal(''),
    emailId: signal(''),
    sikkimSubject: signal('')
  };

  constructor(private fb: FormBuilder, private siteAdminService: SiteAdminService) {
    const storedValues = this.getFromSessionStorage();

    this.detailsForm = this.fb.group({
      firstName: new FormControl(storedValues.firstName, [Validators.required, Validators.pattern(PatternConstants.NAME)]),
      middleName: new FormControl(storedValues.middleName, [Validators.pattern(PatternConstants.NAME)]),
      lastName: new FormControl(storedValues.lastName, [Validators.required, Validators.pattern(PatternConstants.NAME)]),
      fatherName: new FormControl(storedValues.fatherName, [Validators.required, Validators.pattern(PatternConstants.NAME)]),
      gender: new FormControl(storedValues.gender, [Validators.required]),
      dob: new FormControl(storedValues.dob, [Validators.required]),
      nationality: new FormControl(storedValues.nationality, [Validators.required]),
      address: new FormControl(storedValues.address, [Validators.required]),
      pan: new FormControl(storedValues.pan, [Validators.pattern(PatternConstants.PAN)]),
      aadhaar: new FormControl(storedValues.aadhaar, [Validators.required, Validators.pattern(PatternConstants.AADHAAR_NUMBER)]),
      mobileNumber: new FormControl(storedValues.mobileNumber, [Validators.required, Validators.pattern(PatternConstants.MOBILE)]),
      emailId: new FormControl(storedValues.emailId, [Validators.pattern(PatternConstants.EMAIL)]),
      sikkimSubject: new FormControl(storedValues.sikkimSubject, [Validators.required])
    });

    this.detailsForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.saveToSessionStorage();
      this.updateAllErrorMessages();
    });
  }
  
  ngOnInit() {
    FormUtils.capitalizePAN(this.detailsForm.get('pan')!, this.destroy$);
  }
  
  ngOnDestroy() {
    const storedDocuments = this.getStoredDocuments();
    Object.values(storedDocuments).forEach((doc: any) => {
      if (doc.fileUrl) {
        URL.revokeObjectURL(doc.fileUrl);
      }
    });
    this.destroy$.next();
    this.destroy$.complete();
  }

  get modeofOperation() {
    const storedData = sessionStorage.getItem('licenseDetails');
    return storedData ? JSON.parse(storedData).modeofOperation : null;
  }
  
  private getFromSessionStorage(): any {
    const storedData = sessionStorage.getItem('personDetails');
    const storedDocuments = this.getStoredDocuments();

    // Restore file metadata
    this.documents.forEach(doc => {
      if (storedDocuments[doc.name]) {
        doc.file = storedDocuments[doc.name]; // Restore file metadata
      }
    });
    return storedData ? JSON.parse(storedData) : {};
  }

  private saveToSessionStorage() {
    const formData = this.detailsForm.getRawValue(); // Ensures all values are captured
    sessionStorage.setItem('personDetails', JSON.stringify(formData));
  }
  
  private updateErrorMessage(field: keyof typeof this.errorMessages) {
    const control = this.detailsForm.get(field);
    if (control?.hasError('required')) {
      this.errorMessages[field].set('This field is required');
    } else if (control?.hasError('pattern')) {
      this.errorMessages[field].set('Invalid format');
    } else if (control?.hasError('email')) {
      this.errorMessages[field].set('Not a valid email');
    } else {
      this.errorMessages[field].set('');
    }
  }
  
  private updateAllErrorMessages() {
    Object.keys(this.errorMessages).forEach((field) => {
      this.updateErrorMessage(field as keyof typeof this.errorMessages);
    });
  }
  
    getErrorMessage(field: keyof typeof this.errorMessages) {
      return this.errorMessages[field]();
    }

    displayedColumns: string[] = ['serialNo', 'docType', 'upload', 'view'];

    documents = [
      { name: 'Passport Size Photo', format: 'png, jpg, jpeg', accept: '.png,.jpg,.jpeg', required: true, file: null },
      { name: 'Aadhaar card', format: 'pdf', accept: '.pdf', required: true, file: null },
      { name: 'Sikkim Subject Certificate/ Certificate of Identification / Residential Certificate', format: 'pdf', accept: '.pdf', required: true, file: null },
      { name: 'Date of Birth proof', format: 'pdf', accept: '.pdf', required: true, file: null }
    ];

    onFileSelect(event: any, document: any) {
      const file = event.target.files[0];
      if (file) {
        document.file = file;
    
        // Create a URL for the uploaded file
        const fileUrl = URL.createObjectURL(file);
    
        // Store file metadata + URL in sessionStorage
        const storedDocuments = this.getStoredDocuments();
        storedDocuments[document.name] = {
          name: file.name,
          type: file.type,
          size: file.size,
          fileUrl: fileUrl
        };
    
        sessionStorage.setItem('uploadedDocuments', JSON.stringify(storedDocuments));
      }
    }     
    
    private getStoredDocuments(): any {
      const storedDocs = sessionStorage.getItem('uploadedDocuments');
      return storedDocs ? JSON.parse(storedDocs) : {};
    }    
  
    viewFile(document: any) {
      const storedDocuments = this.getStoredDocuments();
      const docInfo = storedDocuments[document.name];
    
      if (docInfo?.fileUrl) {
        window.open(docInfo.fileUrl, '_blank');
      } else {
        console.warn("File not found in sessionStorage");
      }
    }  

    areDocumentsUploaded(): boolean {
      return this.documents.every(doc => !doc.required || this.getStoredDocuments()[doc.name]);
    }   
  
    proceedToNext() {
      if (this.detailsForm.valid && this.areDocumentsUploaded()) {
        this.next.emit();
      }
    }
    
    resetForm() {
      this.detailsForm.reset();
      sessionStorage.removeItem('personDetails');
    }

    goBack() {
      this.back.emit();
    } 
}
