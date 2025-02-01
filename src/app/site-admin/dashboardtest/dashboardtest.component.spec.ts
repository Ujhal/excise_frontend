import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardtestComponent } from './dashboardtest.component';

describe('DashboardtestComponent', () => {
  let component: DashboardtestComponent;
  let fixture: ComponentFixture<DashboardtestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardtestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardtestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
