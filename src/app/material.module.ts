import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCard } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';  
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {  MatTableDataSource } from '@angular/material/table';
import {MatStep, MatStepLabel, MatStepper, MatStepperModule} from "@angular/material/stepper";
import { MatIcon } from '@angular/material/icon'; 
import { MatPaginator } from '@angular/material/paginator';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@NgModule({
  imports: [
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatStepper,
    MatCard,
    MatStepLabel,
    MatStep,
    FormsModule,
    CommonModule,
    CdkTextareaAutosize,
    MatButtonModule,
    MatIcon,
    MatPaginator,
    FontAwesomeModule,
    MatFormFieldModule,
    MatDividerModule,
    MatSelectModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSidenavModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatTooltipModule,

   
  ],
  exports: [
    MatPaginator,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatCard,
    FormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDividerModule,
    MatDialogModule,
    MatSelectModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatTabsModule,
    MatListModule,
    MatRadioModule,
    MatSidenavModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatIcon,
    MatTooltipModule,
    MatStepperModule,
    FontAwesomeModule
  ],
  providers: [MatNativeDateModule,Validators,FormBuilder,MatTableDataSource],
})
export class MaterialModule {}
