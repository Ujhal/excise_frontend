import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDistrictComponent } from './edit-district.component';

describe('EditDistrictComponent', () => {
  let component: EditDistrictComponent;
  let fixture: ComponentFixture<EditDistrictComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDistrictComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDistrictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
