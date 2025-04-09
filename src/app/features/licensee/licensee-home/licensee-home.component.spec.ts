import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseeHomeComponent } from './licensee-home.component';

describe('LicenseeHomeComponent', () => {
  let component: LicenseeHomeComponent;
  let fixture: ComponentFixture<LicenseeHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenseeHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicenseeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
