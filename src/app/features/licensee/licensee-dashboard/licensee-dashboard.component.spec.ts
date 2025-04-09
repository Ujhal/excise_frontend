import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseeDashboardComponent } from './licensee-dashboard.component';

describe('LicenseeDashboardComponent', () => {
  let component: LicenseeDashboardComponent;
  let fixture: ComponentFixture<LicenseeDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenseeDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicenseeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
