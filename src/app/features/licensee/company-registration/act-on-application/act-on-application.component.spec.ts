import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActOnApplicationComponent } from './act-on-application.component';

describe('ActOnApplicationComponent', () => {
  let component: ActOnApplicationComponent;
  let fixture: ComponentFixture<ActOnApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActOnApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActOnApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
