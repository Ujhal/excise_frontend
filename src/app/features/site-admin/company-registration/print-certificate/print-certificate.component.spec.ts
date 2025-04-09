import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCertificateComponent } from './print-certificate.component';

describe('PrintCertificateComponent', () => {
  let component: PrintCertificateComponent;
  let fixture: ComponentFixture<PrintCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintCertificateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
