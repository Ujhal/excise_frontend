import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyLicenseComponent } from './apply-license.component';

describe('ApplyLicenseComponent', () => {
  let component: ApplyLicenseComponent;
  let fixture: ComponentFixture<ApplyLicenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplyLicenseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
