import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActOnDraftApplicationComponent } from './act-on-draft-application.component';

describe('ActOnDraftApplicationComponent', () => {
  let component: ActOnDraftApplicationComponent;
  let fixture: ComponentFixture<ActOnDraftApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActOnDraftApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActOnDraftApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
